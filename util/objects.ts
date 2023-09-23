export function keys<O extends Record<string, unknown>>(obj: O): (keyof O)[] {
  return Object.keys(obj)
}

export function entries<O extends Record<string, unknown>>(obj: O): [keyof O, O[keyof O]][] {
  return Object.entries(obj) as [keyof O, O[keyof O]][]
}
