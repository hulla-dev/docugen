import fs from "fs"
import path from "path"
import { entries } from "~util/objects"
import { Documents } from "./formatter"
import { DocsData } from "./parser"

/**
 * Recursively lists all files in the specified directories with the specified file extensions,
 * excluding the specified subdirectories.
 *
 * @param includes - An array of directory paths to search for files. Trailing slashes are optional.
 * @param files - An array of file extensions to match, including the leading dot (e.g. ".txt").
 * @param excludes - An array of subdirectory paths to ignore. Trailing slashes are optional.
 * @returns An array of file paths that match the specified criteria. */
export function listFiles(includes: string[], files: string[], excludes: string[] = []): string[] {
  const result: string[] = []
  const subdirs = includes.map((dir) => (dir.endsWith("/") ? dir.slice(0, -1) : dir))

  for (const subdir of subdirs) {
    if (excludes.includes(subdir)) {
      continue
    }

    const dirents = fs.readdirSync(subdir, { withFileTypes: true })
    // Lists all files in the specified directory
    for (const dirent of dirents) {
      const path = `${subdir}/${dirent.name}`
      // Handles subdirectories
      if (dirent.isDirectory()) {
        const subfiles = listFiles([path], files, excludes)
        result.push(...subfiles)
      } else if (dirent.isFile()) {
        const ext = dirent.name.substring(dirent.name.lastIndexOf("."))
        if (files.includes(ext)) {
          result.push(path)
        }
      }
    }
  }

  return result
}

export function getFileName(path: string): string {
  return path.substring(path.lastIndexOf("/") + 1).split(".")[0]
}

function pathWithoutFile(path: string) {
  return path.substring(0, path.lastIndexOf("/"))
}

export async function createDocs(mdFiles: Documents<DocsData>, outDir: string) {
  return Promise.all(
    entries(mdFiles).map(async ([filePath, content]) => {
      const fileName = getFileName(filePath as string)
      const dirPath = pathWithoutFile(filePath as string)
      const destination = path.join(outDir, dirPath, `${fileName}.md`)
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(path.join(outDir, dirPath), { recursive: true })
        fs.writeFileSync(destination, "")
      }
      return Bun.write(destination, content)
    }),
  )
}
