import { DOC_END, DOC_LINE, DOC_START, FLAVOR_TEXT, KEYWORDS, STOP_WORDS, TAGS } from "~locale/tsdoc"
import { entries, keys } from "~util/objects"
import { firstOccurance, removeFirstOccurrence, replaceAll, terminateOn } from "~util/strings"

type LexTree = {
  [path: string]: {
    [declaration: string]: string[]
  }
}

export type Docs = {
  description: string
  tags: string[]
}

export type Declaration = {
  type: string
  name: string
  properties: string
}

export type DocsData<L extends LexTree = LexTree> = {
  [K in keyof L]: Array<{
    declaration: Declaration
    docs: Docs
  }>
}

/**
 * Parses the contents of the specified files and extracts TSDoc comments.
 * @param files An array of file paths to parse.
 * @returns An object that maps file paths to an object that maps TSDoc declarations to an array of comment strings.
 */
export async function parseFiles(files: string[]) {
  // biome-ignore lint: lint/style/useConst
  let result: LexTree = {}
  const promises = files.map(async (file) => {
    const stream = Bun.file(file).stream()
    const reader = stream.getReader()
    let contents = ""
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      const line = new TextDecoder().decode(value)
      contents += line
    }
    const lines = contents.split("\n")
    const trimmedlines = lines.map((line) => line.trim())
    let doc_start: number | undefined
    let doc_end: number | undefined
    if (trimmedlines.includes(DOC_START)) {
      for (let i = 0; i < trimmedlines.length; i++) {
        // Finds the beginning of the docstring
        // We use direct equals over includes since thed docstring should always be on newline (to prevent misfires like `const tag = "/**"`)
        // in the future will probably have to do bit more complex since in other languages like python this is not the case
        if (trimmedlines[i].includes(DOC_START) && doc_start === undefined) {
          doc_start = i
        }
        // Finds the end of the docstring
        if (trimmedlines[i].includes(DOC_END)) {
          doc_end = i
        }
        // Now we just need to find what it's actually documenting
        if (
          doc_start !== undefined &&
          doc_end !== undefined &&
          KEYWORDS.some((keyword) => trimmedlines[i].includes(keyword))
        ) {
          result[file] = { ...result[file], [lines[i]]: lines.slice(doc_start!, doc_end!) }
          // Reset the doc_start and doc_end for the next docstring
          doc_end = undefined
          doc_start = undefined
        }
      }
      return
    }
  })
  await Promise.all(promises)
  return result
}

function parseDeclaration(declaration: string) {
  const type = firstOccurance(declaration, KEYWORDS)
  const name = terminateOn(declaration.slice(declaration.indexOf(type) + type.length).trim(), STOP_WORDS)
  const rawProperties = terminateOn(declaration.slice(0, declaration.indexOf(type)).trim(), [type])
  const properties = replaceAll(rawProperties, FLAVOR_TEXT).trim()
  return { type, name, properties }
}

function parseDocs(docs: string[]): Docs {
  const lines = docs
    .map((line) => removeFirstOccurrence(line, [DOC_START, DOC_END, DOC_LINE]).trim())
    .filter((line) => line !== "")
  let description = ""
  let tagtext = ""
  return lines.reduce((res, line, index) => {
    // The start lines are always descriptors of the documentation
    if (index === 0 && !line.startsWith("@")) {
      description = line
      return {
        description,
        tags: [],
      }
    }
    // Now we need to check for end of description
    if (description && !line.startsWith("@")) {
      description += `\n${line}`
      return {
        description,
        tags: [],
      }
    }
    // Now we just need to parse rest of the tags
    if (line.startsWith("@")) {
      // We annull the description, since we're now onto parsing tags
      description = ""
      const tag = firstOccurance(line, keys(TAGS))
      if (!tag) {
        console.warn(`Skipping unsupported tag detected in line ${line}`)
        return res
      }
      tagtext = line
      return {
        ...res,
        tags: [...(res.tags || []), line],
      }
    }
    // Got a tag that continues on newline
    if (tagtext) {
      tagtext += `\n${line}`
      return {
        ...res,
        tags: [...res.tags.slice(0, -1), tagtext],
      }
    }
    return res
  }, {} as Docs)
}

export function getDocsData(lexTree: LexTree): DocsData {
  // biome-ignore lint: lint/style/useConst
  let result: DocsData = {}
  entries(lexTree).forEach(([path, declarations]) => {
    entries(declarations).forEach(([rawDeclaration, rawDocs]) => {
      const declaration = parseDeclaration(rawDeclaration as string)
      const docs = parseDocs(rawDocs)
      if (!docs.description || !docs.tags) {
        return
      }
      result[path] = [...(result[path] || []), { declaration, docs }]
    })
  })
  return result
}
