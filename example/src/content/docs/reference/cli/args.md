---
title: args
---

## ARGS *(`const`)*
> Argument definitions

## detected *(`function`)*
> Checks whether an argument exists in the args array

### Parameters 📎
| Name | Type | Description |
| ---- | ---- | ----- |
| args | `string[]` |  Array of arguments |
| arg | `keyof typeof ARGS` |  The argument to check |

### Returns 📤
> Whether the argument exists in the args array

## getCLIKey *(`function`)*
> Detects the argument key from the args array

### Parameters 📎
| Name | Type | Description |
| ---- | ---- | ----- |
| args | `string[]` |  Array of arguments |
| arg | `keyof typeof ARGS` |  The argument to check |

### Returns 📤
> The argument key or null if not found

### Example 📝
```ts
const args = ["-o", "./docs", "-i", "./src"]
getCLIKey(args, "output") // "-o"
getCLIKey(args, "includes") // "--includes"
getCLIKey(args, "nonExistent") // null (this also throws TS-Error in compiler)
```

## getArgKey *(`function`)*
> Gets the argument key from the ARGS object based on the CLI argument

### Parameters 📎
| Name | Type | Description |
| ---- | ---- | ----- |
| arg | `string` |  The CLI argument to check |

### Returns 📤
> The argument key or null if not found

### Example 📝
```ts
const args = ["-o", "./docs", "-i", "./src"]
getArgKey("-o") // "outdir"
getArgKey("--includes") // "includes"
getArgKey("--nonExistent") // null (this also throws TS-Error in compiler)
```

## exactIndex *(`function`)*
> Detects the index of the argument in the args array

### Parameters 📎
| Name | Type | Description |
| ---- | ---- | ----- |
| args | `string[]` |  Array of arguments |
| arg | `keyof typeof ARGS` |  The argument to check |

### Returns 📤
> The index of the argument or null if not found

### Example 📝
```ts
const args = ["-o", "./docs", "-i", "./src"]
exactIndex(args, "outdir") // 1
exactIndex(args, "includes") // 3
exactIndex(args, "excludes") // null
```

## argValue *(`function`)*
> Gets the value of argument

### Parameters 📎
| Name | Type | Description |
| ---- | ---- | ----- |
| args | `string[]` |  Array of arguments |
| arg | `keyof typeof ARGS` |  The argument to check |

### Returns 📤
> The passed CLI argument. If not prevent in args, returns the default value

## parseArgs *(`async function`)*
> Parses command line arguments and generates documentation based on the configuration

### Parameters 📎
| Name | Type | Description |
| ---- | ---- | ----- |
| args | `string[]` |  Array of command line arguments |
| config | `Config` |  Configuration object for documentation generation |

:::caution[Warning ⚠️]
This function mutates the config object
:::

:::danger[Throws ❌]
This function mutates the config object
:::

:::danger[Deprecated 📜]
This function mutates the config object
:::

:::tip[Beta 🧪]
This function mutates the config object
:::

:::tip[Alpha 🧪]
This function mutates the config object
:::

:::note[Remarks 📝]
This function mutates the config object
:::

### Warning
This function mutates the config object

### Returns 📤
> A Promise that resolves when documentation generation is complete

### Example 📝
```ts
const args = ["-o", "./docs", "-i", "./src"]
const config = {
outDir: "./docs",
includes: ["./src"]
}
parseArgs(args, config)
```
