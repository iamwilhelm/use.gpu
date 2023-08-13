// F32 -> F16 as U16
@export fn xtoF16u(value: f32) -> u32 {
  let s = select(0u, 0x8000u, value < 0.0);
  let a = clamp(abs(value), 0.0, 4.0) / 4.0;
  return s | u32(a * 0x7fff);
};

@export fn xfromF16u(h: u32) -> f32 {
  let s = h & 0x8000;
  let v = h & 0x7fff;
  let a = f32(v) / 0x7fff;
  return select(a, -a, s != 0) * 4.0;
};

// F32 -> F16 as U16
@export fn toF16u(value: f32) -> u32 {
  let s = select(0u, 0x80000000u, value < 0.0);
  let f = frexp(value);
  var e = i32(f.exp);

  if (e < -14) {
    let m = u32(round(abs(f.fract) * 0x400)) >> u32(-14 - e);
    return select(
      s | m, // Sub-normal
      s | (1 << 10u), // Smallest normal
      m == 0x400
    );
  }
  else if (e <= 15) {
    let m = u32(round(abs(f.fract) * 0x800));
    return select(
      // Fits
      s | (u32(e + 14) << 10u) | (m & 0x3FFu),
      // Rounded up to next exponent
      s | (u32(e + 15) << 10u) | ((m & 0x7FFu) >> 1u),
      m == 0x800
    );
  }
  else {
    return s | 0x7c00; // +/- inf
  }
};

@export fn fromF16u(h: u32) -> f32 {
  let sem = vec3<u32>(0x8000, 0x7c00, 0x3ff) & vec3<u32>(h);
  let s = sem.x << 16u;
  let e = sem.y;
  let m = sem.z;
  let l = firstLeadingBit(m);
  let f = (
    select(
      // Zero
      0u,
      select(
        select(
          // Subnormal
          s | ((103u + l) << 23u) | ((m << (23u - l)) & 0x7fffffu),
          // Normal
          s | ((e + 0x1c000u) << 13u) | (m << 13u),
          e != 0,
        ),
        // NaN or +-Inf
        select(s | 0x7f800000u, 0x7fc00000u, m != 0u),
        e == 0x7c00u
      ),
      (e | m) != 0u
    )
  );
  return bitcast<f32>(f);
};

// vec4<f16> as vec2<u32>
@export fn toF16u4(value: vec4<f32>) -> vec2<u32> {
  return (
    vec2<u32>(toF16u(value.x), toF16u(value.z)) |
    (vec2<u32>(toF16u(value.y), toF16u(value.w)) << vec2<u32>(16u))
  );
};

@export fn fromF16u4(value: vec2<u32>) -> vec4<f32> {
  let xz = value.xy & vec2<u32>(0xFFFFu);
  let yw = value.xy >> vec2<u32>(16u);
  
  return vec4<f32>(
    fromF16u(xz.x),
    fromF16u(yw.x),
    fromF16u(xz.y),
    fromF16u(yw.y),
  );
};
