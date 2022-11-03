0.8.0
- `@use-gpu/app`: Added examples: scene, instancing, shadow, image textures
- `@use-gpu/plot`: Add `<Grid auto>` to snap grids to far side of range.
- `@use-gpu/scene`: Add basic `<Scene>`/`<Node>`/`<Primitive>` components for a classic matrix tree
- `@use-gpu/scene`: Add `<Instances>` component for instanced mesh rendering
- `@use-gpu/workbench`: Refactor `<Pass>`/`<Virtual>` to allow for swappable render passes
- `@use-gpu/workbench`: Add visibility culling with draw call ordering to `<Pass>` via view and transform context
- `@use-gpu/workbench`: Add shared global bindings to `<DrawCall>` and `<Pass>` via view context
- `@use-gpu/workbench`: Allow `<FaceLayer>` to be used with indexed positions and segments
- `@use-gpu/workbench`: Add `<InstanceData>` component for gathering instance data
- `@use-gpu/workbench`: Add `<InterleavedData>` to read packed vertex attributes
- `@use-gpu/workbench`: Add `<GeometryData>` to read flat vertex attributes
- `@use-gpu/workbench`: Add `<HemisphereLight>` with adjustable zenith, horizon and bleed/overextension
- `@use-gpu/workbench`: Add `unwelded` indexing mode to `<CompositeData>` and more unwelded options to `<FaceLayer>`
- `@use-gpu/workbench`: Add `stroke` to `<PointLayer>` to allow for thin outlined shapes
- `@use-gpu/workbench`: Rename `<ComputeData>`/`<TextureData>` to `<ComputeBuffer>`/`<TextureBuffer>`

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
