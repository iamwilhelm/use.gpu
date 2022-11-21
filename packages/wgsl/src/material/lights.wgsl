use '@use-gpu/wgsl/use/types'::{ Light };
use '@use-gpu/wgsl/fragment/pbr'::{ PBR };

@optional @link fn getLightCount() -> u32 { return 0u; }
@optional @link fn getLight(index: u32) -> Light {
  return Light(
    vec4<f32>(1.0, 1.0, 1.0, 0.0),
    vec4<f32>(-1.0, -1.0, -1.0, 0.0),
    vec4<f32>(0.0, 0.0, 0.0, 0.0),
    vec4<f32>(0.0, 0.0, 0.0, 0.0),
    vec4<f32>(1.0, 1.0, 1.0, 1.0),
    1,
    1,  // Directional
    -1, // Shadow Map (none)
    vec4<f32>(0.0)
  );
}

@infer type T;
@link fn applyLight(
  N: vec3<f32>,
  V: vec3<f32>,
  light: Light,
  @infer(T) surface: T,
) -> vec3<f32> {}

@optional @link fn sampleShadowLevel(index: u32, uv: vec2<f32>, level: f32) -> f32 { return 1.0; }

@export fn applyLights(
  N: vec3<f32>,
  V: vec3<f32>,
  surface: T,
) -> vec3<f32> {

  var radiance: vec3<f32> = vec3<f32>(0.0);

  let lightCount = getLightCount();
  let n = min(lightCount, 1024u);
  for (var i = 0u; i < lightCount; i++) {
    let light = getLight(i);
    var f = vec3<f32>(1.0);

    if (light.shadowMap >= 0) {
      let index = u32(light.shadowMap);
      let pos = light.into * surface.position;
      let uv = pos.xy * .5 + .5;//, vec2<f32>(0.0), vec2<f32>(1.0);
      if (abs(pos.x) < 1 && abs(pos.y) < 1) {
        f *= vec3<f32>(uv.xy, 1.0);
      }
      else {
        f *= 0.5;
      }
    }
    
    let r = applyLight(N, V, light, surface);
    radiance += r * f;
  }
  
  return radiance;
}
