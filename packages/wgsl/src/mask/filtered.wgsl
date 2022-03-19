@external fn getColor(color: vec4<f32>) -> vec4<f32>;
@external fn getTexture(uv: vec2<f32>) -> vec4<f32>;

@export fn getFilteredFragment(color: vec4<f32>, uv: vec2<f32>) -> vec4<f32> {
  return getColor(color * getTexture(uv));
}

@export fn getFilteredTexture(uv: vec2<f32>) -> vec4<f32> {
  return getColor(getTexture(uv));
}
