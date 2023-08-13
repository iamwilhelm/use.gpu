use '@use-gpu/wgsl/use/array'::{ sizeToModulus2, packIndex2 };
use '@use-gpu/wgsl/codec/f16'::{ toF16u4 };
use '@use-gpu/wgsl/codec/octahedral'::{ decodeOctahedral };

@link fn getTargetMapping() -> vec4<u32> {};
@link fn getSourceMapping() -> vec4<u32> {};

@optional @link fn getCubeMap(uvw: vec3<f32>, dx: vec3<f32>, dy: vec3<f32>) -> vec4<f32> { return vec4<f32>(0.0); };

@link var<storage, read_write> computeBuffer: array<vec2<u32>>; // vec4<f16>

const ZERO_D = vec3<f32>(0.0);

@compute @workgroup_size(8, 8)
@export fn sampleBlur(
  @builtin(global_invocation_id) globalId: vec3<u32>,
) {
  let mapping = getTargetMapping();
  let size = mapping.zw - mapping.xy;

  if (any(globalId.xy >= vec2<u32>(size))) { return; }

  let xy = vec2<u32>(globalId.xy);
  let uv = (vec2<f32>(xy) + .5) / vec2<f32>(size);
  let uvw = decodeOctahedral(uv * 2.0 - 1.0);

  var sample: vec4<f32> = vec4<f32>(0.0);
  if (PMREM_PASS == 0) {
    sample = getCubeMap(uvw, ZERO_D, ZERO_D);
  }

  let modulus = sizeToModulus2(size);
  let index = packIndex2(xy + mapping.xy, modulus);
  computeBuffer[index] = toF16u4(sample);
}

