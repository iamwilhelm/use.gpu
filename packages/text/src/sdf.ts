const INF = 1e10;

type Rectangle = [number, number, number, number];

type SDFStage = {
  outer: Float64Array,
  inner: Float64Array,
  outer2: Float64Array,
  inner2: Float64Array,

  xo: Float32Array,
  yo: Float32Array,
  xi: Float32Array,
  yi: Float32Array,

  f: Float64Array,
  z: Float64Array,
  v: Uint16Array,
  b: Float32Array,
  size: number,
};

export const makeSDFStage = (size: number) => {
  const n = size * size;

  const outer = new Float64Array(n);
  const inner = new Float64Array(n);

  const outer2 = new Float64Array(n);
  const inner2 = new Float64Array(n);

  const xo = new Float32Array(n);
  const yo = new Float32Array(n);
  const xi = new Float32Array(n);
  const yi = new Float32Array(n);

  const f = new Float64Array(size);
  const z = new Float64Array(size + 1);
  const v = new Uint16Array(size);
  const b = new Float32Array(size);
  
  return {outer, inner, outer2, inner2, xo, yo, xi, yi, f, z, v, b, size};
}

let SDF_STAGE: SDFStage | null = null;

// Pad rectangle by size
export const padRectangle = ([l, t, r, b]: Rectangle, pad: number) => [l - pad, t - pad, r + pad, b + pad] as Rectangle;

// Convert grayscale glyph to rgba
export const glyphToRGBA = (data: Uint8Array, w: number, h: number) => {
  const out = new Uint8Array(data.length * 4);
  let n = data.length, j = 0;
  let b = 1;
  let odd = w%2;
  for (let i = 0; i < n; ++i) {
    const v = data[i];

    //b = 1 - b;
    //if (!odd && (i % w) === 0) b = 1 - b;

    out[j++] = b && v;
    out[j++] = b && v;
    out[j++] = b && v;
    out[j++] = b && v;
  };
  return {data: out, width: w, height: h};
};

// Convert grayscale glyph to SDF
export const glyphToSDF = (
  data: Uint8Array,
  w: number,
  h: number,
  pad: number = 4,
  radius: number = 3,
  subpixel: boolean = true,
  cutoff: number = 0.25,
) => {
  const wp = w + pad * 2;
  const hp = h + pad * 2;
  const np = wp * hp;
  const sp = Math.max(wp, hp);

  const out = new Uint8Array(np);

  if (!SDF_STAGE || SDF_STAGE.size < sp) {
    SDF_STAGE = makeSDFStage(sp);
  }

  paintIntoStage(SDF_STAGE!, data, w, h, pad, subpixel);
  if (subpixel) paintSubpixelOffsets(SDF_STAGE!, data, w, h, pad);

  const {outer, inner, outer2, inner2, xo, yo, xi, yi, f, z, v, b} = SDF_STAGE!;

  const row = 31;
  const start = row * wp + 10;
  const end = row * wp + 25;
  
  if (subpixel) {
    // EDT no longer commutes, so need to do both X->Y and Y->X
    edtSubpixel(outer, xo, yo, 0, 0, wp, hp, wp, f, z, v, b);
    edtSubpixel(inner, xi, yi, pad, pad, w, h, wp, f, z, v, b);

    edtSubpixelAlt(outer2, xo, yo, 0, 0, wp, hp, wp, f, z, v, b);
    edtSubpixelAlt(inner2, xi, yi, pad, pad, w, h, wp, f, z, v, b);
  }
  else {
    edt(outer, 0, 0, wp, hp, wp, f, z, v);
    edt(inner, pad, pad, w, h, wp, f, z, v);
  }

  const sdf: number[] = [];

  if (subpixel) {
    // Take max of both EDTs to resolve subpixel SDF
    for (let i = 0; i < np; i++) {
      outer[i] = Math.max(outer[i], outer2[i]);
      inner[i] = Math.max(inner[i], inner2[i]);
    }
  }

  for (let i = 0; i < np; i++) {
    const d =
       Math.max(0, Math.sqrt(outer[i]) - 0.5) -
       Math.max(0, Math.sqrt(inner[i]) - 0.5);

    sdf[i] = d;
    out[i] = Math.max(0, Math.min(255, Math.round(255 - 255 * (d / radius + cutoff))));
  } 

  return glyphToRGBA(out, wp, hp);
};

