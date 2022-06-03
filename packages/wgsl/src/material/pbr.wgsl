use '@use-gpu/wgsl/fragment/pbr'::{ PBR };

@optional @link fn getAlbedo(uv: vec2<f32>) -> vec4<f32> { return vec4<f32>(1.0, 1.0, 1.0, 1.0); }
@optional @link fn getMetalness(uv: vec2<f32>) -> f32 { return 0.2; }
@optional @link fn getRoughness(uv: vec2<f32>) -> f32 { return 0.8; }

@export fn applyPBRMaterial(
  materialColor: vec4<f32>,
  lightColor: vec4<f32>,
  mapUV: vec2<f32>,
  N: vec3<f32>,
  L: vec3<f32>,
  V: vec3<f32>,
) -> vec3<f32> {
  var albedo: vec3<f32> = materialColor.rgb * getAlbedo(mapUV).rgb;
  var metalness: f32 = getMetalness(mapUV);
  var roughness: f32 = getRoughness(mapUV);

  return PBR(N, L, V, albedo, metalness, roughness) * lightColor.rgb;
}
