use '@use-gpu/wgsl/use/types'::{ Light, SurfaceFragment };
use '@use-gpu/wgsl/codec/octahedral'::{ encodeOctahedral };

@optional @link fn sampleShadow(uv: vec2<f32>, index: u32, level: f32) -> f32 { return 1.0; }

@link fn applyMaterial(
  N: vec3<f32>,
  L: vec3<f32>,
  V: vec3<f32>,
  surface: SurfaceFragment,
) -> vec3<f32> {}

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
      let index = u32(light.shadowMap);

      let pos = light.into * vec4<f32>(surface.position.xyz + surface.normal.xyz * light.shadowBias.y, 1.0);
      let n = dot(surface.normal.xyz, light.normal.xyz);
      let slope = (1.0 - abs(n));

      let depth = pos.z + slope * light.shadowBias.x;
      let blur = light.shadowBlur;
      var s = 0.0;

      let res = f32(blur) / (2.0 * (light.shadowUV.zw - light.shadowUV.xy) * SHADOW_PAGE);
      let uv = clamp(pos.xy * .5 + .5, vec2<f32>(res), vec2<f32>(1.0 - res));
      let uvm = mix(light.shadowUV.xy, light.shadowUV.zw, uv);

      if (blur >= 4) {
        for (var y = -1.5; y <= 1.5; y += 1.0) {
          for (var x = -1.5; x <= 1.5; x += 1.0) {
            s += sampleShadow(uvm + vec2<f32>(x, y) / SHADOW_PAGE, index, depth);
          }
        }
        s /= 16.0;
      }
      else if (blur == 3) {
        for (var y = -1.0; y <= 1.0; y += 1.0) {
          for (var x = -1.0; x <= 1.0; x += 1.0) {
            s += sampleShadow(uvm + vec2<f32>(x, y) / SHADOW_PAGE, index, depth);
          }
        }
        s /= 9.0;
      }
      else if (blur == 2) {
        for (var y = -0.5; y <= 0.5; y += 1.0) {
          for (var x = -0.5; x <= 0.5; x += 1.0) {
            s += sampleShadow(uvm + vec2<f32>(x, y) / SHADOW_PAGE, index, depth);
          }
        }
        s /= 4.0;
      }
      else {
        s += sampleShadow(uvm, index, depth);
      }
      
      if (abs(pos.x) < 1 && abs(pos.y) < 1) {
        radiance *= s;
      }
    }
  }
  else if (kind == 2) {
    // Point
    let d = light.position.xyz - surface.position.xyz;
    L = normalize(d);
    radiance /= dot(d, d);
    radiance *= light.color.rgb * 3.1415;

    if (light.shadowMap >= 0) {
      let index = u32(light.shadowMap);

      let pos = light.into * vec4<f32>(surface.position.xyz + surface.normal.xyz * light.shadowBias.y, 1.0);
      let dir = normalize(pos.xyz);

      let n = dot(surface.normal.xyz, dir);
      let slope = (1.0 - abs(n));

      let a = abs(pos.xyz);
      let z = max(max(a.x, a.y), a.z) - slope * light.shadowBias.x;

      let depth = dot(vec2<f32>(1.0, 1.0/z), light.shadowDepth);

      let blur = light.shadowBlur;
      var s = 0.0;

      let size = (light.shadowUV.zw - light.shadowUV.xy) * SHADOW_PAGE;
      let uvm = (encodeOctahedral(dir) * (size - f32(blur) * 2.0) / size) *.5 + .5;
      let uv = mix(light.shadowUV.xy, light.shadowUV.zw, uvm);

      if (blur >= 4) {
        for (var y = -1.5; y <= 1.5; y += 1.0) {
          for (var x = -1.5; x <= 1.5; x += 1.0) {
            s += sampleShadow(uv + vec2<f32>(x, y) / SHADOW_PAGE, index, depth);
          }
        }
        s /= 16.0;
      }
      else if (blur == 3) {
        for (var y = -1.0; y <= 1.0; y += 1.0) {
          for (var x = -1.0; x <= 1.0; x += 1.0) {
            s += sampleShadow(uv + vec2<f32>(x, y) / SHADOW_PAGE, index, depth);
          }
        }
        s /= 9.0;
      }
      else if (blur == 2) {
        for (var y = -0.5; y <= 0.5; y += 1.0) {
          for (var x = -0.5; x <= 0.5; x += 1.0) {
            s += sampleShadow(uv + vec2<f32>(x, y) / SHADOW_PAGE, index, depth);
          }
        }
        s /= 4.0;
      }
      else {
        s += sampleShadow(uv, index, depth);
      }
      
      radiance *= s;
    }
  }
  else if (kind == 3) {
    // Dome
    L = normalize(-light.normal.xyz);
    let f = clamp(dot(L, N), 0.0, 1.0);
    let color = mix(light.opts.rgb, light.color.rgb, f);
    let bleed = light.normal.w;
    if (bleed > 0.0) { L = mix(L, N, bleed); };
    radiance *= color * 3.1415;
  }
  else {
    return vec3<f32>(0.0);
  }

  let direct = radiance * applyMaterial(N, L, V, surface);
  return direct;
}
