import { PBR } from '@use-gpu/wgsl/fragment/pbr';

////////

struct ViewUniforms {
  projectionMatrix: mat4x4<f32>;
  viewMatrix: mat4x4<f32>;
  viewPosition: vec4<f32>;
  viewResolution: vec2<f32>;
  viewSize: vec2<f32>;
  viewWorldUnit: f32;
  viewPixelRatio: f32;
};

@group(0) @binding(0) var<uniform> viewUniforms: ViewUniforms;

struct LightUniforms {
  lightPosition: vec4<f32>;
  lightColor: vec4<f32>;
};

////////

@group(0) @binding(1) var<uniform> lightUniforms: LightUniforms;

@group(1) @binding(0) var s: sampler;
@group(1) @binding(1) var t: texture_2d<f32>;

struct FragmentOutput {
  @location(0) outColor: vec4<f32>;
};

@stage(fragment)
fn main(
  @location(0) fragColor: vec4<f32>,
  @location(1) fragUV: vec2<f32>,
  @location(2) fragNormal: vec3<f32>,
  @location(3) fragPosition: vec3<f32>,
) -> FragmentOutput {
  var fragLight: vec3<f32> = lightUniforms.lightPosition.xyz - fragPosition;
  var fragView: vec3<f32> = viewUniforms.viewPosition.xyz - fragPosition;

  var N: vec3<f32> = normalize(fragNormal);
  var L: vec3<f32> = normalize(fragLight);
  var V: vec3<f32> = normalize(fragView);

  var texColor: vec4<f32> = textureSample(t, s, fragUV);
  var inColor: vec4<f32> = fragColor * texColor;
  if (inColor.a <= 0.0) { discard; }

  var albedo: vec3<f32> = inColor.rgb;
  var metalness: f32 = 0.2;
  var roughness: f32 = 0.8;

  var color: vec3<f32> = PBR(N, L, V, albedo, metalness, roughness) * lightUniforms.lightColor.xyz;
  var outColor: vec4<f32> = vec4<f32>(color, inColor.a);

  return FragmentOutput(outColor);
}

/*
#pragma import {PBR} from '@use-gpu/glsl/fragment/pbr';
#pragma import {getPickingColor} from '@use-gpu/glsl/use/picking';
#pragma import {viewUniforms} from '@use-gpu/glsl/use/view';
#pragma import {lightUniforms} from '@use-gpu/glsl/use/light';

#ifdef IS_PICKING
layout(location = 0) in flat uint fragIndex;
layout(location = 0) out uvec4 outColor;
#else
layout(set = 1, binding = 0) uniform sampler s;
layout(set = 1, binding = 1) uniform texture2D t;

layout(location = 0) in vec4 fragColor;
layout(location = 1) in vec2 fragUV;

layout(location = 2) in vec3 fragNormal;
layout(location = 3) in vec3 fragPosition;

layout(location = 0) out vec4 outColor;
#endif

#ifdef IS_PICKING
void main() {
  outColor = getPickingColor(fragIndex);
}
#else
void main() {
  vec3 fragLight = lightUniforms.lightPosition.xyz - fragPosition;
  vec3 fragView = viewUniforms.viewPosition.xyz - fragPosition;

  vec3 N = normalize(fragNormal);
  vec3 L = normalize(fragLight);
  vec3 V = normalize(fragView);

  vec4 texColor = texture(sampler2D(t, s), fragUV);
  vec4 inColor = fragColor * texColor;
  if (inColor.a <= 0.0) discard;

  vec3 albedo = inColor.rgb;
  float metalness = 0.2;
  float roughness = 0.8;

  vec3 color = PBR(N, L, V, albedo, metalness, roughness) * lightUniforms.lightColor.xyz;
  outColor = vec4(color, inColor.a);

}
#endif

*/