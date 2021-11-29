# @use-gpu/shader

## GLSL linker and tree shaker

`@use-gpu/shader` is a Typescript library to link together **snippets of shader code**, while removing dead code, very quickly.

It enables two kinds of imports to be used:

- **Static - ES Style** - `#pragma import { getColor } from 'path/to/color'` (works for functions, values and types)
- **Dynamic - Prototype** - `vec4 getColor();` (linked at run-time)

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

Parsed shaders will be cached on an LRU basis.


#### GLSL Support

`@use-gpu/shader` supports GLSL 4.5 and uses a [Lezer grammar](https://lezer.codemirror.net/) for the parsing.

It does not interpret preprocessor directives other than its own, but will preserve syntax as-is.


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

Only exported symbols may be imported, marked with `#pragma export`:

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

```ts
import mainShader from 'path/to/main.glsl';
import { getColor } from 'path/to/color.glsl';

const glslCode = linkBundle(mainShader, {getColor});
```

**main.glsl**
```glsl
vec4 getColor();

void main() {
  gl_FragColor = getColor();
}
```

## FAQ

**Isn't it silly to work with shader code

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.

