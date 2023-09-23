export function terminateOn(str: string, chars: string[]) {
  const stopword = detectFirstOccurrenceIn(str.trim(), chars)
  if (stopword) {
    return str.split(stopword)[0].trim()
  }
  return str.trim()
}

/**
 * Returns the first occurance of substrings in a string
 * @param str String to search
 * @param items Substrings to match against
 * @returns The first substring that matches in string L->R order
 * @see firstOccurance for substring [L->R] implementation
 * @example
 * ```ts
 * detectFirstOccurrenceIn("Hello, world!", ["world", "Hello"]) // "Hello"
 * ```
 *  */
function detectFirstOccurrenceIn(str: string, items: string[]): string | null {
  let minIndex = Infinity
  let result: string | null = null
  for (const item of items) {
    const index = str.indexOf(item)
    if (index !== -1 && index < minIndex) {
      minIndex = index
      result = item
    }
  }
  return result
}

/**
 * Returns the first occurance of substrings in a string
 * @param str String to search
 * @param substrings Substrings to match against
 * @returns The first substring that matches in substring [L->R] order
 * @see detectFirstOccurrenceIn for string L->R implementation
 * @example
 * ```ts
 * firstOccurance("Hello, world!", ["world", "Hello"]) // "world"
 * ```
 */
export function firstOccurance(str: string, substrings: string[]) {
  for (const substring of substrings) {
    if (str.includes(substring)) {
      return substring
    }
  }
  console.warn(`[docugen]: Unable to find any TAG matching declarations in line: ${str}`)
  return ""
}

export function replaceAll(str: string, replacements: string[]): string {
  let result = str
  for (const replacement of replacements) {
    result = result.replace(replacement, "")
  }
  return result
}

export const removeFirstOccurrence = (str: string, substrings: string[]) => {
  const substring = firstOccurance(str, substrings)
  return str.replace(substring, "")
}
