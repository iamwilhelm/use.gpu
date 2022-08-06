@export fn getNormalFragment(
  color: vec4<f32>,
  uv: vec4<f32>,
  st: vec4<f32>,
  normal: vec4<f32>,
  tangent: vec4<f32>,
  position: vec4<f32>,
) -> vec4<f32> {
  let N: vec3<f32> = normalize(normal.xyz);
  return vec4<f32>(N *.5 + .5, color.a);
}
