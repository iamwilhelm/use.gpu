use '@use-gpu/wgsl/use/types'::{ Light, SurfaceFragment };

@link fn applyMaterial(
  N: vec3<f32>,
  L: vec3<f32>,
  V: vec3<f32>,
  surface: SurfaceFragment,
) -> vec3<f32> {}

@optional @link fn applyDirectionalShadow(
  light: Light,
  surface: SurfaceFragment,
) -> f32 { return 1.0; }

@optional @link fn applyPointShadow(
  light: Light,
  surface: SurfaceFragment,
) -> f32 { return 1.0; }

@export fn applyLight(
  N: vec3<f32>,
  V: vec3<f32>,
  light: Light,
  surface: SurfaceFragment,
) -> vec3<f32> {
  var L: vec3<f32>;

  var radiance = vec3<f32>(light.intensity);

  let kind = light.kind;
  if (kind == 0) {
    // Ambient
    radiance *= light.color.rgb;
    return radiance * surface.occlusion * surface.albedo.rgb;
  }
  else if (kind == 1) {
    // Directional
    L = normalize(-light.normal.xyz);
    radiance *= light.color.rgb * 3.1415;

    if (light.shadowMap >= 0) {
      radiance *= applyDirectionalShadow(light, surface);
    }
  }
  else if (kind == 2) {
    // Dome
    L = normalize(-light.normal.xyz);
    let f = clamp(dot(L, N), 0.0, 1.0);
    let color = mix(light.opts.rgb, light.color.rgb, f);
    let bleed = light.normal.w;
    if (bleed > 0.0) { L = mix(L, N, bleed); };
    radiance *= color * 3.1415;
  }
  else if (kind == 3) {
    // Point
    let d = light.position.xyz - surface.position.xyz;
    L = normalize(d);
    radiance /= dot(d, d);
    radiance *= light.color.rgb * 3.1415;

    if (light.shadowMap >= 0) {
      radiance *= applyPointShadow(light, surface);
    }
  }
  else {
    return vec3<f32>(0.0);
  }

  let direct = radiance * applyMaterial(N, L, V, surface);
  return direct;
}
