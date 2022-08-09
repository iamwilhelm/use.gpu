use '@use-gpu/wgsl/use/array'::{ wrapIndex2i };

@link fn getSize() -> vec2<u32> {};

@link var velocityTexture: texture_2d<f32>;

@link var divergenceTexture: texture_storage_2d<r32float, write>;

@compute @workgroup_size(8, 8)
fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
  @builtin(num_workgroups) numWorkgroups: vec3<u32>,
) {
  let size = getSize();

  if (any(globalId.xy >= size)) { return; }
  let center = vec2<i32>(globalId.xy);

  let left   = wrapIndex2i(center - vec2<i32>(1, 0), size);
  let right  = wrapIndex2i(center + vec2<i32>(1, 0), size);
  let top    = wrapIndex2i(center - vec2<i32>(0, 1), size);
  let bottom = wrapIndex2i(center + vec2<i32>(0, 1), size);

  let ux1 = textureLoad(velocityTexture, left, 0).x;
  let ux2 = textureLoad(velocityTexture, right, 0).x;

  let vy1 = textureLoad(velocityTexture, top, 0).y;
  let vy2 = textureLoad(velocityTexture, bottom, 0).y;

  let div = -((ux2 - ux1) + (vy2 - vy1)) * .5;
  
  textureStore(divergenceTexture, center, vec4<f32>(div, 0.0, 0.0, 0.0));
}
