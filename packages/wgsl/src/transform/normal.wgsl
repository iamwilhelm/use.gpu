@link fn getMatrix(i: u32) -> mat4x4<f32>;
@link fn getNormal(i: u32) -> vec4<f32>;

@export fn getTransformedNormal(i: u32) -> vec4<f32> {
  let pos = vec4<f32>(getNormal(i).xyz, 0.0);
  return getMatrix(0u) * pos;
}
