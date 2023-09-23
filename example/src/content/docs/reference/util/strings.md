---
title: strings
---

## detectFirstOccurrenceIn *(`function`)*
> Returns the first occurance of substrings in a string

### Parameters 📎
| Name | Type | Description |
| ---- | ---- | ----- |
| str | unknown | String to search |
| items | unknown | Substrings to match against |

### Returns 📤
> The first substring that matches in string L->R order

### See 👀
> firstOccurance for substring [L->R] implementation

### Example 📝
```ts
detectFirstOccurrenceIn("Hello, world!", ["world", "Hello"]) // "Hello"
```

## firstOccurance *(`function`)*
> Returns the first occurance of substrings in a string

### Parameters 📎
| Name | Type | Description |
| ---- | ---- | ----- |
| str | unknown | String to search |
| substrings | unknown | Substrings to match against |

### Returns 📤
> The first substring that matches in substring [L->R] order

### See 👀
> detectFirstOccurrenceIn for string L->R implementation

### Example 📝
```ts
firstOccurance("Hello, world!", ["world", "Hello"]) // "world"
```
