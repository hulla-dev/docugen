import { keys } from '~util/objects'
import { type Config, keepConfigProperties } from "./config"

/**
 * Argument definitions
 */
const ARGS = {
  //  [shorthand, long-name, follow-up-arg-count, default-value]
  outDir: ["-o", "--outDir", 1, "./docs"],
  includes: ["-i", "--includes", 1, ["./src"]],
  excludes: ["-e", "--excludes", 1, ["./dist", "node_modules"]],
  adapter: ["-a", "--adapter", 1, "starlight"],
  format: ["-f", "--format", 1, ".md"],
  files: ["-F", "--files", 1, [".js", ".jsx", ".ts", ".tsx"]],
  meta: ["-m", "--meta", 0, true],
  help: ["-h", "--help", 0, false],
  config: ["-c", "--config", 1, "./docugen.json"],
} as const

/**
 * Checks whether an argument exists in the args array
 * @param args {string[]} Array of arguments
 * @param arg {keyof typeof ARGS} The argument to check
 * @returns Whether the argument exists in the args array
 */
function detected(args: string[], arg: keyof typeof ARGS) {
  return args.includes(ARGS[arg][0]) || args.includes(ARGS[arg][1])
}

/**
 * Detects the argument key from the args array
 * @param args {string[]} Array of arguments
 * @param arg {keyof typeof ARGS} The argument to check
 * @returns The argument key or null if not found
 * @example
 * ```ts
 * const args = ["-o", "./docs", "-i", "./src"]
 * getCLIKey(args, "output") // "-o"
 * getCLIKey(args, "includes") // "--includes"
 * getCLIKey(args, "nonExistent") // null (this also throws TS-Error in compiler)
 * ```
 */
function getCLIKey(args: string[], arg: keyof typeof ARGS) {
  return args.includes(ARGS[arg][0]) ? ARGS[arg][0] : ARGS[arg][1]
}

/**
 * Gets the argument key from the ARGS object based on the CLI argument
 * @param arg {string} The CLI argument to check
 * @returns The argument key or null if not found
 * @example
 * ```ts
 * const args = ["-o", "./docs", "-i", "./src"]
 * getArgKey("-o") // "outdir"
 * getArgKey("--includes") // "includes"
 * getArgKey("--nonExistent") // null (this also throws TS-Error in compiler)
 * ```
 */
function getArgKey(arg: ReturnType<typeof getCLIKey>): keyof typeof ARGS {
  return keys(ARGS).find(
    (key) => ARGS[key as keyof typeof ARGS][0] === arg || ARGS[key as keyof typeof ARGS][1] === arg,
  ) as keyof typeof ARGS
}

/**
 * Detects the index of the argument in the args array
 * @param args {string[]} Array of arguments
 * @param arg {keyof typeof ARGS} The argument to check
 * @returns The index of the argument or null if not found
 * @example
 * ```ts
 * const args = ["-o", "./docs", "-i", "./src"]
 * exactIndex(args, "outdir") // 1
 * exactIndex(args, "includes") // 3
 * exactIndex(args, "excludes") // null
 * ```
 */
function exactIndex(args: string[], arg: keyof typeof ARGS) {
  const argKey = getCLIKey(args, arg)
  const index = args.indexOf(argKey)
  return index === -1 ? null : index
}

/**
 * Gets the value of argument
 * @param args {string[]} Array of arguments
 * @param arg {keyof typeof ARGS} The argument to check
 * @returns The passed CLI argument. If not prevent in args, returns the default value
 */
function argValue(args: string[], arg: keyof typeof ARGS) {
  const index = exactIndex(args, arg)
  if (index === null) {
    return ARGS[arg][3]
  }
  return args[index + ARGS[arg][2]]
}

/**
 * Parses command line arguments and generates documentation based on the configuration
 * @param args {string[]} Array of command line arguments
 * @param config {Config} Configuration object for documentation generation
 * @warning This function mutates the config object
 * @returns A Promise that resolves when documentation generation is complete
 * @example
 * ```ts
 * const args = ["-o", "./docs", "-i", "./src"]
 * const config = {
 *   outDir: "./docs",
 *   includes: ["./src"]
 * }
 * parseArgs(args, config)
 * ```
 */
export async function parseArgs(args: string[], updateConfig: (newConfig: Partial<Config>) => void) {
  /* ------------------------------- Handle help ------------------------------ */
  if (detected(args, "help")) {
    console.info(`docugen CLI Helper. Consult https://hulla.dev/docs/docugen for more info \n\nUsage: docugen [options]\n\nOptions:\n\n
    -c, --config <path> \t\t\
    Path to config file. Default: "./docugen.json"\n\n
    \t << Note: You may not need additional options if you point to config file (recommended) >> \n\n
    -o, --outdir <path> \t\t\
    Output directory for generated documentation. Default: "./docs"\n\n
    -i, --includes [<paths>] \t\t\
    Paths to include in documentation generation. Default: ["./"]\n\n
    -e, --excludes [<paths>] \t\t\
    Paths to exclude from documentation generation. Default: ["./dist", "node_modules"]\n\n
    -a, --adapter <adapter> \t\t\
    Adapter to use for documentation generation. Default: "starlight"\n\n
    -f, --format <format> \t\t\
    Format to use for documentation generation. Default: ".md"\n\n
    -F, --files [<files>] \t\t\
    File extensions to include in documentation generation. Default: [".js", ".jsx", ".ts", ".tsx"]\n\n
    -m=<boolean>, --meta=<boolean> \t\
    Whether to include meta information in documentation. Default: true\n\n
    -h, --help \t\t\t\t\
    Display the help dialog`)
    // We don't want to run anything on help. Abandoning program
    return
  }

  /* ------------------------------- Config file ------------------------------ */
  if (detected(args, "config")) {
    const path = argValue(args, "config")
    try {
      const configFile = Bun.file(path as string)
      const loadedConfig = (await configFile.json()) as Config
      updateConfig(keepConfigProperties(loadedConfig))
    } catch (err) {
      console.error(`[docugen]: ERROR - Config file "${argValue(args, "config")}" does not exist!`)
      throw err
    }
  }

  /* ------------------------------- Handle args ------------------------------ */
  // We slice from 2 because the first 2 are [bun-executable, index-executable]
  args.slice(2).forEach((arg) => {
    // We only want to handle arguments that start with - or -- to handle CLI params
    if (arg.startsWith("-")) {
      // Special argument that uses = notation for value
      if (arg.startsWith("-m") || arg.startsWith("--meta")) {
        const [keyword, value] = arg.split("=")
        if (keyword === "-m" || keyword === "--meta") {
          // We allow --meta / -m to act as shorthand for --meta=true / -m=true
          updateConfig({ meta: value === "true" || value === undefined  })
        } else {
          console.error(`[docugen]: ERROR - Invalid argument "${arg}"`)
          throw new Error(`[docugen]: Invalid argument "${arg}"`)
        }
      } else {
        // All other arguments
        const argKey = getArgKey(arg as ReturnType<typeof getCLIKey>)
        // Parameter not part of the ARGS object, can ignore it
        // or it's a special param (config, help which are handled above)
        if (argKey === null || argKey === "config" || argKey === "help") {
          return
        }
        const value = argValue(args, argKey)
        if (value && argKey) {
          switch (argKey) {
            // Array objects need to be converted to arrays
            case "includes":
            case "excludes":
            case "files":
              updateConfig({ [argKey]: (value as string).split(",").map((item) => item.trim().replace(/\[|\]/g, "")) })
              break
            default:
              updateConfig({ [argKey]: value })
              break
          }
        }
      }
    }
  })
}
