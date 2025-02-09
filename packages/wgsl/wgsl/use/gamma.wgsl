const GAMMA = 2.2;

@export fn toLinear(v: f32) -> f32 {
  return pow(v, GAMMA);
}

@export fn toLinear2(v: vec2<f32>) -> vec2<f32> {
  return pow(v, vec2<f32>(GAMMA));
}

@export fn toLinear3(v: vec3<f32>) -> vec3<f32> {
  return pow(v, vec3<f32>(GAMMA));
}

@export fn toLinear4(v: vec4<f32>) -> vec4<f32> {
  return vec4(toLinear3(v.rgb), v.a);
}

@export fn toGamma(v: f32) -> f32 {
  return pow(v, 1.0 / GAMMA);
}

@export fn toGamma2(v: vec2<f32>) -> vec2<f32> {
  return pow(v, vec2<f32>(1.0 / GAMMA));
}

@export fn toGamma3(v: vec3<f32>) -> vec3<f32> {
  return pow(v, vec3<f32>(1.0 / GAMMA));
}

@export fn toGamma4(v: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(toGamma3(v.rgb), v.a);
}
