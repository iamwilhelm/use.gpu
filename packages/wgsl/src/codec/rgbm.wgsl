@export fn decodeRGBM16(color: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(color.rgb * 20.0, 1.0);
  return vec4<f32>(16.0 * color.rgb * color.a, 1.0);
};