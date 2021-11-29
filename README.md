# Use.gpu

This is an experiment in graphics and interaction programming in Typescript/WebGPU. It combines Effect-based programming with React-like memoization to produce a practical resumable flow for rendering, with minimal recomputation.

The run-time implements a system of memoized fibers with native reductions and continuations. The result is a program that updates incrementally but always has the same state you'd get if it was run entirely from scratch.

For background, see the [associated article series](https://acko.net/blog/live-headless-react/).

WebGPU is not yet available in mainline browsers, which means you need e.g. Google Chrome Canary to run the example app. You will need to turn on the `chrome://flags/#enable-unsafe-webgpu` flag.

![public/cube.png](public/cube.png)

This repo is split into the following sub-packages:

**Live**
 - `@use-gpu/live` - Memoized effect run-time (React without DOM / rendering) ✅
 - `@use-gpu/inspect` - Debug inspector for Live ⏱

**WebGPU**
 - `@use-gpu/core` - WebGPU helpers and types ⏱
 - `@use-gpu/webgpu` - DOM/Canvas WebGPU bindings ✅

**Shaders**
 - `@use-gpu/shader` - Shader linker and tree-shaker ✅
 - `@use-gpu/glsl-loader` - GLSL file bundler for webpack and node ✅

**UI Components**
 - `@use-gpu/components` - Live components for WebGPU apps ⚠️
 - `@use-gpu/app` - Testbed app ⚠️
 
This is a work in progress. Stability:
- ✅: Stable Beta
- ⏱: Evolving Alpha
- ⚠️: Quicksand

## Usage

**Prerequisites**: `node`, `yarn`

**Dependencies**: run `yarn install` to grab dependent packages.

**Demo app requires Chrome Canary with WebGPU enabled.**

- `yarn start` - Enable development webserver at http://localhost:8777
- `yarn build` - Build packages
- `yarn test` - Run unit tests

