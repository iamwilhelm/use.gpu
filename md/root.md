Use.GPU is a set of **reactive, declarative WebGPU legos**. Compose graphs, meshes and shaders on the fly.

It is a stand-alone Typescript/WASM library with its own React-like run-time. 

If you're familiar with React, you will feel right at home.

**Questions? Join Use.GPU Discord**: https://discord.gg/WxtZ28aUC3

## Principle

Use.GPU lets you build **incremental, reactive graphics**, which respond to arbitrary changes with **minimal recomputation**.

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

You can nest the Use.GPU components to create complex GPU graphics, with bespoke rendering pipelines. No heavy lifting required.

## Guides (pending):

 - WebGPU canvas
 - Drawing passes
 - 2D and 3D plot
 - Data-driven geometry
 - Loops and animation
 - Layout and UI
 - Render to Texture

## Packages

Use.GPU is divided into packages, at different levels of abstraction.
This enables free-form tinkering for any graphics skill level.

**Framework**
- `@use-gpu/live` - Effect run-time (React replacement)
- `@use-gpu/react` - Live ↔︎ React interface
- `@use-gpu/webgpu` - WebGPU canvas
- `@use-gpu/shader` - WGSL shader linker and tree shaker

**High Level**
- `@use-gpu/gltf` - GLTF loader and scene graph
- `@use-gpu/layout` - HTML-like layout
- `@use-gpu/plot` - 2D/3D plotting (axes, grids, curves, labels, transforms, …)

- `@use-gpu/workbench`
  - `/camera` - Views and controls
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

**Libraries**
- `@use-gpu/core` - Pure WebGPU + data helpers
- `@use-gpu/state` - Minimal state management
- `@use-gpu/text` - Rust/WASM ABGlyph wrapper
- `@use-gpu/traits` - Composable prop archetypes

