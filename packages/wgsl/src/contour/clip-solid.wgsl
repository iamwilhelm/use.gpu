@link fn getFragment(
  color: vec4<f32>,
  uv: vec4<f32>,
  st: vec4<f32>,
) -> vec4<f32> {};

@export fn getClippedSolidFragment(
  color: vec4<f32>,
  uv: vec4<f32>,
  st: vec4<f32>,
) -> vec4<f32> {
  if (uv.w < 0.0) { discard; }
  return getFragment(color, uv, st);
}
