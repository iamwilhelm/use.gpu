# Use.GPU

A set of **declarative, reactive WebGPU legos**. Compose graphs, meshes and shaders on the fly.

It's a **stand-alone Typescript+Rust/WASM library** with its own React-like run-time. If you're familiar with React, you will feel right at home.

It has a built-in **shader linker and binding generator**, which means a lot of the tedium of raw GPU programming is eliminated, without compromising on flexibility.

- [**Documentation**](https://usegpu.live)

--

Use.GPU is in the **alpha stage**. Don't expect production-quality code or docs.

--

The library offers components at different levels of abstraction:
- All-in 2D/3D plotting (axes, grids, curves, labels, ...)
- Data-driven geometry layers (lines, points, text, ...)
- Raw rendering tools (passes, render-to-texture, ...)

This enables completely free-form tinkering for any graphics skill level.

Use.GPU has an incremental architecture, which updates with minimal recomputation. This is done by embracing effect-based programming, with React-like memoization hooks. The result is a program that always has the same state you'd get if it was run entirely from scratch.

**WebGPU is not yet available in mainline browsers, which means you need e.g. Google Chrome Dev to run the example app. You will need to turn on the `chrome://flags/#enable-unsafe-webgpu` flag.**

**Questions? Join Use.GPU Discord**: https://discord.gg/WxtZ28aUC3

## Usage

- `yarn start` - Run demo app at http://localhost:8777
- `yarn build` - Build packages
- `yarn test` - Run unit tests

**Prerequisites**: `node`, `yarn`, `rust`, `wasm-pack`

- `node`: https://nodejs.org/en/
- `yarn`: https://yarnpkg.com/getting-started/install
- `rust`: https://www.rust-lang.org/tools/install
- `wasm-pack`: https://rustwasm.github.io/wasm-pack/installer/

**Dependencies**: 
- run `yarn install` to grab dependent packages, and run code generation for the lib.

**Demo app requires Chrome Dev/Canary with WebGPU enabled.**
- `chrome://flags/#enable-unsafe-webgpu`

## Roadmap

This repo is split into the following sub-packages:

#### **Components**

- [`@use-gpu/gltf`](packages/gltf/README.md) - GLTF loader and scene graph ⏱
- [`@use-gpu/inspect`](packages/inspect/README.md) - Development inspector ✅
- [`@use-gpu/layout`](packages/layout/README.md) - HTML-like layout ✅
- [`@use-gpu/plot`](packages/plot/README.md) - 2D/3D plotting (axes, grids, curves, labels, transforms, …) ⏱
- [`@use-gpu/react`](packages/react/README.md) - Live ↔︎ React interface ✅
- [`@use-gpu/webgpu`](packages/webgpu/README.md) - WebGPU canvas ✅
- [`@use-gpu/workbench`](packages/workbench/README.md) ⏱
  - `/animate` - Keyframe animation
  - `/camera` - Views and controls
  - `/data` - CPU → GPU data packing
  - `/interact` - GPU UI picking
  - `/layers` - Data-driven geometry
  - `/light` - Light and environment
  - `/material` - Physical materials
  - `/primitives` - Programmable geometry
  - `/render` - Passes, render targets, buffers, etc.
  - `/router` - URL ↔︎ Page routing
  - `/shader` - Run-time WGSL composition

  - `/consumers` - Context consumers
  - `/hooks` - Reactive GPU API
  - `/providers` - Context providers

#### **Libraries**
- [`@use-gpu/core`](packages/core/README.md) - Pure WebGPU + data helpers ✅
- [`@use-gpu/shader`](packages/shader/README.md) - WGSL shader linker and tree shaker ✅
- [`@use-gpu/text`](packages/text/README.md) - Rust/WASM ABGlyph wrapper ✅
- [`@use-gpu/wgsl`](packages/wgsl/README.md) - .WGSL standard library for Use.GPU ✅

#### **Live**
- [`@use-gpu/live`](packages/live/README.md) - Effect run-time (React replacement) ✅
- [`@use-gpu/state`](packages/state/README.md) - Minimal state management ✅
- [`@use-gpu/traits`](packages/traits/README.md) - Composable prop archetypes ✅

#### **Loaders**
- [`@use-gpu/wgsl-loader`](packages/wgsl-loader/README.md) - WGSL file bundler for webpack and node ✅
- [`@use-gpu/glsl-loader`](packages/glsl-loader/README.md) - GLSL file bundler for webpack and node ✅

#### **Development**

- [`@use-gpu/app`](packages/app/README.md) - Testbed demo app ⚠️


This is a work in progress. Stability:
- ✅: Stable Beta
- ⏱: Evolving Alpha
- ⚠️: Quicksand

