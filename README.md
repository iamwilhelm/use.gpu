# Use.GPU

Use.GPU is a set of **reactive, declarative WebGPU legos**. It lets you compose arbitrary graphics pipelines on the fly, thanks to a built-in shader linker and binding generator.

Use.GPU is in the **alpha stage**. Don't expect production-quality code or docs.

It offers components at different levels of abstraction:
- All-in 2D/3D plotting (axes, grids, curves, labels, ...)
- Data-driven geometry layers (lines, points, text, ...)
- Raw rendering tools (passes, render-to-texture, ...)

This enables completely free-form tinkering for any graphics skill level.

Use.GPU has an incremental architecture, which updates with minimal recomputation. This is done by embracing effect-based programming, with React-like memoization hooks. The result is a program that always has the same state you'd get if it was run entirely from scratch.

**WebGPU is not yet available in mainline browsers, which means you need e.g. Google Chrome Dev to run the example app. You will need to turn on the `chrome://flags/#enable-unsafe-webgpu` flag.**

**Questions? Join Use.GPU Discord**: https://discord.gg/WxtZ28aUC3

## Background

_Why you might want this, see:_
 - [The Case for Use.GPU](https://acko.net/blog/the-case-for-use-gpu/) - What's wrong with GPU programming and how to fix it

_For background, see:_
 - [Climbing Mount Effect](https://acko.net/blog/climbing-mt-effect/) - Effect-based programming
 - [Reconcile All The Things](https://acko.net/blog/reconcile-all-the-things/) - Memoization and reconciliation
 - [Live - Headless React](https://acko.net/blog/live-headless-react/) - Live run-time and WebGPU
 - [Frickin' Shaders with Frickin' Laser Beams](https://acko.net/blog/frickin-shaders-with-frickin-laser-beams/) - Shader closures and linker

![public/cube.png](public/cube.png)

## Example - JSX

On the surface, Use.GPU feels exactly like React, in that you can use `<JSX>` syntax to compose its functional components. React aficionados will be right at home:

([full example](packages/app/src/pages/geometry/data.tsx))

```jsx
<Draw>
  <Pass>
    <Data
      fields={[
        ['vec3<f32>', [
          -5, -2.5, 0,
          5, -2.5, 0,
          0, -2.5, -5,
          0, -2.5, 5,
        ]],
        ['i32', [1, 2, 1, 2]],
      ]}
      render={([positions, segments]) =>
        <LineLayer
          positions={positions}
          segments={segments}
          width={5}
          depth={1}
          color={[0.125, 0.25, 0.5, 1]}
        />
      }
    />
  </Pass>
</Draw>
```

This will:
- draw a frame
- consisting of 1 render pass
- using data uploaded to the GPU
- rendered as line segments

Use.GPU has wrappers like `<WebGPU>` and `<AutoCanvas>` to set up a drawing environment, as well as a camera to define the view.

The included demo app contains various showcases of how it can be used.

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

