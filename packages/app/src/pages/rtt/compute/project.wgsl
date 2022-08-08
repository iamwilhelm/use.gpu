use '@use-gpu/wgsl/use/array'::{ sizeToModulus2, packIndex2, wrapIndex2 };

@link var<storage> pressureBuffer: array<f32>;

@link var<storage, read_write> velocityBufferOut: array<vec4<f32>>;
@link var<storage> velocityBufferIn: array<vec4<f32>>;

@compute @workgroup_size(1)
fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
  @builtin(num_workgroups) numWorkgroups: vec3<u32>,
) {
  let modulus = sizeToModulus2(vec4<u32>(numWorkgroups, 1u));

  let center = packIndex2(globalId.xy, modulus);

  let left   = packIndex2(wrapIndex2(globalId.xy, numWorkgroups.xy, vec2<i32>(-1, 0)), modulus);
  let right  = packIndex2(wrapIndex2(globalId.xy, numWorkgroups.xy, vec2<i32>( 1, 0)), modulus);
  let top    = packIndex2(wrapIndex2(globalId.xy, numWorkgroups.xy, vec2<i32>(0, -1)), modulus);
  let bottom = packIndex2(wrapIndex2(globalId.xy, numWorkgroups.xy, vec2<i32>(0,  1)), modulus);

  let p1 = pressureBuffer[left];
  let p2 = pressureBuffer[right];
  let p3 = pressureBuffer[top];
  let p4 = pressureBuffer[bottom];

  var sample = velocityBufferIn[center];

  sample.x -= .5 * (p2 - p1);
  sample.y -= .5 * (p4 - p3);

  velocityBufferOut[center] = sample;
}
