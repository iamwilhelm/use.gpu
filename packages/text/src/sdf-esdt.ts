import { glyphToSDF as glyphToSDFv1 } from './sdf'; 
import { glyphToRGBA, INF, Rectangle, SDFStage, getSDFStage, isBlack, isWhite, isSolid, sqr } from './sdf';

// Convert grayscale glyph to SDF using subpixel distance transform
export const glyphToESDT = (
  data: Uint8Array,
  w: number,
  h: number,
  pad: number = 4,
  radius: number = 3,
  cutoff: number = 0.25,
  debug?: (image: Image) => void,
): Image => {
  const wp = w + pad * 2;
  const hp = h + pad * 2;
  const np = wp * hp;
  const sp = Math.max(wp, hp);

  const out = new Uint8Array(np);
  const getData = (x: number, y: number) => (data[y * w + x] ?? 0) / 255;

  const stage = getSDFStage(sp);
  const {outer, inner, xo, yo, xi, yi, f, z, b, t, v} = stage;

  paintIntoStage(stage, data, w, h, pad);
  paintSubpixelOffsets(stage, data, w, h, pad);
  
  if (debug) {
    const sdfToDebugView = makeSDFToDebugView(wp, hp, np, radius, cutoff);
    debug(sdfToDebugView(xo, yo, null, null, outer, inner));

    console.log('----------')
    esdt(outer, xo, yo, wp, hp, f, z, b, t, v, 1, 2);
    debug(sdfToDebugView(xo, yo, null, null, outer, null));

    console.log('----------')
    esdt(outer, xo, yo, wp, hp, f, z, b, t, v, 1, 1);
    debug(sdfToDebugView(xo, yo, null, null, outer, null));

    esdt(inner, xi, yi, wp, hp, f, z, b, t, v, -1, 1);
    debug(sdfToDebugView(null, null, xi, yi, null, inner));
    esdt(inner, xi, yi, wp, hp, f, z, b, t, v, -1, 2);
    debug(sdfToDebugView(null, null, xi, yi, null, inner));
  }
  else {
    esdt(outer, xo, yo, wp, hp, f, z, b, t, v,  1);
    esdt(inner, xi, yi, wp, hp, f, z, b, t, v, -1);
  }

  resolveSDF(xo, yo, xi, yi, (d: number, i: number) => {
    out[i] = Math.max(0, Math.min(255, Math.round(255 - 255 * (d / radius + cutoff))));
  });

  return glyphToRGBA(out, wp, hp);
};

// Resolve outer and inner X/Y offsets into signed distance
export const resolveSDF = (
  xo: Float32Array,
  yo: Float32Array,
  xi: Float32Array,
  yi: Float32Array,
  f: (i: number, d: number) => void,
) => {
  const np = xo.length;
  for (let i = 0; i < np; ++i) {
    const outer = Math.sqrt(sqr(xo[i]) + sqr(yo[i])) - 0.5;
    const inner = Math.sqrt(sqr(xi[i]) + sqr(yi[i])) - 0.5;
    f(outer >= inner ? outer : - inner, i);
  }
}

// Paint glyph data into stage
export const paintIntoStage = (
  stage: SDFStage,
  data: Uint8Array | number[],
  w: number,
  h: number,
  pad: number,
) => {
  const wp = w + pad * 2;
  const hp = h + pad * 2;
  const np = wp * hp;

  const {outer, inner} = stage;
  
  outer.fill(INF, 0, np);
  inner.fill(0, 0, np);

  const getData = (x: number, y: number) => (data[y * w + x] ?? 0) / 255;
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = getData(x, y);
      if (!a) continue;

      const i = (y + pad) * wp + x + pad;
      if (a >= 254/255) {
        // Fix for bad rasterizer rounding
        data[y * w + x] = 255;

        outer[i] = 0;
        inner[i] = INF;
      }
      else {
        outer[i] = 0;
        inner[i] = 0;
      }
    }
  }
}

