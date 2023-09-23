import type { Adapter } from "~cli/config"
import { TAGS } from "~locale/tsdoc"
import { entries, keys } from "~util/objects"
import { getFileName } from "./filesystem"
import type { Declaration, Docs, DocsData } from "./parser"

export type Documents<D extends DocsData> = {
  [K in keyof D]: string
}

function addFrontmatter(path: string) {
  return `---\ntitle: ${getFileName(path)}\n---\n`
}

function formatDeclaration({ type, name, properties }: Declaration) {
  return `\n## ${name} *(\`${properties}${properties.length ? ` ${type}` : `${type}`}\`)*`
}

function groupByParam(lines: string[]): { [K in keyof typeof TAGS]: string[] } {
  return lines.reduce((acc, line) => {
    const tag = keys(TAGS).find((tag) => line.includes(tag))
    if (tag) {
      return {
        ...acc,
        [tag]: [...(acc[tag] || []), line.replace(tag, "").trim()],
      }
    }
    return acc
  }, {} as { [K in keyof typeof TAGS]: string[] })
}

function formatParams(line: string) {
  const [name, ...description] = line.split(" ")
  const str = description[0].trim()
  if (str.includes("{")) {
    const [type, ...remainder] = line.split("{")[1].split("}")
    return `| ${name} | \`${type}\` | ${remainder.join(" ")} |\n`
  }
  return `| ${name} | unknown | ${description.join(" ")} |\n`
}

function tagName(tag: string) {
  const tagwithoutSymbol = tag.replace("@", "")
  return tagwithoutSymbol[0].toLocaleUpperCase() + tagwithoutSymbol.slice(1)
}

function handleTags(tags: string[]) {
  let md = ""
  const groups = groupByParam(tags)

  entries(groups).forEach(([tag, lines]) => {
    switch (tag) {
      case "@param":
        md += "\n### Parameters 📎\n| Name | Type | Description |\n| ---- | ---- | ----- |\n"
        lines.forEach((line) => {
          md += `${formatParams(line)}`
        })
        break
      case "@returns":
        md += `\n### Returns 📤\n> ${lines.join("\n")}\n`
        break
      case "@example":
        md += `\n### Example 📝\n${lines.join("\n")}\n`
        break
      case "@see":
        md += `\n### See 👀\n> ${lines.join("\n")}\n`
        break
      case "@warning":
        md += `\n:::caution[Warning ⚠️]\n${lines.join("\n")}\n:::\n`
        break
      case "@throws":
        md += `\n:::danger[Throws ❌]\n${lines.join("\n")}\n:::\n`
        break
      case "@deprecated":
        md += `\n:::danger[Deprecated 📜]\n${lines.join("\n")}\n:::\n`
        break
      case "@beta":
        md += `\n:::tip[Beta 🧪]\n${lines.join("\n")}\n:::\n`
        break
      case "@alpha":
        md += `\n:::tip[Alpha 🧪]\n${lines.join("\n")}\n:::\n`
        break
      case "@remarks":
        md += `\n:::note[Remarks 📝]\n${lines.join("\n")}\n:::\n`
        break
      default:
        md += `\n### ${tagName(tag)}\n${lines.join("\n")}\n`
        break
    }
  })
  return md
}

function formatDocs({ description, tags }: Docs) {
  let desc = "\n"
  if (description) {
    desc = `\n> ${description}\n`
  }
  return desc + handleTags(tags)
}

export function toMarkdown<D extends DocsData>(data: D, adapter: Adapter): Documents<D> {
  let md = ""
  return entries(data).reduce((res, [path, exports]) => {
    if (adapter === "starlight") {
      md = addFrontmatter(path as string)
    }
    exports.forEach(({ declaration, docs }) => {
      md += formatDeclaration(declaration)
      md += formatDocs(docs)
    })
    // Otherwise we split it into multiple files to have subnavigation
    const contents = md
    md = ""
    return {
      ...res,
      [path]: contents,
    }
  }, {} as Documents<D>)
}
