use "@use-gpu/wgsl/use/gamma"::{toLinear4};

@export fn toColorSpace(color: vec4<f32>) -> vec4<f32> {
  var out = color;
  if (COLOR_SPACE == 1) { out = toLinear4(out); }
  return out;
}

@export fn premultiply(color: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(color.rgb * color.a, color.a);
}
