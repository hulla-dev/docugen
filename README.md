# docugen 📚
An opinionated turbo-fast documentation generator ⚡️

## Motivation 🏃
Why docugen was created can be summarized in few short bullet points
- available documentation tools take too long to compile
- they use outdated module principles which can be trouble-some for modern apps
- the output format sucks
- you need to study in-depth a documentation of a documentation tool to even get remotely close to desired result

`docugen` aims to address all of these painpoints.

- built on top of bun (zig) APIs, it's blazing fast 🔥
- scans through file-system for modules, without need for any TS/JS compilation 🧠
- built-in astro starlight integration for awesome format, with search and navigation included 🎨
- works with 0 config with sensible defaults, but still fully customizable with `cli commands` and `docugen.json` configuration! 👽

## Installation & Usage ℹ️
You can use docugen as a one off script:

```bash
bunx docugen
```

or install it as a `devDependency`
```bash
bun add -D docugen
bun run docugen
```
