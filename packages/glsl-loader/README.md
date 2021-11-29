# @use-gpu/glsl-loader

## GLSL loader for webpack and node

This is a webpack and node loader which enables easy use of `@use-gpu/shader`.

```
npm install --save @use-gpu/glsl-loader
```

```
yarn add @use-gpu/glsl-loader
```

### Usage

#### Node.js

For node, the included helper will use `require-hacker` to convert all `*.glsl` files to CommonJS:

```js
import "@use-gpu/glsl-loader/node";
```

#### Webpack Config

For webpack, it will emit ESM or CommonJS automatically:

```js
{
  // ...
  module: {
    rules: [
      //...
      {
        test: /\.glsl$/i,
        use: ['@use-gpu/glsl-loader'],
      },
    ],
  },
}
```

#### Import

You can then do:

```js
import shader from './shader.glsl';
```

This will import a `ParsedBundle` that can be used with `@use-gpu/shader`'s `linkBundle(...)` function.

If you use a named import:
```js
import { symbol } from './shader.glsl';
```

You will get the same `ParsedBundle`, but with `entry` set to the symbol name in question. The symbol must be tagged with `#pragma export`.

### Typescript

To allow shader imports to type check, create a `glsl-files.d.ts` with:

```
declare module '*.glsl' {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export default __module;
}
```

To make named imports `import { x } from ...` pass the type checker, you need to generate a custom .d.ts:

```
./node_modules/.bin/glsl-tsgen [--base-dir rootDir] [file or *.glsl]
```
