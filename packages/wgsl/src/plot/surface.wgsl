use '@use-gpu/wgsl/geometry/strip'::{ getStripIndex };

@link fn getSize(i: u32) -> vec4<u32> {};

@export fn getSurfaceIndex(index: u32) -> u32 {
  let vertex = index % 6u;
  let instance = index / 6u;

  var dx = 1u;
  var dy = 1u;
  if (LOOP_X) { dx = 0u; }
  if (LOOP_Y) { dy = 0u; }

  let s = getSize(0u);

  var x = 0u;
  var y = 0u;
  var z = 0u;
  var w = 0u;
  
  var xy = getStripIndex(vertex - (vertex / 3u) * 2u);

  var d = instance;
  
  if (s.x > 1u) {
    let m = s.x - dx;
    x = (d % m) + xy.x;
    d = d / m;

    if (LOOP_X && x == m) { x = 0u; }
  }

  if (s.y > 1u) {
    let m = s.y - dy;
    y = (d % m) + xy.y;
    d = d / m;
    if (LOOP_Y && y == m) { y = 0u; }
  }

  return x + s.x * (y + s.y * d);
}
