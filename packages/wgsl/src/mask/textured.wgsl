@external fn getTexture(uv: vec2<f32>) -> vec4<f32>;

@export fn getTextureFragment(color: vec4<f32>, uv: vec2<f32>) -> vec4<f32> {
  var c = color;
  c = c * getTexture(uv);
  return c;
}
