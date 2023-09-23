type Category = 1 | 2 | 3 | 4 | "special" | "unsupported"

export type Tag = {
  category: Category
  description?: string
}

export const TAGS = {
  "@alpha": { category: 1 },
  "@beta": { category: 1 },
  "@decorator": { category: 2 },
  "@deprecated": { category: 1 },
  "@defaultValue": { category: 4 },
  "@eventProperty": { category: 2 },
  "@example": { category: 4 },
  "@experimental": { category: 1 },
  "@inheritDoc": { category: "unsupported" },
  "@internal": { category: 2 },
  "@label": { category: "special" },
  "@link": { category: 3 },
  "@override": { category: 2 },
  "@packageDocumentation": { category: "unsupported" },
  "@param": { category: 3 },
  "@privateRemarks": { category: "special" },
  "@public": { category: 2 },
  "@readonly": { category: 2 },
  "@remarks": { category: 4 },
  "@returns": { category: 3 },
  "@sealed": { category: 2 },
  "@see": { category: 3 },
  "@throws": { category: 3 },
  "@typeParam": { category: 3 },
  "@virtual": { category: 2 },
  "@warning": { category: 1 },
} satisfies { [key: string]: Tag }

export const DOC_START = "/**"
export const DOC_END = "*/"
export const DOC_LINE = "*"

export const KEYWORDS = [
  "function",
  "class",
  "interface",
  "type",
  "enum",
  "namespace",
  "let",
  "var",
  "const",
  "readonly",
  "public",
  "private",
  "protected",
  "static",
  "get",
  "set",
]

export const STOP_WORDS = [
  " ",
  ":",
  "=",
  "(",
  "{",
  "}",
  ")",
  "=>",
  ",",
  ";",
  // "\n",
  // "\t",
]

export const FLAVOR_TEXT = ["export", "import", "declare"]

// export const KEYWORDS = {
//   "function": { search: "start-end", start: ["{"], end: ["}"]},
//   "class": { search: "start-end", start: ["{"], end: ["}"]},
//   "interface": { search: "start-end", start: ["{"], end: ["}"]},
//   "type": { search: "symbol", symbol: ["="]},
//   "enum": { search: "start-end", start: ["{"], end: ["}"]},
//   "namespace": { search: "start-end", start: ["{"], end: ["}"]},
//   // "readonly": { search: "symbol", symbol: ["=", "{"]},
//   // "public": ["modifier"],
//   // "private": ["modifier"],
//   // "protected": ["modifier"],
//   // "static",
//   // "async",
//   // "constructor",
//   // "declare",
//   // "export",
//   // "import",
//   "let": { search: "both", start: ["{", "="], end: ["}", "=>"]},
//   "var": { search: "both", start: ["{", "="], end: ["}", "=>"]},
//   "const": { search: "both", start: ["{", "="], end: ["}", "=>"]},
//   // "get",
//   // "set",
//   // "implements",
// }
