import { keys } from "~util/objects"

type TupleVariations<T extends readonly unknown[]> = T extends []
  ? []
  : T extends [infer Head, ...infer Tail]
  ? Head extends unknown
    ? [...TupleVariations<Tail>, Head] | [Head, ...TupleVariations<Tail>] | [Head] | TupleVariations<Tail>
    : never
  : never

type Required<T> = {
  [P in keyof T]-?: T[P]
}

type Format = ".md"
export type Adapter = "none" | "starlight"
type Files = TupleVariations<[".js", ".jsx", ".ts", ".tsx"]>

export type Config = {
  outDir: string
  includes: string[]
  excludes?: string[]
  adapter?: Adapter
  format: Format
  files?: Files
  meta?: boolean
}

export type UserConfig = Required<Config>

export const config: Config = {
  outDir: "./docs",
  includes: ["."],
  excludes: ["./dist", "./node_modules"],
  adapter: "starlight",
  format: ".md",
  files: [".js", ".jsx", ".ts", ".tsx"],
  meta: true,
}

export function keepConfigProperties(obj: Record<string, unknown>): Config {
  const configKeys = keys(config)
  const filtered = keys(obj).filter((key) => configKeys.includes(key as keyof Config))
  const configObj = filtered.reduce(
    (acc, key) => ({
      ...acc,
      [key]: obj[key],
    }),
    {},
  )
  return configObj as Config
}
