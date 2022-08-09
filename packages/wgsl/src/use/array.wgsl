@export fn sizeToModulus2(size: vec2<u32>) -> vec2<u32> {
  return vec2<u32>(size.x, 0xffffffffu);
}

@export fn sizeToModulus3(size: vec3<u32>) -> vec3<u32> {
  let s = size.x * size.y;
  return vec3<u32>(size.x, s, 0xffffffffu);
}

@export fn sizeToModulus4(size: vec4<u32>) -> vec4<u32> {
  let s1 = size.x * size.y;
  let s2 = s1 * size.z;
  return vec4<u32>(size.x, s1, s2, 0xffffffffu);
}

@export fn packIndex2(v: vec2<u32>, modulus: vec2<u32>) -> u32 {
  return dot(v, vec2<u32>(1u, modulus.x));
}

@export fn packIndex3(v: vec3<u32>, modulus: vec3<u32>) -> u32 {
  return dot(v, vec3<u32>(1u, modulus.xy));
}

@export fn packIndex4(v: vec4<u32>, modulus: vec4<u32>) -> u32 {
  return dot(v, vec4<u32>(1u, modulus.xyz));
}

@export fn unpackIndex2(i: u32, modulus: vec2<u32>) -> vec2<u32> {
  return (i % modulus) / vec2<u32>(1u, modulus.x);
}

@export fn unpackIndex3(i: u32, modulus: vec3<u32>) -> vec3<u32> {
  return (i % modulus) / vec3<u32>(1u, modulus.xy);
}

@export fn unpackIndex4(i: u32, modulus: vec4<u32>) -> vec4<u32> {
  return (i % modulus) / vec4<u32>(1u, modulus.xyz);
}

@export fn clipIndex2(index: vec2<u32>, size: vec2<u32>) -> vec2<u32> {
  return min(size - 1, index);
}

@export fn clipIndex3(index: vec3<u32>, size: vec3<u32>) -> vec3<u32> {
  return min(size - 1, index);
}

@export fn clipIndex4(index: vec4<u32>, size: vec4<u32>) -> vec4<u32> {
  return min(size - 1, index);
}

@export fn wrapIndex2(index: vec2<i32>, size: vec2<u32>) -> vec2<u32> {
  let s = vec2<i32>(size);
  var signed = index;
  signed = select(signed, signed + s, signed < vec2<i32>(0));
  signed = select(signed, signed - s, signed >= s);
  return vec2<u32>(signed);
}

@export fn wrapIndex3(index: vec3<i32>, size: vec3<u32>) -> vec3<u32> {
  let s = vec3<i32>(size);
  var signed = index;
  signed = select(signed, signed + s, signed < vec3<i32>(0));
  signed = select(signed, signed - s, signed >= s);
  return vec3<u32>(signed);
}

@export fn wrapIndex4(index: vec4<i32>, size: vec4<u32>) -> vec4<u32> {
  let s = vec4<i32>(size);
  var signed = index;
  signed = select(signed, signed + s, signed < vec4<i32>(0));
  signed = select(signed, signed - s, signed >= s);
  return vec4<u32>(signed);
}

@export fn wrapIndex2i(index: vec2<i32>, size: vec2<u32>) -> vec2<i32> {
  let s = vec2<i32>(size);
  var signed = index;
  signed = select(signed, signed + s, signed < vec2<i32>(0));
  signed = select(signed, signed - s, signed >= s);
  return signed;
}

@export fn wrapIndex3i(index: vec3<i32>, size: vec3<u32>) -> vec3<i32> {
  let s = vec3<i32>(size);
  var signed = index;
  signed = select(signed, signed + s, signed < vec3<i32>(0));
  signed = select(signed, signed - s, signed >= s);
  return signed;
}

@export fn wrapIndex4i(index: vec4<i32>, size: vec4<u32>) -> vec4<i32> {
  let s = vec4<i32>(size);
  var signed = index;
  signed = select(signed, signed + s, signed < vec4<i32>(0));
  signed = select(signed, signed - s, signed >= s);
  return signed;
}

@export fn clampIndex2(index: vec2<i32>, size: vec2<u32>) -> vec2<u32> {
  return vec2<u32>(max(vec2<i32>(0), min(vec2<i32>(size) - 1, index)));
}

@export fn clampIndex3(index: vec3<i32>, size: vec3<u32>) -> vec3<u32> {
  return vec3<u32>(max(vec3<i32>(0), min(vec3<i32>(size) - 1, index)));
}

@export fn clampIndex4(index: vec4<i32>, size: vec4<u32>) -> vec4<u32> {
  return vec4<u32>(max(vec4<i32>(0), min(vec4<i32>(size) - 1, index)));
}
