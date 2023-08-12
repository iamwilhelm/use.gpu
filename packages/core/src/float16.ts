// Based on
// http://www.fox-toolkit.org/ftp/fasthalffloatconversion.pdf
const BASE_TABLE = new Uint16Array(512);
const SHIFT_TABLE = new Uint8Array(512);

const generateTables = () => {
  for (let i = 0; i < 256; ++i) {
    let e = i - 127;

    if (e < -24) { // Very small numbers map to zero
      BASE_TABLE[i | 0x000] = 0x0000;
      BASE_TABLE[i | 0x100] = 0x8000;
      SHIFT_TABLE[i | 0x000] = 24;
      SHIFT_TABLE[i | 0x100] = 24;
    }
    else if (e < -14) { // Small numbers map to denorms
      BASE_TABLE[i | 0x000] = (0x0400 >> (-e-14));
      BASE_TABLE[i | 0x100] = (0x0400 >> (-e-14))  |  0x8000;
      SHIFT_TABLE[i | 0x000] = -e-1;
      SHIFT_TABLE[i | 0x100] = -e-1;
    }
    else if (e <= 15) { // Normal numbers just lose precision
      BASE_TABLE[i | 0x000] = ((e+15) << 10);
      BASE_TABLE[i | 0x100] = ((e+15) << 10)  |  0x8000;
      SHIFT_TABLE[i | 0x000] = 13;
      SHIFT_TABLE[i | 0x100] = 13;
    }
    else if (e < 128) { // Large numbers map to Infinity
      BASE_TABLE[i | 0x000] = 0x7C00;
      BASE_TABLE[i | 0x100] = 0xFC00;
      SHIFT_TABLE[i | 0x000] = 24;
      SHIFT_TABLE[i | 0x100] = 24;
    }
    else { // Infinity and NaN's stay Infinity and NaN's
      BASE_TABLE[i | 0x000] = 0x7C00;
      BASE_TABLE[i | 0x100] = 0xFC00;
      SHIFT_TABLE[i | 0x000] = 13;
      SHIFT_TABLE[i | 0x100] = 13;
    }
  }
};

const buffer = new ArrayBuffer(4);
const asUint32 = new Uint32Array(buffer);
const asFloat32 = new Float32Array(buffer);

let _toFloat16 = (f32: number) => {
  asFloat32[0] = f32;
  const f = asUint32[0];
  const h = ((f >> 16) & 0x8000) | ((((f & 0x7f800000) - 0x38000000) >> 13) & 0x7c00) | ((f >> 13) & 0x03ff);
  return h;
};

let _toFloat32 = (f16: number) => {
  const h = f16;
  const f = ((h & 0x8000) << 16) | (((h & 0x7c00) + 0x1C000) << 13) | ((h & 0x03FF) << 13);
  asUint32[0] = f;
  return asFloat32[0];
};

export let toFloat16 = (x: number) => {
  generateTables();
  toFloat16 = _toFloat16;
  return _toFloat16(x);
};

export let toFloat32 = (x: number) => {
  generateTables();
  toFloat32 = _toFloat32;
  return _toFloat32(x);
};
