@link fn getFlip() -> vec2<f32>;
@link fn getOffset() -> vec2<f32>;

@export fn getLayoutPosition(position: vec4<f32>) -> vec4<f32> {
  let flip = getFlip();
  let offset = getOffset();

  var x = position.x;
  var y = position.y;
  if (flip.x > 0.0) { x = flip.x - x; }
  if (flip.y > 0.0) { y = flip.y - y; }
  return vec4<f32>(vec2<f32>(x, y) + offset, position.zw);
}
