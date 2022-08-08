use '@use-gpu/wgsl/use/array'::{ sizeToModulus2, packIndex2, wrapIndex2 };

@link var<storage> divergenceBuffer: array<f32>;

@link var<storage, read_write> pressureBufferOut: array<f32>;
@link var<storage> pressureBufferIn: array<f32>;

@compute @workgroup_size(1)
fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
  @builtin(num_workgroups) numWorkgroups: vec3<u32>,
) {
  let modulus = sizeToModulus2(vec4<u32>(numWorkgroups, 1u));

  let ixy = vec2<i32>(globalId.xy);
  let size = vec2<i32>(numWorkgroups.xy);

  let center = packIndex2(globalId.xy, modulus);

  let left   = packIndex2(wrapIndex2(ixy + vec2<i32>(-1, 0), size), modulus);
  let right  = packIndex2(wrapIndex2(ixy + vec2<i32>( 1, 0), size), modulus);
  let top    = packIndex2(wrapIndex2(ixy + vec2<i32>(0, -1), size), modulus);
  let bottom = packIndex2(wrapIndex2(ixy + vec2<i32>(0,  1), size), modulus);

  let p1 = pressureBufferIn[left];
  let p2 = pressureBufferIn[right];
  let p3 = pressureBufferIn[top];
  let p4 = pressureBufferIn[bottom];

  let div = divergenceBuffer[center];

  let p = (div + p1 + p2 + p3 + p4) / 4.0;

  pressureBufferOut[center] = p;
}
