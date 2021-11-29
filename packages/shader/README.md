# @use-gpu/shader

## GLSL linker and tree shaker

`@use-gpu/shader` is a Typescript library to link together **snippets of shader code**, while removing dead code, very quickly.

```
npm install --save @use-gpu/shader
```

```
yarn add @use-gpu/shader
```

It enables two kinds of imports to be used:

- **Static - ES Style** - `#pragma import { getColor } from 'path/to/color'` (works for functions, declarations and types)
- **Dynamic - Prototype** - `vec4 getColor();` (linked at run-time)

This allows you to split up and organize your GLSL code as you see fit, as well as create dynamic shader permutations.

#### Bundler

When combined with `@use-gpu/glsl-loader` (webpack or node), you can import a tree of `.glsl` modules directly in JS/TS as a pre-packaged bundle:

```ts
import { linkBundle } from '@use-gpu/shader/glsl';
import mainShader from 'path/to/main.glsl';

const glslCode = linkBundle(mainShader);
```

Dependencies will be parsed at build-time and deduplicated. They are packed with their symbol table and a sparse token list, so that code generation can happen immediately without re-parsing.

You can also skip the loader and work with raw strings directly:

```ts
import { linkCode } from '@use-gpu/shader/glsl';

const moduleA = "...";
const moduleB = "...";
const moduleC = "...";

const linked = linkCode(moduleC, {moduleA, moduleB});
```

Parsed shaders will be cached on an least-recently-used basis.

#### GLSL Support

`@use-gpu/shader` supports GLSL 4.5 and uses a [Lezer grammar](https://lezer.codemirror.net/) for the parsing.

It does not interpret preprocessor directives other than its own, but will preserve syntax as-is.

## Syntax

```glsl
// Import symbols from a .glsl file
#pragma import { symbol, … } from "path/to/file"
#pragma import { symbol as local, … } from "path/to/file"

// Mark next declaration as exported
#pragma export

// Mark next function prototype as optional (e.g. with `#ifdef`)
#pragma optional

// Mark next declaration as global (don't namespace it)
#pragma global
```

## Example

#### Static Import

Imports are declared using an ES-style directive referencing the filesystem:

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

Global symbols are namespaced with a prefix like `_u4_` to avoid collisions. You can opt out of this on a case-by-case basis by using `#pragma global`.

#### Dynamic

For **dynamic linking at run-time**, you can import specific symbols from GLSL files and pass them in:

**main.glsl**
```glsl
vec4 getColor();

void main() {
  gl_FragColor = getColor();
}
```

```ts
import mainShader from 'path/to/main.glsl';
import { getColor } from 'path/to/color.glsl';

const glslCode = linkBundle(mainShader, {getColor});
```


## FAQ

**Does this work for WGSL?**

Not right now. Though plugging in a WGSL grammar and doing the same trick should be feasible.

**Isn't it silly to ship and work with strings instead of byte code?**

Processing pre-parsed GLSL bundles is very fast and simple, even with tree shaking. Rewriting a SPIR-V program the same way is much more fiddly, but definitely worth exploring.


## API

### Link

Returns linked GLSL code.

  - `modules`: Dictionary of modules to import freely from. `{ [path]: code }`
  - `links`: Dictionary of modules to link specific prototypes to. `{ [name] => code }`
  - `defines`: Dictionary of key/values to `#define`.
  - `cache`: Override the internal cache. If not set, a default cache is used.

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

#### `makeModuleCache(...)`

Wrapper around npm `LRU`.


### Type Summary

```
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

