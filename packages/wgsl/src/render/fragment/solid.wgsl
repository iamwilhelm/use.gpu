@optional @link fn getFragment(color: vec4<f32>, uv: vec2<f32>) -> vec4<f32> { return color; }

@fragment
fn main(
  @location(0) fragColor: vec4<f32>,
  @location(1) fragUV: vec2<f32>,  
) -> @location(0) vec4<f32> {
  var outColor = fragColor;

  outColor = getFragment(outColor, fragUV);
  if (outColor.a <= 0.0) { discard; }

  return outColor;
}
