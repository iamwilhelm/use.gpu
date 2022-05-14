use '@use-gpu/wgsl/use/view'::{ getViewPosition };
use '@use-gpu/wgsl/use/light'::{ lightUniforms };

@optional @link fn getFragment(color: vec4<f32>, uv: vec2<f32>) -> vec4<f32> { return color; }

@optional @link fn getAlbedo(uv: vec2<f32>) -> vec4<f32> { return vec4<f32>(1.0, 1.0, 1.0, 1.0); }
@optional @link fn getMetalness(uv: vec2<f32>) -> f32 { return 0.2; }
@optional @link fn getRoughness(uv: vec2<f32>) -> f32 { return 0.8; }

@stage(fragment)
fn main(
  @location(0) fragColor: vec4<f32>,
  @location(1) fragUV: vec2<f32>,
  @location(2) fragNormal: vec3<f32>,
  @location(3) fragPosition: vec3<f32>,
) -> @location(0) vec4<f32> {
  var inColor = fragColor;
  inColor = getFragment(inColor, fragUV);

  var fragLight: vec3<f32> = lightUniforms.lightPosition.xyz - fragPosition;
  var fragView: vec3<f32> = getViewPosition().xyz - fragPosition;

  var N: vec3<f32> = normalize(fragNormal);
  var L: vec3<f32> = normalize(fragLight);
  var V: vec3<f32> = normalize(fragView);

  var inColor: vec4<f32> = fragColor;
  if (inColor.a <= 0.0) { discard; }

  var albedo: vec3<f32> = inColor.rgb * getAlbedo(fragUV).rgb;
  var metalness: f32 = getMetalness(fragUV);
  var roughness: f32 = getRoughness(fragUV);

  var color: vec3<f32> = PBR(N, L, V, albedo, metalness, roughness) * lightUniforms.lightColor.xyz;
  var outColor: vec4<f32> = vec4<f32>(color * inColor.a, inColor.a);

  return outColor;
}
