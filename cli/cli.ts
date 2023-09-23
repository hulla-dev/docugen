import { atom } from "nanostores"
import { createDocs, listFiles } from "~src/filesystem"
import { toMarkdown } from "~src/formatter"
import { getDocsData, parseFiles } from "~src/parser"
import { parseArgs } from "./args"
import { type Config, type UserConfig, config as defaultConfig } from "./config"

export async function cli(args: string[]) {
  // 0. Initialize config (defaults)
  const config = atom(defaultConfig)
  const updateConfig = (newConfig: Partial<Config>) => config.set({ ...config.get(), ...(newConfig as Config) })
  // 1. Handle CLI arguments (update config)
  await parseArgs(args, updateConfig)
  const userConfig = config.get() as UserConfig
  // 2. List files to parse
  const relevantFiles = listFiles(userConfig.includes, userConfig.files, userConfig.excludes)
  // 3. Parse files, create a lexical tree and create documentation data
  const rawLexTree = await parseFiles(relevantFiles)
  // 4. Prepare data for transformation
  // These essentialy create { [path]: Array<{ declaration: Declaration, docs: Docs }> } mappings
  const data = await getDocsData(rawLexTree)
  // 5. Transform data to markdown
  const md = toMarkdown(data, userConfig.adapter)
  // 6. Write to files
  await createDocs(md, userConfig.outDir)
}
