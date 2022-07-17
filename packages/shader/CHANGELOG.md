0.6.0
- Add simple type inference via `@infer`
- Add struct types for storage
- Remove `/types` export

0.5.0
- Add `vec3to4` polyfill for storage
- Add `u8`/`u16`/`i8`/`i16` polyfill for storage

0.4.0
- Add WGSL support at `@use-gpu/shader/wgsl`

0.3.0
- Add `bindBundle` / `bindModule` methods to produce virtually linked bundles that acts as closures.
- Add `bindingToModule` and `bindingsToLinks` methods to convert use-gpu bindings to shaders
- Add `castTo` operation to quickly swizzle data on the inside.
- Add GLSL generation for data bindings (constant, storage, lambda).
- Add virtual and static modules, rendered just-in-time.
