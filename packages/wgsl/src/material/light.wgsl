use '@use-gpu/wgsl/use/types'::{ Light, Radiance };

@infer type T;
@link fn applyMaterial(
  N: vec3<f32>,
  L: vec3<f32>,
  V: vec3<f32>,
  radiance: vec3<f32>,
  @infer(T) params: T,
) -> vec3<f32> {}

@export fn applyLight(
  N: vec3<f32>,
  V: vec3<f32>,
  light: Light,
  position: vec3<f32>,
  ao: f32,
  params: T,
) -> Radiance {
  var L: vec3<f32>;

  var radiance = vec3<f32>(light.intensity);

  let kind = light.kind;
  if (kind == 0) {
    // Ambient
    radiance *= light.color.rgb;
    return Radiance(radiance * ao * params.albedo, true);
  }
  else if (kind == 1) {
    // Directional
    L = normalize(-light.normal.xyz);
    radiance *= light.color.rgb * 3.1415;
  }
  else if (kind == 2) {
    // Point
    let s = light.size.x;
    let d = light.position.xyz - position;
    L = normalize(d);
    if (s >= 0.0) { radiance *= s*s / dot(d, d); }
    radiance *= light.color.rgb * 3.1415;
  }
  else if (kind == 3) {
    // Hemisphere
    L = normalize(-light.normal.xyz);
    let f = clamp(dot(L, N), 0.0, 1.0);
    let color = mix(light.opts.rgb, light.color.rgb, f);
    radiance *= color * 3.1415;
  }
  else {
    return Radiance(vec3<f32>(0.0), false);
  }

  let direct = applyMaterial(N, L, V, radiance, params);
  return Radiance(direct, false);
}
