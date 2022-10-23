use '@use-gpu/wgsl/use/types'::{ Light };
use '@use-gpu/wgsl/fragment/pbr'::{ PBR };

@infer type T;
@link fn applyLight(
  N: vec3<f32>,
  V: vec3<f32>,
  light: Light,
  @infer(T) surface: T,
) -> f32 {}

@export fn applyLights(
  N: vec3<f32>,
  V: vec3<f32>,
  surface: T,
) -> vec3<f32> {

  var radiance: vec3<f32> = vec3<f32>(0.0);

  var light = Light(
    vec4<f32>(0.0, 0.0, 0.0, 1.0),
    vec4<f32>(-0.267, -3*0.267, -2*0.267, 0.0),
    vec4<f32>(0.0),
    vec4<f32>(-1.0, 0.0, 0.0, 0.0),
    vec4<f32>(1.0),
    vec4<f32>(0.0),
    1.0,
    1,
  );

  return 0.05 * surface.occlusion * surface.albedo.rgb + applyLight(N, V, light, surface);
}
