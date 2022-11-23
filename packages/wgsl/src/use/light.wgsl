use '@use-gpu/wgsl/use/types'::{ Light };

struct LightUniforms {
  count: u32,
  lights: array<Light>,
};

@group(LIGHT) @binding(0) var<storage> lightUniforms: LightUniforms;
@group(LIGHT) @binding(1) var lightTexture: texture_depth_2d_array;
@group(LIGHT) @binding(2) var lightSampler: sampler_comparison;

@export fn getLightCount() -> u32 { return lightUniforms.count; }
@export fn getLight(index: u32) -> Light { return lightUniforms.lights[index]; }

@export fn sampleShadow(uv: vec2<f32>, index: u32, level: f32) -> f32 {
  return textureSampleCompare(lightTexture, lightSampler, uv, index, level);
}
