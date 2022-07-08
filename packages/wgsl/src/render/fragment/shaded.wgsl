@optional @link fn getFragment(
  color: vec4<f32>,
  uv: vec2<f32>,
  normal: vec3<f32>,
  tangent: vec3<f32>,
  position: vec3<f32>,
) -> vec4<f32> { return color; }

@fragment
fn main(
  @builtin(front_facing) frontFacing: bool,
  @location(0) fragColor: vec4<f32>,
  @location(1) fragUV: vec2<f32>,
  @location(2) fragNormal: vec4<f32>,
  @location(3) fragTangent: vec4<f32>,
  @location(4) fragPosition: vec4<f32>,
) -> @location(0) vec4<f32> {

  var normal = fragNormal;
  if (!frontFacing) { normal = -normal; }

  var outColor = fragColor;
  outColor = getFragment(outColor, fragUV, normal, fragTangent, fragPosition);
  if (outColor.a <= 0.0) { discard; }

  return outColor;
}