// Convert grayscale glyph to SDF
export const sdfToGradient = (
  data: Uint8Array,
  w: number,
  h: number,
  pad: number = 4,
  radius: number = 3,
  cutoff: number = 0.25,
) => {
  const wp = w + pad * 2;
  const hp = h + pad * 2;
  const np = wp * hp;
  const sp = Math.max(wp, hp);

  const out = new Uint8Array(np);
  const getData = (x: number, y: number) => (data[4 * (y * wp + x)] ?? 0) / 255 * radius;

  for (let y = 0; y < hp; y++) {
    for (let x = 0; x < wp; x++) {

      const c = getData(x, y);
      const l = getData(x - 1, y);
      const r = getData(x + 1, y);
      const t = getData(x, y - 1);
      const b = getData(x, y + 1);

      const j = y * wp + x;

      const dx = Math.min(Math.abs(c - l), Math.abs(c - r));
      const dy = Math.min(Math.abs(c - t), Math.abs(c - b));
      const dl = Math.sqrt(dx * dx + dy * dy);
      
      const e = Math.abs(dl - 1);
      
      out[j] = Math.max(0, Math.min(255, 128 + e * 128));
    }
  }

  return glyphToRGBA(out, wp, hp);
};

// Paint glyph data into stage
export const paintIntoStage = (
  stage: SDFStage,
  data: Uint8Array | number[],
  w: number,
  h: number,
  pad: number,
  subpixel?: boolean,
) => {
  const wp = w + pad * 2;
  const hp = h + pad * 2;
  const np = wp * hp;

  const {outer, inner, outer2, inner2, xo, yo, xi, yi} = stage;
  
  outer.fill(INF, 0, np);
  inner.fill(0, 0, np);
  if (subpixel) {
    outer2.fill(INF, 0, np);
    inner2.fill(0, 0, np);
  }

  const flip = subpixel
    ? (i: number) => {
      outer[i] = 0;
      inner[i] = INF
      outer2[i] = 0;
      inner2[i] = INF
    }
    : (i: number) => {
      outer[i] = 0;
      inner[i] = INF
    }

  const getData = (x: number, y: number) => (data[y * w + x] ?? 0) / 255;
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = getData(x, y);
      if (a >= 0.5) {
        const i = (y + pad) * wp + x + pad;
        flip(i);
      }
    }
  }
}

// Paint subpixel offsets for grayscale pixels into stage
export const paintSubpixelOffsets = (
  stage: SDFStage,
  data: Uint8Array | number[],
  w: number,
  h: number,
  pad: number,
) => {
  const wp = w + pad * 2;
  const hp = h + pad * 2;
  const np = wp * hp;

  const {xo, yo, xi, yi} = stage;
  
  xo.fill(0, 0, np);
  yo.fill(0, 0, np);
  xi.fill(0, 0, np);
  yi.fill(0, 0, np);

  const getData = (x: number, y: number) => (data[y * w + x] ?? 0) / 255;
  const getShift = (left: number, center: number, right: number) => {
    const dl = center - left;
    const dr = center - right;
    
    const shift = dr * dl < 0
      ? (dl + dr) / (dr - dl) / 2
      : (dl - dr) / (dr + dl) / 2;
    
    const mag = Math.max(Math.abs(dl), Math.abs(dr));
    return [shift, mag];
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = getData(x, y);
      if (a === 0) continue;

      const j = (y + pad) * wp + x + pad;

      if (a > 0 && a < 254/255) {
        const l = getData(x - 1, y);
        const r = getData(x + 1, y);
        const t = getData(x, y - 1);
        const b = getData(x, y + 1);

        const [dx, mx] = getShift(l, a, r);
        const [dy, my] = getShift(t, a, b);

        const fx = mx > my ? (dx <= 0 ? dx + 0.5 : dx - 0.5) : 0;
        const fy = mx <= my ? (dy <= 0 ? dy + 0.5 : dy - 0.5) : 0;
        
        if (dx <= 0) {
          if (r > l) {
            xo[j]     += fx;
            xi[j - 1] += fx;
          }
          else {
            xi[j]     += fx;
            xo[j - 1] += fx;
          }
        }
        else {
          if (r > l) {
            xi[j]     += fx;
            xo[j + 1] += fx;
          }
          else {
            xo[j]     += fx;
            xi[j + 1] += fx;
          }
        }

        if (dy <= 0) {
          if (b > t) {
            yo[j]      += fy;
            yi[j - wp] += fy;
          }
          else {
            yi[j]      += fy;
            yo[j - wp] += fy;
          }
        }
        else {
          if (b > t) {
            yi[j]      += fy;
            yo[j + wp] += fy;
          }
          else {
            yo[j]      += fy;
            yi[j + wp] += fy;
          }
        }
      }
    }
  }
}

