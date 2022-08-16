@link fn getScissorMin() -> vec4<f32> {};
@link fn getScissorMax() -> vec4<f32> {};

@export fn getScissorLevel(position: vec4<f32>) -> vec4<f32> {
  let smin = getScissorMin();
  let smax = getScissorMax();
  return min(position - smin, smax - position);
};
