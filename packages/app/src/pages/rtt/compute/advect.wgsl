use '@use-gpu/wgsl/use/array'::{ sizeToModulus2, packIndex2, wrapIndex2 };

@link var<storage, read_write> velocityBufferOut: array<vec4<f32>>;
@link var<storage> velocityBufferIn: array<vec4<f32>>;

@compute @workgroup_size(1)
fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
  @builtin(num_workgroups) numWorkgroups: vec3<u32>,
) {
  let modulus = sizeToModulus2(vec4<u32>(numWorkgroups, 1u));
  let size = vec2<i32>(numWorkgroups.xy);

  let center = packIndex2(globalId.xy, modulus);

  let sample = velocityBufferIn[center];
  let xy = vec2<f32>(globalId.xy) + sample.xy * f32(TIME_STEP);

  let xyi = floor(xy);
  let ff = xy - xyi;
  let ij = vec2<i32>(xyi);

  let tl = velocityBufferIn[packIndex2(wrapIndex2(ij + vec2<i32>(0, 0), size), modulus)];
  let tr = velocityBufferIn[packIndex2(wrapIndex2(ij + vec2<i32>(1, 0), size), modulus)];
  let bl = velocityBufferIn[packIndex2(wrapIndex2(ij + vec2<i32>(0, 1), size), modulus)];
  let br = velocityBufferIn[packIndex2(wrapIndex2(ij + vec2<i32>(1, 1), size), modulus)];

  let value = mix(mix(tl, tr, ff.x), mix(bl, br, ff.x), ff.y);
  velocityBufferOut[center] = value;
}
