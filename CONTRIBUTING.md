## Status

This project is in the alpha stage. Contributors and other interested parties are welcome, but should not expect production-ready code and documentation.

## Repo Orientation

The use.gpu repo is structured as a `yarn workspace` with the bulk under `/packages`.

Packages can be split into 4 layers:

- User-Facing: *Live components* (Workbench, WebGPU, GLTF, Layout, Plot, ...)
- Tools: *Loader plug-ins* (WGSL and GLSL)
- Graphics: *WebGPU core* (Core, Shader)
- Kernel: *Live Run-time* (Live, React, State)

#### Run-time (Live, React, State)

The run-time consists of the `Live` effect system / fiber tree, which mirrors React in functionality and use.

`Live` is a clean re-implementation, with no actual dependency on React, and several extensions.

`State` contains basic tools for hashing, diffing and patching JS-based state with composable operations.

`React` contains React interoperability, to go from Live <-> React in the middle of a render.

#### WebGPU Core

Use.GPU `Core` is a flat set of functions and helpers for WebGPU, not an engine. It provides tooling for data manipulation and streaming, along with smart bindings for render pipelines.

The `Shader` linker is fully separate, split into a GLSL and a WGSL variant, which share most of the same code. The GLSL version is not used in the repo itself, it mainly exists for historical reasons.

#### Loader Plug-ins

The `WGSL Loader` and `GLSL loader` handle automatic transpiling of shaders using `Shader`. There are a few different variants inside each (webpack, node, rollup), which all call the same transpiler.

Only `webpack` is officially supported for now, so contributions to expand this are most welcome.

#### Live Components

The bulk of the user-facing side of the API consists of Live components. These are used entirely à la carte, and form the beginning of a component ecosystem for Use.GPU. New component libraries can be entirely external, and all the standard components (and contexts) are individually exported.

The use of shared prop traits (i.e. as mix-ins) helps keep related components consistent.

## Building

The repo is a typical TS->JS build, but with additional requirements:

- Supporting both ES modules and CommonJS
- Importing `.wgsl` shaders into TS modules
- Including a Rust/WASM module (`@use-gpu/text`)

This is why the build process is pretty involved and jury rigged.

During development, the top-level `webpack` server can build the entire workspace directly from the TypeScript source, to allow for hot-reload. This is the easy part (`yarn dev`).

To build the final packages:
- A single top-level `yarn build` dispatches a `yarn build` of each package
- Each package builds itself in `/build/packages` according to its own `package.json`
- Packages produce either a single `src/` (CommonJS) OR an `mjs/` (ESM) + `umd/` (CommonJS)
- We process all final `package.json`s:
  - Replace TS references with JS
  - Insert `exports: {...}` dictionary to allow for `@use-gpu/package/subdir` imports (doesn't work reliably across Node/TS/... yet)

`@use-gpu/wgsl` contains shaders in source-code form. It's intended that the user sets up `wgsl-loader` as appropriate for their own build environment, so their own shaders can be linked along.

## Feature Roadmap

Use.GPU aims to provide a decent baseline solution for:
- *Plot* - Drawing points, lines, polygons, surfaces
- *GLTF* - Standard PBR with texture maps and lighting
- *Data* - Simple, chunked and composite data with auto-aggregation
- *Sim* - Kernel-based grid simulations
- *Implicit* - Contouring / Raymarching
- *2D UI* - Layout, rich text, SDF shapes, input events
- *3D UI* - GPU picking

It should also include some basic conveniences from the React ecosystem (like a URL router).

The goal is to have a viable 1.0 around the same time WebGPU becomes generally usable.

It is expected that initial use will be mostly embedding Use.GPU canvases inside React apps, so this should work well out of the box.

Using Live by itself, without React, will mainly be used for prototypes and sandboxing.

The core set of user-space functionality is under `@use-gpu/workbench`, but some of this may end up split into separate packages.
