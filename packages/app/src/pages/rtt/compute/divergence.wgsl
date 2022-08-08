use '@use-gpu/wgsl/use/array'::{ sizeToModulus2, packIndex2, wrapIndex2 };

@link var<storage> velocityBuffer: array<vec4<f32>>;

@link var<storage, read_write> divergenceBuffer: array<f32>;

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

  let ux1 = velocityBuffer[left].x;
  let ux2 = velocityBuffer[right].x;

  let vy1 = velocityBuffer[top].y;
  let vy2 = velocityBuffer[bottom].y;

  let div = -((ux2 - ux1) + (vy2 - vy1)) * .5;

  divergenceBuffer[center] = div;
}