// 2D Euclidean squared distance transform w/ subpixel offsets
export const edtSubpixel = (
  data: Float64Array,
  xs: Float32Array,
  ys: Float32Array,
  x0: number,
  y0: number,
  width: number,
  height: number,
  gridWidth: number,
  f: Float64Array,
  z: Float64Array,
  v: Uint16Array,
  b: Float32Array,
  half?: boolean,
) => {
  for (let y = y0; y < y0 + height; y++) edt1dSubpixel(data, xs, y * gridWidth + x0, 1, width, f, z, v, b);
  if (!half) for (let x = x0; x < x0 + width; x++) edt1dSubpixel(data, ys, y0 * gridWidth + x, gridWidth, height, f, z, v, b);
}

export const edtSubpixelAlt = (
  data: Float64Array,
  xs: Float32Array,
  ys: Float32Array,
  x0: number,
  y0: number,
  width: number,
  height: number,
  gridWidth: number,
  f: Float64Array,
  z: Float64Array,
  v: Uint16Array,
  b: Float32Array,
  half?: boolean,
) => {
  for (let x = x0; x < x0 + width; x++) edt1dSubpixel(data, ys, y0 * gridWidth + x, gridWidth, height, f, z, v, b);
  if (!half) for (let y = y0; y < y0 + height; y++) edt1dSubpixel(data, xs, y * gridWidth + x0, 1, width, f, z, v, b);
}

// 1D squared distance transform w/ subpixel offsets
export const edt1dSubpixel = (
  grid: Float64Array,
  shifts: Float32Array,
  offset: number,
  stride: number,
  length: number,
  f: Float64Array,
  z: Float64Array,
  v: Uint16Array,
  b: Float32Array,
) => {
  v[0] = 0;
  b[0] = shifts[offset];
  z[0] = -INF;
  z[1] = INF;
  f[0] = grid[offset];
  
  for (let q = 1, k = 0, s = 0; q < length; q++) {
    const o = offset + q * stride;
    f[q] = grid[o];

    const qs = q + shifts[o];
    const q2 = qs * qs;
    do {
      const r = v[k];
      const r1 = b[k];
      s = (f[q] - f[r] + q2 - r1 * r1) / (qs - r1) / 2;
    } while (s <= z[k] && --k > -1);
    
    k++;
    v[k] = q;
    b[k] = qs;
    z[k] = s;
    z[k + 1] = INF;
  }
  
  for (let q = 0, k = 0; q < length; q++) {
    const o = offset + q * stride;

    while (z[k + 1] < q) k++;
    const r = v[k];
    const rs = b[k];
    const fr = f[r];
    const qr = q + shifts[o] - rs;

    const g = fr + qr * qr;
    grid[o] = g;
  }
}

// 2D Euclidean squared distance transform by Felzenszwalb & Huttenlocher https://cs.brown.edu/~pff/papers/dt-final.pdf
// Doesn't work for subpixels
export const edt = (
  data: Float64Array,
  x0: number,
  y0: number,
  width: number,
  height: number,
  gridWidth: number,
  f: Float64Array,
  z: Float64Array,
  v: Uint16Array,
) => {
  for (let y = y0; y < y0 + height; y++) edt1d(data, y * gridWidth + x0, 1, width, f, z, v);
  for (let x = x0; x < x0 + width; x++) edt1d(data, y0 * gridWidth + x, gridWidth, height, f, z, v);
}

// 1D squared distance transform
// Doesn't work for subpixels
export const edt1d = (
  grid: Float64Array,
  offset: number,
  stride: number,
  length: number,
  f: Float64Array,
  z: Float64Array,
  v: Uint16Array,
) => {
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  f[0] = grid[offset];

  for (let q = 1, k = 0, s = 0; q < length; q++) {
    f[q] = grid[offset + q * stride];

    const q2 = q * q;
    do {
      const r = v[k];
      s = (f[q] - f[r] + q2 - r * r) / (q - r) / 2;
    } while (s <= z[k] && --k > -1);

    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }

  for (let q = 0, k = 0; q < length; q++) {
    while (z[k + 1] < q) k++;
    const r = v[k];
    const qr = q - r;
    const fr = f[r];
    grid[offset + q * stride] = fr + qr * qr;
  }
}