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

let TRACE = false;
// Convert grayscale glyph to SDF
export const glyphToSDF = (
  data: Uint8Array,
  w: number,
  h: number,
  pad: number = 4,
  radius: number = 3,
  subpixel: boolean = false,
  cutoff: number = 0.25,
  half: number = 0,
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

  if (subpixel) {
    // EDT no longer commutes, so need to do both X->Y and Y->X
    edtSubpixel(inner, xi, yi, pad - 1, pad - 1, w + 1, h + 1, wp, f, z, v, b, !!half);
    edtSubpixel(outer, xo, yo, 0, 0, wp, hp, wp, f, z, v, b, !!half);

    edtSubpixelAlt(inner2, xi, yi, pad - 1, pad - 1, w + 1, h + 1, wp, f, z, v, b, !!half);
    edtSubpixelAlt(outer2, xo, yo, 0, 0, wp, hp, wp, f, z, v, b, !!half);
  }
  else {
    edt(outer, 0, 0, wp, hp, wp, f, z, v, !!half);
    edt(inner, pad, pad, w, h, wp, f, z, v, !!half);
  }

  if (subpixel || half) {
    // Take max of both EDTs to resolve subpixel SDF
    if (!half) {
      for (let i = 0; i < np; i++) {
        outer[i] = Math.max(outer[i], outer2[i]);
        inner[i] = Math.max(inner[i], inner2[i]);
      }
    }
    // Debug viewing
    else if (half == 2) {
      for (let i = 0; i < np; i++) {
        outer[i] = outer2[i];
        inner[i] = inner2[i];
      }
    }
  }

  const resolve = subpixel
    ? (i: number) => 
      outer[i] > inner[i]
      ? Math.max(0, Math.sqrt(outer[i]) - 0.5)
      : -Math.max(0, Math.sqrt(inner[i]) - 0.5)
    : (i: number) => Math.sqrt(outer[i]) - Math.sqrt(inner[i])

  for (let i = 0; i < np; i++) {
    const d = resolve(i);
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
  outer2.fill(INF, 0, np);
  inner2.fill(0, 0, np);

  const flip = subpixel
    ? (i: number) => {
    }
    : (i: number) => {
      outer[i] = 0;
      inner[i] = INF
    }

  const getData = (x: number, y: number) => (data[y * w + x] ?? 0) / 255;
  
  if (subpixel) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const a = getData(x, y);
        if (a >= 0.5) {
          const i = (y + pad) * wp + x + pad;
          outer[i] = 0;
          inner[i] = INF
          outer2[i] = 0;
          inner2[i] = INF
        }
      }
    }
  }
  else {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const a = getData(x, y);
        const i = (y + pad) * wp + x + pad;

        if (a >= 254/255) {
          outer[i] = 0;
          inner[i] = INF
        }
        else if (a > 0) {
          const d = 0.5 - a;
          outer[i] = d > 0 ? d*d : 0;
          inner[i] = d < 0 ? d*d : 0;
        }
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

  const {outer, inner, outer2, inner2, xo, yo, xi, yi} = stage;
  
  xo.fill(0, 0, np);
  yo.fill(0, 0, np);
  xi.fill(0, 0, np);
  yi.fill(0, 0, np);
  
  const mix = (a: number, b: number) => a ? (a + b) / 2 : b;

  const getData = (x: number, y: number) => 
    (x >= 0 && x < w && y >= 0 && y < h) ? (data[y * w + x] ?? 0) / 255 : 0;

  const getShift = (left: number, center: number, right: number) => {
    const dl = center - left;
    const dr = center - right;

    // Shift if on an edge, not a crease/ridge 
    const edge = dr * dl < 0 ? 1 : 0;
    const shift = (dl + dr) * (dr - dl > 0 ? 1 : -1) / 2;

    // Get step magnitude of sides to compare X vs Y
    const mag = (Math.abs(dl) + Math.abs(dr)) / 2;

    // Get value range in triplet to reduce shift on corners
    const min = Math.min(left, center, right);
    const max = Math.max(left, center, right);
    const range = (max - min) * (max - min);

    return [shift, mag, range, edge];
  }
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = getData(x, y);
      if (a === 0) continue;

      let j = (y + pad) * wp + x + pad;

      if (a > 0 && a < 254/255) {
        const l = getData(x - 1, y);
        const r = getData(x + 1, y);
        const t = getData(x, y - 1);
        const b = getData(x, y + 1);

        let [dx, mx, sx, ex] = getShift(l, a, r);
        let [dy, my, sy, ey] = getShift(t, a, b);
        
        if (dx === 0) dx = r > l ? 0.0001 : -0.0001;
        if (dy === 0) dy = b > t ? 0.0001 : -0.0001;

        let fx = sx * (ex ? ((dx < 0) ? dx + 0.5 : dx - 0.5) : 0);
        let fy = sy * (ey ? ((dy < 0) ? dy + 0.5 : dy - 0.5) : 0);
        
        const doX = fx && mx >= mx;
        const doY = fy && my > mx;
        
        if ((fx === 0 && fy === 0)) {
          const d = 0.5 - a;
          outer2[j] = outer[j] = d > 0 ? d*d + 0.25 : 0;
          outer2[j] = inner[j] = d < 0 ? d*d + 0.25 : 0;
        }
        
        else {
          if (doX) {
            if (dx < 0) {
              if (r > l) {
                xo[j]     = mix(xo[j], fx);
                xi[j - 1] = mix(xi[j - 1], fx);
              }
              else if (r < l) {
                xi[j]     = mix(xi[j], fx);
                xo[j - 1] = mix(xi[j - 1], fx);
              }
            }
            else {
              if (r > l) {
                xi[j]     = mix(xi[j], fx);
                xo[j + 1] = mix(xo[j + 1], fx);
              }
              else if (r < l) {
                xo[j]     = mix(xo[j]    , fx);
                xi[j + 1] = mix(xi[j + 1], fx);
              }
            }
          }

           if (doY) {
            if (dy < 0) {
              if (b > t) {
                yo[j]      = mix(yo[j]     , fy);
                yi[j - wp] = mix(yi[j - wp], fy);
              }
              else if (b < t) {
                yi[j]      = mix(yi[j]     , fy);
                yo[j - wp] = mix(yo[j - wp], fy);
              }
            }
            else {
              if (b > t) {
                yi[j]      = mix(yi[j]     , fy);
                yo[j + wp] = mix(yo[j + wp], fy);
              }
              else if (b < t) {
                yo[j]      = mix(yo[j]     , fy);
                yi[j + wp] = mix(yi[j + wp], fy);
              }
            }
          }
        }

      }
    }
  }
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let j = (y + pad) * wp + x + pad;
      if (xi[j] && xo[j]) {
        const v = (xi[j] + xo[j]) / 2;
        xi[j] = xo[j] = v;
      }
      if (yi[j] && yo[j]) {
        const v = (yi[j] + yo[j]) / 2;
        yi[j] = yo[j] = v;
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
  if (!half) for (let x = x0; x < x0 + width; x++) edt1dSubpixel(data, ys, y0 * gridWidth + x, gridWidth, height, f, z, v, b, true);
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
  if (!half) for (let y = y0; y < y0 + height; y++) edt1dSubpixel(data, xs, y * gridWidth + x0, 1, width, f, z, v, b, true);
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
  conservative: boolean = false,
) => {
  v[0] = 0;
  b[0] = shifts[offset];
  z[0] = -INF;
  z[1] = INF;
  f[0] = grid[offset];
  
  for (let q = 1, k = 0, s = 0; q < length; q++) {
    const o = offset + q * stride;
    f[q] = grid[o];
    
    if (conservative) {
      if (shifts[o] && f[q] > 0) f[q] = grid[o] = 0;
      if (shifts[o] && f[q] > 0) f[q] = grid[o] = 0;
    }
    
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
    const s = shifts[o];

    const lk = k;
    while (z[k + 1] < q) k++;

    const r = v[k];
    const rs = b[k];
    const fr = f[r];

    let qr = q + s - rs;
    /*
    if (q === r) {
      if ((s > 0) && (z[k + 1] >= q + 1)) {
        qr = 0;
      }
      if ((s < 0) && (lk === k)) {
        qr = 0;
      }
    }
    */

    let g = fr + qr * qr;
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
  half?: boolean,
) => {
  for (let y = y0; y < y0 + height; y++) edt1d(data, y * gridWidth + x0, 1, width, f, z, v);
  if (!half) for (let x = x0; x < x0 + width; x++) edt1d(data, y0 * gridWidth + x, gridWidth, height, f, z, v);
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