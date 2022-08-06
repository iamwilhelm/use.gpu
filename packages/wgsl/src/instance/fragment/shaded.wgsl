use '@use-gpu/wgsl/use/view'::{ getViewPosition };

@infer type T = T;
@link fn getMaterial(
  materialColor: vec3<f32>,
  mapUV: vec4<f32>,
  mapST: vec4<f32>,
) -> @infer(T) T {}

@link fn applyLights(
  N: vec3<f32>,
  V: vec3<f32>,
  position: vec3<f32>,
  ao: f32,
  params: T,
) -> vec3<f32> {}

@optional @link fn getOcclusion(uv: vec2<f32>) -> f32 { return 1.0; };
@optional @link fn getEmissive(uv: vec2<f32>) -> vec4<f32> { return vec4<f32>(0.0); };

@export fn getShadedFragment(
  color: vec4<f32>,
  uv: vec4<f32>,
  st: vec4<f32>,
  normal: vec4<f32>,
  tangent: vec4<f32>,
  position: vec4<f32>,
) -> vec4<f32> {
  let viewPosition = getViewPosition();
  let toView: vec3<f32> = viewPosition.xyz - position.xyz;

  let N: vec3<f32> = normalize(normal.xyz);
  let V: vec3<f32> = normalize(toView);

  let emissive = getEmissive(uv.xy);
  let occlusion = getOcclusion(uv.xy);
  let params = getMaterial(color.rgb, uv, st);
  let light = emissive.xyz + applyLights(N, V, position.xyz, occlusion, params);

  //return vec4<f32>(N * .5 + .5, 1.0); 

  return vec4<f32>(light * color.a, color.a);
}
