@external fn getMatrix(i: i32) -> mat4x4<f32>;

@export fn getCartesianPosition(position: vec4<f32>) -> vec4<f32> {
  let pos = vec4<f32>(position.xyz, 1.0);
  return getMatrix(0u) * pos;
}
