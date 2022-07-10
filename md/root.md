# Use.GPU - Documentation

Use.GPU is a set of **reactive, declarative WebGPU legos**. Compose graphs, meshes and shaders on the fly.

Use.GPU is a stand-alone Typescript/WASM library with its own React-like run-time. 

If you're familiar with React, you will feel right at home.

## Overview

Use.GPU is divided into packages, at different levels of abstraction.
This enables free-form tinkering for any graphics skill level.

**Framework**
- `@use-gpu/live` - Effect run-time (React replacement)
- `@use-gpu/react` - Live ↔︎ React interface
- `@use-gpu/webgpu` - WebGPU canvas
- `@use-gpu/shader` - WGSL shader linker

**High Level**
- `@use-gpu/gltf` - GLTF loader and scene graph
- `@use-gpu/plot` - All-in 2D/3D plotting (axes, grids, curves, labels, transforms, …)

- `@use-gpu/workbench`
  - `/camera` - Views and controls
  - `/layout` - HTML-like layout
  - `/light` - Light and environment
  - `/material` - Physical materials
  - `/router` - URL ↔︎ Page routing

**Medium Level**
- `@use-gpu/workbench`
  - `/animate` - Keyframe animation
  - `/data` - CPU → GPU data packing
  - `/interact` - GPU UI picking
  - `/layers` - Data-driven geometry

**Low Level**
- `@use-gpu/workbench`
  - `/consumers` - Context consumers
  - `/hooks` - Reactive WebGPU API
  - `/primitives` - Programmable geometry
  - `/providers` - Context providers
  - `/render` - Passes, render targets, buffers, etc.
  - `/shader` - Run-time WGSL composition
  - `/traits` - Prop archetypes

**Libraries**
- `@use-gpu/core` - Pure WebGPU + data helpers
- `@use-gpu/state` - Minimal state management
- `@use-gpu/text` - Rust/WASM ABGlyph wrapper

## System Guide

Use.GPU has an **incremental, reactive design**, which responds to arbitrary changes with **minimal recomputation**.

Similar to React, you use it by composing a tree of components, starting with an `<App>`:

```tsx
<App>
  <Router>
    <Routes>
      <MyPage>
        
        <WebGPU>
          <AutoCanvas>

            <Draw>
              <Pass>
                // ...
              </Pass>
            </Draw>

          </AutoCanvas>
        </WebGPU>
        
      </MyPage>
    </Routes>
  </Router>
</App>
```

You can nest all the provided components to create complex GPU graphics and rendering pipelines. No heavy lifting is required.




