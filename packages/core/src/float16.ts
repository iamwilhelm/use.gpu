const buffer = new ArrayBuffer(4);
const asUint32 = new Uint32Array(buffer);
const asFloat32 = new Float32Array(buffer);

export const toFloat16 = (f32: number) => {
  asFloat32[0] = f32;
  const f = asUint32[0];

  const s = (f & 0x80000000) >>> 16;
  const e = (f & 0x7f800000);
  const m = (f & 0x7fffff);
  const h = (
    // Zero
    !(e | m) ? 0 :
    // NaN or +-Inf
    e == 0x7f800000 ? (m ? 0x7e00 : (s | 0x7c00)) :
    // Overflow (Inf)
    e > 0x47000000 ? (s | 0x7c00) :
    // Normal
    e > 0x38000000 ? (s | (((e - 0x38000000) >> 13) & 0x7c00) | (m >> 13)) :
    // Subnormal or underflow
    e > 0x33000000 ? (s | ((m | (1<<23)) >> (126 - (e >> 23)))) : 0
  );

  return h;
};

const fromFloat16 = (f16: number) => {
  let l;

  const h = f16;
  const s = (h & 0x8000) << 16;
  const e = (h & 0x7c00);
  const m = (h & 0x3ff);
  const f = (
    // Zero
    !(e | m) ? 0 :
    // NaN or +-Inf
    e == 0x7c00 ? (m ? 0x7fc00000 : (s | 0x7f800000)) :
    // Normal
    e != 0 ? (s | ((e + 0x1c000) << 13) | (m << 13)) :
    // Subnormal
    (l = Math.floor(Math.log2(m)), s | ((103 + l) << 23) | ((m << (23 - l)) & 0x7fffff))
  );
  asUint32[0] = f;
  return asFloat32[0];
};

console.log(toFloat16(1.0).toString(16))
console.log(toFloat16(0.75).toString(16))
console.log(toFloat16(0.25).toString(16))
