fn min4(v: vec4<f32>) -> f32 {
};

@export fn isScissored(min4: vec4<f32>) -> bool {
  let min2 = min(min4.xy, min4.zw);
  return min(min2.x, min2.y) < 0.0;
}
