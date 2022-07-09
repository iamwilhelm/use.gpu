use '@use-gpu/wgsl/use/types'::{ Light, Radiance };
use '@use-gpu/wgsl/fragment/pbr'::{ PBR };

@optional @link fn getLightCount() -> u32 { return 0u; }
@optional @link fn getLight(index: u32) -> Light {
  return Light(
    2, // Point
    vec4<f32>(1.0, 0.0, 0.0, 0.0),
    vec4<f32>(1.0, 0.0, 0.0, 0.0),
    vec4<f32>(1.0, 0.0, 0.0, 0.0),
    vec4<f32>(1.0, 1.0, 1.0, 1.0),
    1,
  );
}

@infer type T;
@link fn applyMaterial(
  N: vec3<f32>,
  L: vec3<f32>,
  V: vec3<f32>,
  radiance: vec3<f32>,
  @infer(T) params: T,
) -> vec3<f32> {}

fn applyLight(
  N: vec3<f32>,
  V: vec3<f32>,
  light: Light,
  position: vec3<f32>,
  ao: f32,
  params: T,
) -> Radiance {
  var L: vec3<f32>;

  var radiance = light.intensity * light.color.rgb;

  let kind = light.kind;
  if (kind == 0) {
    return Radiance(vec3<f32>(light.intensity * ao), true);
  }
  if (kind == 1) {
    L = normalize(-light.normal.xyz);
  }
  if (kind == 2) {
    L = normalize(light.position.xyz - position);
    radiance *= 3.1415;
  }

  let direct = applyMaterial(N, L, V, radiance, params);
  return Radiance(direct, false);
}

@export fn applyLights(
  N: vec3<f32>,
  V: vec3<f32>,
  position: vec3<f32>,
  ao: f32,
  params: T,
) -> vec3<f32> {

  var radiance: vec3<f32> = vec3<f32>(0.0);
  let lightCount = getLightCount();
  for (var i = 0u; i < lightCount; i++) {
    let light = getLight(i);
    let r = applyLight(N, V, light, position, ao, params);
    radiance += r.light;
  }
  
  return radiance;
}
