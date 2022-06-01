import { glyphToSDF as glyphToSDFv1 } from './sdf'; 
import { glyphToRGBA, INF, Rectangle, SDFStage, getSDFStage, isBlack, isWhite, isSolid, sqr } from './sdf';
import { Image } from './types';

// Convert grayscale glyph to SDF using subpixel distance transform
export const glyphToESDT = (
  data: Uint8Array,
  w: number,
  h: number,
  pad: number = 4,
  radius: number = 3,
  cutoff: number = 0.25,
  relax: boolean = true,
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
    debug(sdfToDebugView(xo, yo, xi, yi, outer, inner));

    esdt(outer, xo, yo, wp, hp, f, z, b, t, v, 1, 1);
    debug(sdfToDebugView(xo, yo, null, null, outer, null));
    esdt(outer, xo, yo, wp, hp, f, z, b, t, v, 1, 2);
    debug(sdfToDebugView(xo, yo, null, null, outer, null));

    esdt(inner, xi, yi, wp, hp, f, z, b, t, v, -1, 1);
    debug(sdfToDebugView(null, null, xi, yi, null, inner));
    esdt(inner, xi, yi, wp, hp, f, z, b, t, v, -1, 2);
    debug(sdfToDebugView(null, null, xi, yi, null, inner));

    if (relax) relaxSubpixelOffsets(stage, data, w, h, pad);
    debug(sdfToDebugView(xo, yo, xi, yi, outer, inner));
  }
  else {
    esdt(outer, xo, yo, wp, hp, f, z, b, t, v,  1);
    esdt(inner, xi, yi, wp, hp, f, z, b, t, v, -1);
    if (relax) relaxSubpixelOffsets(stage, data, w, h, pad);
  }


  resolveSDF(xo, yo, xi, yi, (d: number, i: number) => {
    out[i] = Math.max(0, Math.min(255, Math.round(255 - 255 * (d / radius + cutoff))));
  });
  
  //paintIntoDistanceField(out, data, w, h, pad, radius, cutoff);

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
    const outer = Math.max(0, Math.sqrt(sqr(xo[i]) + sqr(yo[i])) - 0.5);
    const inner = Math.max(0, Math.sqrt(sqr(xi[i]) + sqr(yi[i])) - 0.5);
    f(outer >= inner ? outer : -inner, i);
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

// Paint glyph data into sdf
export const paintIntoDistanceField = (
  image: Uint8Array,
  data: Uint8Array | number[],
  w: number,
  h: number,
  pad: number,
  radius: number,
  cutoff: number,
) => {
  const wp = w + pad * 2;
  const hp = h + pad * 2;
  const np = wp * hp;

  const getData = (x: number, y: number) => (data[y * w + x] ?? 0) / 255;
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = getData(x, y);
      if (!isSolid(a)) {
        const j = x + pad + (y + pad) * wp;
        const d = 0.5 - a;
        image[j] = Math.max(0, Math.min(255, Math.round(255 - 255 * (d / radius + cutoff))));
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

  // Make vector from pixel center to nearest boundary
  let k = 0;
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
        
        const min = Math.min(l, r, t, b, tl, tr, bl, br);
        const max = Math.max(l, r, t, b, tl, tr, bl, br);

        if (min > 0) {
          // Interior creases
          inner[j] = INF;
          continue;
        }
        if (max < 1) {
          // Exterior creases
          outer[j] = INF;
          continue;
        }

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
  
  const checkCross = (
    nx: number,
    ny: number,
    dc: number,
    dl: number,
    dr: number,
    dxl: number,
    dyl: number,
    dxr: number,
    dyr: number,
  ) => {
    return (
      ((dxl * nx + dyl * ny) * (dc * dl) > 0) &&
      ((dxr * nx + dyr * ny) * (dc * dr) > 0) &&
      ((dxl * dxr + dyl * dyr) * (dl * dr) > 0)
    );
  }

  // Blend neighboring offsets but preserve normal direction
  // Uses xo as input, xi as output
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

      const dc = c - 0.5;
      const dl = l - 0.5;
      const dr = r - 0.5;
      const dt = t - 0.5;
      const db = b - 0.5;

      if (!isSolid(l) && !isSolid(r)) {
        if (checkCross(nx, ny, dc, dl, dr, dxl, dyl, dxr, dyr)) {
          dx += (dxl + dxr) / 2;
          dy += (dyl + dyr) / 2;
          dw++;
        }
      }

      if (!isSolid(t) && !isSolid(b)) {
        if (checkCross(nx, ny, dc, dt, db, dxt, dyt, dxb, dyb)) {
          dx += (dxt + dxb) / 2;
          dy += (dyt + dyb) / 2;
          dw++;
        }
      }

      if (!isSolid(l) && !isSolid(t)) {
        if (checkCross(nx, ny, dc, dl, dt, dxl, dyl, dxt, dyt)) {
          dx += (dxl + dxt - 1) / 2;
          dy += (dyl + dyt - 1) / 2;
          dw++;
        }
      }

      if (!isSolid(r) && !isSolid(t)) {
        if (checkCross(nx, ny, dc, dr, dt, dxr, dyr, dxt, dyt)) {
          dx += (dxr + dxt + 1) / 2;
          dy += (dyr + dyt - 1) / 2;
          dw++;
        }
      }

      if (!isSolid(l) && !isSolid(b)) {
        if (checkCross(nx, ny, dc, dl, db, dxl, dyl, dxb, dyb)) {
          dx += (dxl + dxb - 1) / 2;
          dy += (dyl + dyb + 1) / 2;
          dw++;
        }
      }

      if (!isSolid(r) && !isSolid(b)) {
        if (checkCross(nx, ny, dc, dr, db, dxr, dyr, dxb, dyb)) {
          dx += (dxr + dxb + 1) / 2;
          dy += (dyr + dyb + 1) / 2;
          dw++;
        }
      }
    
      const nn = Math.sqrt(nx*nx + ny*ny);
      const ll = (dx * nx + dy * ny) / nn;

      dx = nx * ll / dw / nn;
      dy = ny * ll / dw / nn;
    
      xi[j] = dx;
      yi[j] = dy;
    }
  }
  
  if (half) return;
  
  // Produce zero points for positive and negative DF, at +0.5 / -0.5.
  // Splits xi into xo/xi
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const j = (y + pad) * wp + x + pad;

      const nx = xi[j];
      const ny = yi[j];
      if (!nx && !ny) continue;

      const nn = Math.sqrt(sqr(nx) + sqr(ny));

      const sx = (Math.abs(nx / nn) - 0.5) > 0 ? Math.sign(nx) : 0;
      const sy = (Math.abs(ny / nn) - 0.5) > 0 ? Math.sign(ny) : 0;

      const c = getData(x, y);
      const d = getData(x + sx, y + sy);
      const s = Math.sign(d - c);

      let dlo = (nn + .4999 * s);
      let dli = (nn - .4999 * s);

      if (dlo > 1) { dlo = 1; dli = 0; }
      if (dli > 1) { dli = 1; dlo = 0; }
      
      dli /= nn;
      dlo /= nn;

      xo[j] = nx * dlo;
      yo[j] = ny * dlo;
      xi[j] = nx * dli;
      yi[j] = ny * dli;
    }
  }
};

