@export fn sizeToModulus2(size: vec4<u32>) -> vec2<u32> {
  return vec2<u32>(size.x, 0xffffffffu);
}

@export fn sizeToModulus3(size: vec4<u32>) -> vec3<u32> {
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
