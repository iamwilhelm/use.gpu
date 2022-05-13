@link fn getSize(i: u32) -> vec4<u32> {};

@export fn unpackIndex(i: u32) -> vec4<u32> {
  
  let s = getSize(0u);
  var d = i;
  var x = 0u;
  var y = 0u;
  var z = 0u;
  var w = 0u;

  if (s.x > 1u) {
    x = d % s.x;
    d = d / s.x;
  }

  if (s.y > 1u) {
    y = d % s.y;
    d = d / s.y;
  }

  if (s.z > 1u) {
    z = d % s.z;
    d = d / s.z;
  }

  w = d;

  return vec4<u32>(x, y, z, w);
}

@export fn packIndex(v: vec4<u32>) -> u32 {
  let s = getSize(0u);
  return v.x + s.x * (v.y + s.y * (v.z + s.z * v.w));
}
