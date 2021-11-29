# @use-gpu/shader

## GLSL Linker and Tree Shaker

`@use-gpu/shader` is a Typescript library to link together **snippets of shader code**, while removing dead code, very quickly.

```
npm install --save @use-gpu/shader
```

```
yarn add @use-gpu/shader
```

It enables two kinds of imports to be used:

- **Static - ES Style** - `#pragma import { getColor } from 'path/to/color'` (functions, declarations and types)
- **Dynamic - Function Prototype** - `vec4 getColor();` (linked at run-time)

This allows you to split up and organize your GLSL code as you see fit, as well as create dynamic shader permutations.

`@use-gpu/shader` supports GLSL 4.5 and uses a [Lezer grammar](https://lezer.codemirror.net/) for the parsing.

#### Bundler

When combined with `@use-gpu/glsl-loader` (webpack or node), you can import a tree of `.glsl` modules directly in JS/TS as a pre-packaged bundle:

```ts
import mainShader from 'path/to/main.glsl';

import { linkBundle } from '@use-gpu/shader/glsl';
const glslCode = linkBundle(mainShader);
```

All dependencies will be parsed at build-time and deduplicated, using the normal import mechanism. They are packed with their symbol table and a sparse token list, so that code generation can happen immediately without re-parsing.

#### Strings

You can also skip the bundler and work with raw strings. In this case it is up to you to gather all the associated module code:

```ts
import { linkCode } from '@use-gpu/shader/glsl';

const moduleA = "...";
const moduleB = "...";
const moduleC = "...";

const linked = linkCode(moduleC, {moduleA, moduleB});
```

Shaders parsed at run-time will be cached on an least-recently-used basis, based on content hash.

## Syntax

```glsl
// Import symbols from a .glsl file
#pragma import { symbol, … } from "path/to/file"
#pragma import { symbol as symbol, … } from "path/to/file"

// Mark next declaration as exported
#pragma export

// Mark next function prototype as optional (e.g. inside an `#ifdef`)
#pragma optional

// Mark next declaration as global (don't namespace it)
#pragma global
```

## Example

#### Static Import

**Imports from other files** are declared using an ES-style directive referencing the filesystem:

**main.glsl**
```glsl
#pragma import { getColor } from 'path/to/color'

void main() {
  gl_FragColor = getColor();
}
```

Only exported symbols may be imported:

**path/to/color.glsl**
```glsl
#pragma export
vec4 getColor() {
  return vec4(used(), 0.5, 0.0, 1.0);
}

float used() {
  return 1.0;
}

void unused() {
  // ...
}
```

When passed to `linkBundle`, the result is:

**Linked result**
```glsl
#version 450

vec4 _u4_getColor() {
  return vec4(_u4_used(), 0.5, 0.0, 1.0);
}

float _u4_used() {
  return 1.0;
}


void main() {
  gl_FragColor = _u4_getColor();
}
```

All top-level symbols outside the main module are namespaced with a prefix like `_u4_` to avoid collisions, unless marked as global.

#### Dynamic

For **dynamic linking at run-time**, you link up with a function prototype instead:

**main.glsl**
```glsl
vec4 getColor();

void main() {
  gl_FragColor = getColor();
}
```

You can import named symbols from `.glsl` files in JS/TS, and use them directly as links:

```ts
import mainShader from 'path/to/main.glsl';
import { getColor } from 'path/to/color.glsl';

const glslCode = linkBundle(mainShader, {getColor});
```

The linking mechanism works the same.


## Q&A

**Does this interpret pre-processor directives?**

No. It ignores and passes through all other `#directives`. This is done to avoid having to re-parse when definitions change.

This means the linker sees all top-level declarations regardless of `#if`s, and resolves all imports.

You can mark prototypes as `#pragma optional` if it is ok to leave them unlinked.

**Does this work for WGSL?**

Not right now. Though plugging in a WGSL grammar and doing the same trick should be feasible.

**Isn't it silly to ship and work with strings instead of byte code?**

Processing pre-parsed GLSL bundles is very fast and simple, even with tree shaking. Rewriting a SPIR-V program the same way is much more fiddly.


## API

### Link

Returns linked GLSL code by assembling:

  - `code` / `module` / `bundle`: Main module.
  - `modules`: Dictionary of modules to import manually from. `{ [path]: T }`
  - `links`: Dictionary of modules to link specific prototypes to. `{ [name]: T }`
  - `defines`: Dictionary of key/values to `#define` at the start.
  - `cache`: Override the internal cache or disable it.

  Use `from:to` as the link name to link two differently named functions.
  This is equivalent to a static `import { $to as $from } ...`.

#### `linkCode(…)`

Link direct source code.

```ts
(
  code: string,
  modules: Record<string, string> = {},
  links: Record<string, string> = {},
  defines: Record<string, string | number | boolean | null | undefined> = {},
  cache?: LRU | null,
) => string;
```

#### `linkModule(...)`

Link parsed modules.

```ts
(
  module: ParsedModule,
  modules: Record<string, ParsedModule> = {},
  links: Record<string, ParsedModule> = {},
  defines: Record<string, string | number | boolean | null | undefined> = {},
  cache?: LRU | null,
) => string;
```

#### `linkBundle(...)`

Link packaged bundle of module + libs.

```ts
(
  bundle: ParsedBundle,
  links: Record<string, ParsedBundle> = {},
  defines: Record<string, string | number | boolean | null | undefined> = {},
  cache?: LRU | null,
) => string;
```

#### `setPreamble(…)`

```ts
(s: string) => void
```

Replace the global `#version 450` preamble with another string.


### Module 

#### `loadModule(…)`

Parse a code module into its in-memory representation (AST + symbol/shake table).

```ts
(
  code: string,
  name: string,
  entry?: string,
  compressed: boolean = false,
) => ParsedModule;
```

#### `loadModuleWithCache(…)`

Load a module from the given cache, or parse it if missing.

```ts
(
  code: string,
  name: string,
  entry?: string,
  cache: LRU | null = null,
) => ParsedModule;
```

#### `makeModuleCache(...)`

Wrapper around npm `LRU`.


### Type Summary

```ts
export type ParsedModule = {
  name: string,
  code: string,
  tree: Tree,
  table: SymbolTable,
  shake?: ShakeTable,
  entry?: string,
};

export type ParsedBundle = {
  module: ParsedModule,
  libs: Record<string, ParsedBundle>,
  entry?: string,
};

export type ParsedModuleCache = LRU<string, ParsedModule>;
```


## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.

