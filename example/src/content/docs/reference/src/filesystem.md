---
title: filesystem
---

## listFiles *(`function`)*
> Recursively lists all files in the specified directories with the specified file extensions,
excluding the specified subdirectories.

### Parameters 📎
| Name | Type | Description |
| ---- | ---- | ----- |
| includes | unknown | - An array of directory paths to search for files. Trailing slashes are optional. |
| files | unknown | - An array of file extensions to match, including the leading dot (e.g. ".txt"). |
| excludes | unknown | - An array of subdirectory paths to ignore. Trailing slashes are optional. |
