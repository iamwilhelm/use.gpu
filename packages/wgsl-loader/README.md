# @use-gpu/wgsl-loader

```sh
npm install --save @use-gpu/wgsl-loader
```

```sh
yarn add @use-gpu/wgsl-loader
```

**Docs**: https://usegpu.live/docs/reference-loader-@use-gpu-wgsl-loader

# Loader - WGSL (webpack / rollup / esbuild)

This is a JS loader which enables easy use of `@use-gpu/shader`.

## Usage

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

#### Esbuild

For esbuild, import the plugin as:

```js
import wgslPlugin from "@use-gpu/wgsl-loader/esbuild";
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

To allow shader imports to type check, use the `shader2ts` script from `@use-gpu/shader` to emit .d.ts files, e.g. for `src/`:

```
./node_modules/@use-gpu/shader/bin/shader2ts.js --noEmit --typeDef src
```

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.

