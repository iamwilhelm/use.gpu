0.9.1
- `@use-gpu/layout`: Expand render phase into component tree for memoization
- `@use-gpu/live`: Ensure render order even when rekeying
- `@use-gpu/live`: Add back a more sensible `useYolo`
- `@use-gpu/live`: Track `fiber.by` rendered IDs correctly for React-flavored JSX
- `@use-gpu/live`: Captures are now pre-reduced.

0.9.0
- `@use-gpu/inspect`: Allow use without Use.GPU, move GPU panels to `@use-gpu/inspect-gpu`
- `@use-gpu/live`: Quotes/unquotes in keyed sub-trees will now correctly reorder
- `@use-gpu/plot`: Add pipeline options as full ROP trait to plot layers
- `@use-gpu/present`: New presentation system on top of `@use-gpu/layout`: `<Present>` / `<Slide>` / `<Step>`
- `@use-gpu/shader`: Allow `chainTo` to chain `(A, ...)->B` with `(B, ...)->C` if the rest signatures match
- `@use-gpu/shader`: Allow run-time @linking of struct types
- `@use-gpu/voxel`: Teardown-style raytracer for .vox voxel models
- `@use-gpu/workbench`: `useBoundShader` / `getBoundShader` no longer need BINDINGS passed

0.8.4
- `@use-gpu/shader`: Use abstract grammar w/o comments internally, concrete grammar externally, to avoid lezer bugs.

0.8.3
- `@use-gpu/app`: Add binary file histogram example
- `@use-gpu/inspect`: Syntax highlighting in shader view
- `@use-gpu/shader`: Make WGSL grammar suitable for syntax highlighting
- `@use-gpu/shader`: `vec#<u8>` and `vec#<u16>` storage polyfill
- `@use-gpu/workbench`: Consistent pipeline options (depth, side, blend) for layers

0.8.2
- `@use-gpu/live`: Improved interoperability with React-flavored JSX.

0.8.1
- `@use-gpu/core`: Avoid evaluating GPUShaderStage before WebGPU support is confirmed.
- `@use-gpu/wgsl`: NaNs were removed from the WGSL spec. 🤦‍♂️

0.8.0
- `@use-gpu/app`: Added examples: scene, instancing, shadow, image textures, multiscale RTT
- `@use-gpu/live`: Allow `<Capture>`/`<Reconcile>` continuation to participate in yeets
- `@use-gpu/live`: Rename `useAsync` to `useAwait`
- `@use-gpu/live`: Components that yeet identical values repeatedly no longer trigger a re-gather
- `@use-gpu/live`: JSX children do not have to be arrays
- `@use-gpu/plot`: Add `<Grid auto>` to snap grids to far side of range
- `@use-gpu/scene`: Add basic `<Scene>`/`<Node>`/`<Primitive>` components for a classic matrix tree
- `@use-gpu/scene`: Add `<Instances>` component for instanced mesh rendering
- `@use-gpu/workbench`: Refactor `<Pass>`/`<Virtual>` to allow for swappable render passes
- `@use-gpu/workbench`: Remove `<Draw>` as it was no longer doing anything.
- `@use-gpu/workbench`: Add visibility culling with draw call ordering to `<Pass>` via view and transform context
- `@use-gpu/workbench`: Add shadow maps for directional and point lights
- `@use-gpu/workbench`: Add shared global bindings to `<DrawCall>` and `<Pass>` via view context
- `@use-gpu/workbench`: Split `<Pass>` into `<ForwardRenderer>` and add a `<DeferredRenderer>`
- `@use-gpu/workbench`: Replace explicit `<Lights>` with implicit `<LightData>`, which is now owned by the renderer
- `@use-gpu/workbench`: Allow `<FaceLayer>` to be used with indexed positions and segments
- `@use-gpu/workbench`: Add `<InstanceData>` component for gathering instance data
- `@use-gpu/workbench`: Add `<InterleavedData>` to read packed vertex attributes
- `@use-gpu/workbench`: Add `<GeometryData>` to read prefab geometry, with helpers like `makeSphereGeometry`
- `@use-gpu/workbench`: Add `<DomeLight>` with adjustable zenith, horizon and bleed/overextension
- `@use-gpu/workbench`: Add `unwelded` indexing mode to `<CompositeData>` and more unwelded options to `<FaceLayer>`
- `@use-gpu/workbench`: Add `stroke` to `<PointLayer>` to allow for thin outlined shapes
- `@use-gpu/workbench`: Rename `<ComputeData>`/`<TextureData>` to `<ComputeBuffer>`/`<TextureBuffer>`
- `@use-gpu/workbench`: Replace `<Feedback>` with a more generic `<FullScreen>` similar to `<Kernel>`
- `@use-gpu/workbench`: Add `<ShaderFlatMaterial>` and `<ShaderLitMaterial>` for custom materials
- `@use-gpu/workbench`: Add `<ImageCubeTexture>` for loading cube maps

0.7.0
- `@use-gpu/live`: Reconciling + quote/unquote as native ops.
- `@use-gpu/live`: Hot module reload (beta).
- `@use-gpu/app`: Added examples: fluid dynamics, web mercator, implicit surface.
- `@use-gpu/core`: Add compute pipelines, indirect buffers, read/write storage.
- `@use-gpu/workbench`: Add dual contour layer for implicit surfaces.
- `@use-gpu/workbench`: Add compute hooks, scratch sources.
- `@use-gpu/workbench`: Reconcile central dispatch queue.
- `@use-gpu/shader`: Track upstream WGSL grammar changes.
- `@use-gpu/shader`: Direct `@link`ing of storage/texture bindings without getter.
- `@use-gpu/shader`: Storage/uniform getters without `index: u32`.
- `@use-gpu/map`: Initial alpha for maps: mercator projection, vector tile rendering.
