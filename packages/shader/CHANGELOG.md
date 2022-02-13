0.4.0
- Add WGSL support at `@use-gpu/shader/wgsl`

0.3.0
- Add `bindBundle` / `bindModule` methods to produce virtually linked bundles that acts as closures.
- Add `bindingToModule` and `bindingsToLinks` methods to convert use-gpu bindings to shaders
- Add `castTo` operation to quickly swizzle data on the inside.
- Add GLSL generation for data bindings (constant, storage, lambda).
- Add virtual and static modules, rendered just-in-time.
