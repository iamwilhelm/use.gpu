@external fn getMask(uv: vec2<f32>) -> f32;
@external fn getTexture(uv: vec2<f32>) -> vec4<f32>;

@export fn getMaskedFragment(color: vec4<f32>, uv: vec2<f32>) -> vec4<f32> {
  return color * getMask(uv) * getTexture(uv);
}
