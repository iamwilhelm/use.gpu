use '@use-gpu/wgsl/use/array'::{ sizeToModulus2, packIndex2 };
use '@use-gpu/wgsl/codec/f16'::{ fromF16u4 };
use '@use-gpu/wgsl/codec/octahedral'::{ encodeOctahedral };

@link fn getMapping() -> vec4<u32> {};

@link var<storage> computeBuffer: array<vec2<u32>>; // vec4<f16>

const ZERO_D = vec3<f32>(0.0);

@export fn sampleCubeMap(
  uvw: vec3<f32>,
) -> vec4<f32> {
  let mapping = getMapping();
  let size = mapping.zw - mapping.xy;

  let uv = encodeOctahedral(uvw);
  let xy = (uv * .5 + .5) * vec2<f32>(size);

  let ixy = floor(xy);
  let dxy = xy - ixy;

  let modulus = sizeToModulus2(size);
  let index = packIndex2(vec2<u32>(ixy) + mapping.xy, modulus);

  return fromF16u4(computeBuffer[index]);
}

@export fn sampleTextureMap(
  uv: vec2<f32>,
) -> vec4<f32> {
  let mapping = getMapping();
  let size = mapping.zw - mapping.xy;

  let xy = uv * vec2<f32>(size);

  let ixy = floor(xy);
  let dxy = xy - ixy;

  let modulus = sizeToModulus2(size);
  let index = packIndex2(vec2<u32>(ixy) + mapping.xy, modulus);

  return fromF16u4(computeBuffer[index]);
}