// Snap distance targets to neighboring target points, if closer
export const relaxSubpixelOffsets = (
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
  
  const relax = (xs: Float32Array, ys: Float32Array) => {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const j = (y + pad) * wp + x + pad;

        const dx = xs[j];
        const dy = ys[j];
        if (!dx && !dy) continue;

        // Step towards target minus 0.5px to find countour
        let d = Math.sqrt(dx*dx + dy*dy);
        const ds = (d - 0.5) / d;
        const tx = x + dx * ds;
        const ty = y + dy * ds;

        // Check area around array index
        const ix = Math.round(tx);
        const iy = Math.round(ty);
        d = check(xs, ys, ix + 1, iy, ix - x + 1, iy - y, tx, ty, d, j);
        d = check(xs, ys, ix - 1, iy, ix - x - 1, iy - y, tx, ty, d, j);
        d = check(xs, ys, ix, iy + 1, ix - x, iy - y + 1, tx, ty, d, j);
        d = check(xs, ys, ix, iy - 1, ix - x, iy - y - 1, tx, ty, d, j);
      }
    }
  };

  // Check if target's neighbor is closer
  const check = (xs: Float32Array, ys: Float32Array, x: number, y: number, dx: number, dy: number, tx: number, ty: number, d: number, j: number) => {
    const k = (y + pad) * wp + x + pad;

    const dx2 = dx + xs[k];
    const dy2 = dy + ys[k];
    const d2 = Math.sqrt(sqr(dx2) + sqr(dy2));

    if (d2 < d) {
      xs[j] = dx2;
      ys[j] = dy2;
      return d2;
    }    
    return d;
  };

  relax(xo, yo);
  relax(xi, yi);
}

// Debug coloration
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
    const d =
      Math.max(0, Math.sqrt(sqr(xo ? xo[i] : 0) + sqr(yo ? yo[i] : 0)) - 0.5)
      -Math.max(0, Math.sqrt(sqr(xi ? xi[i] : 0) + sqr(yi ? yi[i] : 0)) - 0.5);
    out[i] = Math.max(0, Math.min(255, Math.round(255 - 255 * (d / radius + cutoff))));
  }

  const rgba = glyphToRGBA(new Uint8Array(out), wp, hp);
  rgba.xo = xo && xo.slice();
  rgba.yo = yo && yo.slice();
  rgba.xi = xi && xi.slice();
  rgba.yi = yi && yi.slice();
  
  if (outer) for (let i = 0; i < np; ++i) {
    if (outer[i]) {
      rgba.data[i * 4 + 0] *= 0.35;
      rgba.data[i * 4 + 1] *= 0.95;
      rgba.data[i * 4 + 2] *= 0.9;
    }
  }
  if (inner) for (let i = 0; i < np; ++i) {
    if (inner[i]) {
      rgba.data[i * 4 + 0] *= 0.25;
      rgba.data[i * 4 + 1] *= 0.65;
      rgba.data[i * 4 + 2] *= 0.90;
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
  if (half !== 1) for (let x = 0; x < w; ++x) esdt1d(mask, ys, xs, x, w, h, f, z, b, t, v, sign);
  if (half !== 2) for (let y = 0; y < h; ++y) esdt1d(mask, xs, ys, y * w, 1, w, f, z, b, t, v, sign);
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
