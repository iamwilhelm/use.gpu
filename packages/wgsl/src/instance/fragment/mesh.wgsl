/* https://www.shadertoy.com/view/XlKSDR */

let PI = 3.141592;
let F_DIELECTRIC = 0.04;

fn saturate(x: f32) -> f32 {
  return max(x, 0.0);
}

fn pow5(x: f32) -> f32 {
  var x2 = x * x;
  return x2 * x2 * x;
}

// D - Normal distribution term
fn ndfGGX2(cosTheta: f32, alpha: f32) -> f32 {
  var alphaSqr = alpha * alpha;
  var denom = cosTheta * cosTheta * (alphaSqr - 1.0) + 1.0f;
  return alphaSqr / (PI * denom * denom);
}

fn ndfGGX(cosTheta: f32, alpha: f32) -> f32 {
  var oneMinus = 1.0 - cosTheta * cosTheta;
  var a = cosTheta * alpha;
  var k = alpha / (oneMinus + a * a);
  var d = k * k * (1.0 / PI);
  return d;
}

// F - Schlick approximation of Fresnel
fn fresnelSchlickVec3(cosTheta: f32, f0: vec3<f32>) -> vec3<f32> {
  var ft = pow5(1.0 - cosTheta);
  return f0 + (1.0 - f0) * ft;
}

fn fresnelSchlick(cosTheta: f32, f0: f32, f90: f32) -> f32 {
  return f0 + (f90 - f0) * pow(1.0 - cosTheta, 5.0);
}

fn fdBurley(dotNL: f32, dotNV: f32, dotLH: f32, alpha: f32) -> f32 {
  var f90 = 0.5 + 2.0 * alpha * dotLH * dotLH;
  var lightScatter = fresnelSchlick(dotNL, 1.0, f90);
  var viewScatter = fresnelSchlick(dotNV, 1.0, f90);
  return lightScatter * viewScatter * (1.0 / PI);
}

// G - Geometric attenuation term
fn G1X(dotNX: f32, k: f32) -> f32 {
  return 1.0f / (dotNX * (1.0f - k) + k);
}

fn smithGGXCorrelated(dotNL: f32, dotNV: f32, alpha: f32) -> f32 {
  var a2 = alpha * alpha;
  var GGXL = dotNV * sqrt((dotNL - a2 * dotNL) * dotNL + a2);
  var GGXV = dotNL * sqrt((dotNV - a2 * dotNV) * dotNV + a2);
  return 0.5 / (GGXL + GGXV);
}

fn geometricGGX(dotNL: f32, dotNV: f32, alpha: f32) -> f32 {
  var k = alpha / 2.0f;
  return G1X(dotNL, k) * G1X(dotNV, k);
}

// N, L, V must be normalized
// @export
fn PBR(
  N: vec3<f32>,
  L: vec3<f32>,
  V: vec3<f32>,
  albedo: vec3<f32>,
  metalness: f32,
  roughness: f32,
) -> vec3<f32> {

  var diffuseColor = albedo * (1.0 - metalness);
  var F0 = mix(vec3(F_DIELECTRIC), albedo, metalness);

  var alpha = roughness * roughness;
  var dotNV = saturate(dot(N, V));

  var radiance = 3.1415;

  var H = normalize(V + L);
  var dotNL = saturate(dot(N, L));
  var dotNH = saturate(dot(N, H));
  var dotLH = saturate(dot(L, H));

  var F = fresnelSchlickVec3(dotLH, F0);
  var D = ndfGGX(dotNH, alpha);
  var G = smithGGXCorrelated(dotNL, dotNV, alpha);
  //float G2 = geometricGGX(dotNL, dotNV, alpha);
  //return vec3(abs(G - G2) / 100.0);
  
  var Fd = albedo * fdBurley(dotNL, dotNV, dotLH, alpha);
  var Fs = F * D * G;

  var direct = (Fd + Fs) * radiance * dotNL;
  return direct;
}


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