export const paintSubpixelOffsets = (
  stage: SDFStage,
  data: Uint8Array | number[],
  w: number,
  h: number,
  pad: number,
  half?: number | boolean,
) => {
  const wp = w + pad * 2;
  const hp = h + pad * 2;
  const np = wp * hp;

  const {outer, inner, xo, yo, xi, yi} = stage;
  
  xo.fill(0, 0, np);
  yo.fill(0, 0, np);
  xi.fill(0, 0, np);
  yi.fill(0, 0, np);

  const getData = (x: number, y: number) => 
    (x >= 0 && x < w && y >= 0 && y < h) ? (data[y * w + x] ?? 0) / 255 : 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = getData(x, y);
      const j = (y + pad) * wp + x + pad;

      if (!isSolid(c)) {
        const dc = (c - 0.5);

        const l = getData(x - 1, y);
        const r = getData(x + 1, y);
        const t = getData(x, y - 1);
        const b = getData(x, y + 1);

        const tl = getData(x - 1, y - 1);
        const tr = getData(x + 1, y - 1);
        const bl = getData(x - 1, y + 1);
        const br = getData(x + 1, y + 1);

        const ll = (tl + l*2 + bl) / 4;
        const rr = (tr + r*2 + br) / 4;
        const tt = (tl + t*2 + tr) / 4;
        const bb = (bl + b*2 + br) / 4;
        
        let dx = rr - ll;
        let dy = bb - tt;
        let dl = 1 / Math.sqrt(sqr(dx) + sqr(dy))
        dx *= dl;
        dy *= dl;

        xo[j] = -dc * dx;
        yo[j] = -dc * dy;
      }
      else if (isWhite(c)) {
        const l = getData(x - 1, y);
        const r = getData(x + 1, y);
        const t = getData(x, y - 1);
        const b = getData(x, y + 1);
        
        if (isBlack(l)) {
          xo[j - 1] = 0.5;
          outer[j - 1] = 0;
          inner[j - 1] = 0;
        }
        if (isBlack(r)) {
          xo[j + 1] = -0.5;
          outer[j + 1] = 0;
          inner[j + 1] = 0;
        }

        if (isBlack(t)) {
          yo[j - wp] = 0.5;
          outer[j - wp] = 0;
          inner[j - wp] = 0;
        }
        if (isBlack(b)) {
          yo[j + wp] = -0.5;
          outer[j + wp] = 0;
          inner[j + wp] = 0;
        }
      }
    }
  }

  if (half) return;
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const j = (y + pad) * wp + x + pad;

      const nx = xo[j];
      const ny = yo[j];
      if (!nx && !ny) continue;

      const c = getData(x, y);
      const l = getData(x - 1, y);
      const r = getData(x + 1, y);
      const t = getData(x, y - 1);
      const b = getData(x, y + 1);

      const dxl = xo[j - 1];
      const dxr = xo[j + 1];
      const dxt = xo[j - wp];
      const dxb = xo[j + wp];

      const dyl = yo[j - 1];
      const dyr = yo[j + 1];
      const dyt = yo[j - wp];
      const dyb = yo[j + wp];

      let dx = nx;
      let dy = ny;
      let dw = 1;

      if (!isSolid(l) && !isSolid(r)) {
        dx += (dxl + dxr) / 2;
        dy += (dyl + dyr) / 2;
        dw++;
      }

      if (!isSolid(t) && !isSolid(b)) {
        dx += (dxt + dxb) / 2;
        dy += (dyt + dyb) / 2;
        dw++;
      }

      if (!isSolid(l) && !isSolid(t)) {
        dx += (dxl + dxt - 1) / 2;
        dy += (dyl + dyt - 1) / 2;
        dw++;
      }

      if (!isSolid(r) && !isSolid(t)) {
        dx += (dxr + dxt + 1) / 2;
        dy += (dyr + dyt - 1) / 2;
        dw++;
      }

      if (!isSolid(l) && !isSolid(b)) {
        dx += (dxl + dxb - 1) / 2;
        dy += (dyl + dyb + 1) / 2;
        dw++;
      }

      if (!isSolid(r) && !isSolid(b)) {
        dx += (dxr + dxb + 1) / 2;
        dy += (dyr + dyb + 1) / 2;
        dw++;
      }
      
      const nn = Math.sqrt(nx*nx + ny*ny);
      const dt = (dx * nx + dy * ny) / nn;

      dx = nx * dt / dw / nn;
      dy = ny * dt / dw / nn;
      
      xi[j] = dx;
      yi[j] = dy;
    }
  }
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const j = (y + pad) * wp + x + pad;

      const nx = xi[j];
      const ny = yi[j];
      if (!nx && !ny) continue;

      const nn = Math.sqrt(sqr(nx) + sqr(ny));

      const c = getData(x, y);
      const d = getData(x + Math.sign(nx), y + Math.sign(ny));
      const s = d > c ? 1 : -1;

      const dlo = (nn + .5 * s) / nn;
      const dli = (nn - .5 * s) / nn;

      xo[j] = nx * dlo;
      yo[j] = ny * dlo;
      xi[j] = nx * dli;
      yi[j] = ny * dli;
    }
  }
};

