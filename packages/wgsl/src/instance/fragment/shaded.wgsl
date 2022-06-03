use '@use-gpu/wgsl/use/view'::{ getViewPosition };

@optional @link fn applyPBRMaterial(
  materialColor: vec4<f32>,
  lightColor: vec4<f32>,
  mapUV: vec2<f32>,
  N: vec3<f32>,
  L: vec3<f32>,
  V: vec3<f32>,
) -> vec3<f32> {
  return vec3<f32>(1.0, 1.0, 1.0);
}

@export fn getShadedFragment(
  color: vec4<f32>,
  uv: vec2<f32>,
  normal: vec3<f32>,
  position: vec3<f32>,
) -> vec4<f32> {
  let viewPosition = getViewPosition().xyz;
  let toView: vec3<f32> = viewPosition - position;
  
  let N: vec3<f32> = normalize(normal);
  let V: vec3<f32> = normalize(toView);

  let lightPosition = vec3<f32>(0.0, 30.0, 0.0);
  let lightColor = vec4<f32>(1.0, 1.0, 1.0, 1.0);

  let toLight: vec3<f32> = lightPosition - position;
  let L: vec3<f32> = normalize(toLight);

  return vec4<f32>(applyPBRMaterial(color, lightColor, uv, N, L, V), 1.0);
}
