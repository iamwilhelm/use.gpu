use '@use-gpu/wgsl/use/view'::{ worldToClip, getWorldScale };

@external fn transformPosition(p: vec4<f32>) -> vec4<f32>;

@external fn getPosition(i: u32) -> vec4<f32>;
@external fn getOffset(i: u32) -> vec4<f32>;
@external fn getDepth(i: u32) -> f32;
@external fn getSize(i: u32) -> f32;

let EPSILON: f32 = 0.001;

fn getTickV(index: u32) -> f32 {
  let n = u32(TICK_DETAIL + 1);
  let i = index % n;
  return f32(i) / f32(TICK_DETAIL) - 0.5;
};

@export fn getTickPosition(index: u32) -> vec4<f32> {
  let n = u32(TICK_DETAIL + 1);
  
  let offset = getOffset(index);
  let depth = getDepth(index);
  let size = getSize(index);

  let anchor = getPosition(index / n);
  
  let center = transformPosition(anchor);
  let adj = transformPosition(anchor + offset * EPSILON);

  let tangent = normalize(adj.xyz - center.xyz);

  let v = getTickV(index);
  
  let c = worldToClip(center);
  let s = getWorldScale(c.w, depth);

  return center + vec4<f32>(tangent * size * v * s, 0.0);
}