const makeSDFToDebugView = (
  wp: number,
  hp: number,
  np: number,
  radius: number,
  cutoff: number,
) => (
  xo: Float32Array | null,
  yo: Float32Array | null,
  xi: Float32Array | null,
  yi: Float32Array | null,
  outer: any | null,
  inner: any | null,
): Image => {
  
  const out: number[] = [];
  for (let i = 0; i < np; i++) {
    const d = Math.sqrt(sqr(xo ? xo[i] ?? 0 : 0) + sqr(yo ? yo[i] ?? 0 : 0)) - Math.sqrt(sqr(xi ? xi[i] ?? 0 : 0) + sqr(yi ? yi[i] ?? 0: 0));
    out[i] = Math.max(0, Math.min(255, Math.round(255 - 255 * (d / radius + cutoff))));
  }

  const rgba = glyphToRGBA(new Uint8Array(out), wp, hp);
  rgba.xo = xo && xo.slice();
  rgba.yo = yo && yo.slice();
  rgba.xi = xi && xi.slice();
  rgba.yi = yi && yi.slice();
  
  if (outer) for (let i = 0; i < np; ++i) {
    if (outer[i]) {
      rgba.data[i * 4 + 0] *= 0.05;
      rgba.data[i * 4 + 1] *= 0.85;
    }
  }
  if (inner) for (let i = 0; i < np; ++i) {
    if (inner[i]) {
      rgba.data[i * 4 + 0] *= 0.65;
      rgba.data[i * 4 + 2] *= 0.45;
    }
  }
  
  return rgba;
}

// 2D subpixel distance transform by unconed
// extended from Felzenszwalb & Huttenlocher https://cs.brown.edu/~pff/papers/dt-final.pdf
export const esdt = (
  mask: Float32Array,
  xs: Float32Array,
  ys: Float32Array,
  w: number,
  h: number,
  f: Float32Array,
  z: Float32Array,
  b: Float32Array,
  t: Float32Array,
  v: Uint16Array,
  sign: number = 1,
  half: number = 0,
) => {
  if (half !== 2) for (let y = 0; y < h; ++y) esdt1d(mask, xs, ys, y * w, 1, w, f, z, b, t, v, sign);
  if (half !== 1) for (let x = 0; x < w; ++x) esdt1d(mask, ys, xs, x, w, h, f, z, b, t, v, sign);
}

// 1D subpixel distance transform
export const esdt1d = (
  mask: Float32Array,
  xs: Float32Array,
  ys: Float32Array,
  offset: number,
  stride: number,
  length: number,
  f: Float32Array,
  z: Float32Array,
  b: Float32Array,
  t: Float32Array,
  v: Uint16Array,
  sign: number,
) => {
  v[0] = 0;
  b[0] = xs[offset];
  z[0] = -INF;
  z[1] = INF;
  f[0] = mask[offset] ? INF : ys[offset] * ys[offset];

  let k = 0;
  for (let q = 1, s = 0; q < length; q++) {
    const o = offset + q * stride;

    const dx = xs[o];
    const dy = ys[o];    
    const fq = f[q] = mask[o] ? INF : dy * dy;

    const qs = q + xs[o];
    const q2 = qs * qs;
    b[q] = qs;
    t[q] = dy;

    do {
      const r = v[k];
      const rs = b[r];

      const r2 = rs * rs;
      s = (fq - f[r] + q2 - r2) / (qs - rs) / 2;
    } while (s <= z[k] && --k > -1);

    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }

  for (let q = 0, k = 0; q < length; q++) {
    const k1 = k;
    while (z[k + 1] < q) k++;

    const r = v[k];
    const rs = b[r];
    const qs = b[q];
    const dy = t[r];

    let rq = rs - q;
    let dq = q - qs;

    const o = offset + q * stride;
    xs[o] = rq;
    ys[o] = dy;

    if (r !== q) mask[o] = 0;
  }
}
