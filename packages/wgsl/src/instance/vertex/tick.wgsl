use '@use-gpu/wgsl/use/view'::{ worldToClip, getWorldScale, getViewScale };

@link fn transformPosition(p: vec4<f32>) -> vec4<f32>;

@link fn getPosition(i: u32) -> vec4<f32>;
@link fn getOffset(i: u32) -> vec4<f32>;
@link fn getDepth(i: u32) -> f32;
@link fn getSize(i: u32) -> f32;

let EPSILON: f32 = 0.001;

@export fn getTickPosition(index: u32) -> vec4<f32> {
  let offset = getOffset(index);
  let depth = getDepth(index);
  let size = getSize(index);

  let n = u32(LINE_DETAIL + 1);
  let v = f32(index % n) / f32(LINE_DETAIL) - 0.5;

  let anchor = getPosition(index / n);
  
  let center = transformPosition(anchor);
  let adj = transformPosition(anchor + offset * EPSILON);

  let tangent = normalize(adj.xyz - center.xyz);
  
  let c = worldToClip(center);
  let s = getWorldScale(c.w, depth) * getViewScale();

  return center + vec4<f32>(tangent * size * v * s, 0.0);
}
