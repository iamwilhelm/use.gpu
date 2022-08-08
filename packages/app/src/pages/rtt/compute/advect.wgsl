use '@use-gpu/wgsl/use/array'::{ sizeToModulus2, packIndex2, wrapIndex2 };

@link var<storage, read_write> velocityBufferOut: array<vec4<f32>>;
@link var<storage> velocityBufferIn: array<vec4<f32>>;

@optional @link fn getTimeStep(i: u32) -> f32 { return 1.0; };

@compute @workgroup_size(1)
fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
  @builtin(num_workgroups) numWorkgroups: vec3<u32>,
) {
  let size = numWorkgroups.xy;
  let modulus = sizeToModulus2(vec4<u32>(numWorkgroups, 1u));
  let step = getTimeStep(0u);

  let center = packIndex2(globalId.xy, modulus);

  let sample = velocityBufferIn[center];

  let xy = vec2<f32>(globalId.xy) + sample.xy * step;

  let xyi = floor(xy);
  let ff = xy - xyi;
  let ij = vec2<u32>(xyi);

  let tl = velocityBufferIn[packIndex2(ij, modulus)];
  let tr = velocityBufferIn[packIndex2(wrapIndex2(ij, size, vec2<i32>(1, 0)), modulus)];
  let bl = velocityBufferIn[packIndex2(wrapIndex2(ij, size, vec2<i32>(0, 1)), modulus)];
  let br = velocityBufferIn[packIndex2(wrapIndex2(ij, size, vec2<i32>(1, 1)), modulus)];

  let value = mix(mix(tl, tr, ff.x), mix(bl, br, ff.x), ff.y);
  velocityBufferOut[center] = value;
}
