# @use-gpu/wgsl-loader

```sh
npm install --save @use-gpu/wgsl-loader
```

```sh
yarn add @use-gpu/wgsl-loader
```

**Docs**: https://usegpu.live/docs/reference-loader-@use-gpu-wgsl-loader

# Loader - WGSL (webpack / node / rollup)

This is a webpack and node loader which enables easy use of `@use-gpu/shader`.

## Usage

#### Node.js

For node, the included helper will use `require-hacker` to convert all `*.wgsl` files to CommonJS:

```js
import "@use-gpu/wgsl-loader/node";
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
        test: /\.wgsl$/i,
        use: ['@use-gpu/wgsl-loader'],
      },
    ],
  },
}
```

#### Rollup.js (alpha/experimental)

For rollup, import the plugin as:

```js
import rollupWGSL from "@use-gpu/wgsl-loader/rollup";
```

#### Import

You can then do:

```js
import shader from './shader.wgsl';
```

This will import a `ParsedBundle` that can be used with `@use-gpu/shader`'s `linkBundle(...)` function.

If you use a named import:
```js
import { symbol } from './shader.wgsl';
```

You will get the same `ParsedBundle`, but with `entry` set to the imported symbol name.

## Typescript

To allow shader imports to type check, create a `wgsl-files.d.ts` with:

```ts
declare module '*.wgsl' {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export default __module;
}
```

To make named imports `import { x } from ...` pass the type checker, you need to generate a custom .d.ts:

```sh
npm run wgsl-tsgen [--base-dir dir] [file or *.wgsl]
```

```sh
yarn run wgsl-tsgen [--base-dir dir] [file or *.wgsl]
```

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.

