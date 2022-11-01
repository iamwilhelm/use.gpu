0.8.0
- `@use-gpu/plot`: Use `<Grid auto>` to snap grids to far side of range.
- `@use-gpu/workbench`: Allow `<FaceLayer>` to be used with indexed positions and segments
- `@use-gpu/workbench`: Add `<HemisphereLight>` with adjustable zenith, horizon and bleed/overextension
- `@use-gpu/workbench`: Add `unwelded` indexing mode to `<CompositeData>` and more unwelded options to `<FaceLayer>`
- `@use-gpu/workbench`: Add `stroke` to `<PointLayer>` to allow for thin outlined shapes
- `@use-gpu/workbench`: Refactor `<Pass>`/`<Virtual>` to allow for swappable render passes
- `@use-gpu/workbench`: Add shared global bindings to `<DrawCall>` and `<Pass>` from `<ViewProvider>`
- `@use-gpu/workbench`: Add basic `<Scene>`/`<Node>`/`<Primitive>` components for a classic matrix tree
- `@use-gpu/workbench`: Add `<Instances>`/`<InstanceData>` components for instanced mesh rendering
- `@use-gpu/workbench`: Add `<InterleavedData>` to read e.g. packed vertex attributes

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
