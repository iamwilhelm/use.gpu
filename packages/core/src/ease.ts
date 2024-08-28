import { clamp, lerp } from './tuple';

const sqr = (x: number) => x * x;
const cub = (x: number) => x * x * x;

// Cubic bezier 1D
export const cubicBezier = (t: number, a: number, b: number, c: number, d: number) =>
  a * cub(1 - t) + 3 * b * sqr(1 - t) * t + 3 * c * (1 - t) * sqr(t) + d * cub(t);

// Cubic bezier 1D derivative
export const cubicBezierDt = (t: number, a: number, b: number, c: number, d: number) =>
  a * (- 3*sqr(1 - t)) +
  b * ((9*t - 12)*t + 3) +
  c * (6 - 9*t) * t +
  d * 3*sqr(t);

// Invert monotonous cubic bezier
export const cubicBezierInverse = (v: number, a: number, b: number, c: number, d: number) => {
  const min = Math.min(a, b, c, d);
  const max = Math.max(a, b, c, d);

  const n = 4;
  let t = (v - min) / (max - min);
  t -= t * (.5 - t) * (t - 1);

  for (let i = 0; i < n; ++i) {
    t = t - (cubicBezier(t, a, b, c, d) - v) / cubicBezierDt(t, a, b, c, d);
  }
  return t;
};

// Cubic bezier ease, X = time / Y = value
// Only control points (x1,y1) and (x2,y2) are adjustable ([0..1], any)
export const bezierEase = (t: number, x1: number, y1: number, x2: number, y2: number) => {
  const s = cubicBezierInverse(t, 0, x1, x2, 1);
  const value = cubicBezier(s, 0, y1, y2, 1);
  return value;
};

// Velocity helper for cubic bezier ease.
// Ease across arcLength over duration, entering at speed v1 and exiting at speed v2.
export const velocityEase = (fraction: number, duration: number, arcLength: number, v1: number, v2: number) => {
  const slope1 = arcLength ? v1 * duration / arcLength : 0;
  const slope2 = arcLength ? v2 * duration / arcLength : 0;

  const x1 = 1 / Math.max(3, slope1);
  const x2 = 1 / Math.max(3, slope2);
  const y1 = x1 * slope1;
  const y2 = x2 * slope2;

  return bezierEase(fraction, x1, y1, 1 - x2, 1 - y2);
};

// Catmull-rom spline with movable knots
export const catmullRom = (
  t: number,
  t0: number,
  t1: number,
  t2: number,
  t3: number,
  a: number,
  b: number,
  c: number,
  d: number,
) => {
  const d0t = t0 - t;

  const d10 = t1 - t0;
  const d1t = t1 - t;
  const d20 = t2 - t0;
  const d21 = t2 - t1;
  const d2t = t2 - t;
  const d31 = t3 - t1;
  const d32 = t3 - t2;
  const d3t = t3 - t;

  const a1 = (d10 !== 0) ? a * (d1t / d10) + b * (-d0t / d10) : (a + b) / 2;
  const a2 = (d21 !== 0) ? b * (d2t / d21) + c * (-d1t / d21) : (b + c) / 2;
  const a3 = (d32 !== 0) ? c * (d3t / d32) + d * (-d2t / d32) : (c + d) / 2;

  const b1 = (d20 !== 0) ? a1 * (d2t / d20) + a2 * (-d0t / d20) : (a1 + a2) / 2;
  const b2 = (d31 !== 0) ? a2 * (d3t / d31) + a3 * (-d1t / d31) : (a2 + a3) / 2;

  const v  = (d21 !== 0) ? b1 * (d2t / d21) + b2 * (-d1t / d21) : (b1 + b2) / 2;

  return v;
};

// Catmull-rom spline value+derivative with movable knots
export const catmullRomDual = (
  t: number,
  t0: number,
  t1: number,
  t2: number,
  t3: number,
  a: number,
  b: number,
  c: number,
  d: number,
): [number, number] => {
  const d0t = t0 - t;

  const d10 = t1 - t0;
  const d1t = t1 - t;
  const d20 = t2 - t0;
  const d21 = t2 - t1;
  const d2t = t2 - t;
  const d31 = t3 - t1;
  const d32 = t3 - t2;
  const d3t = t3 - t;

  const a1 = (d10 !== 0) ? a * (d1t / d10) + b * (-d0t / d10) : (a + b) / 2;
  const a2 = (d21 !== 0) ? b * (d2t / d21) + c * (-d1t / d21) : (b + c) / 2;
  const a3 = (d32 !== 0) ? c * (d3t / d32) + d * (-d2t / d32) : (c + d) / 2;

  const b1 = (d20 !== 0) ? a1 * (d2t / d20) + a2 * (-d0t / d20) : (a1 + a2) / 2;
  const b2 = (d31 !== 0) ? a2 * (d3t / d31) + a3 * (-d1t / d31) : (a2 + a3) / 2;

  const v  = (d21 !== 0) ? b1 * (d2t / d21) + b2 * (-d1t / d21) : (b1 + b2) / 2;

  const da1dt = (d10 !== 0) ? a * (-1 / d10) + b * (1 / d10) : 0;
  const da2dt = (d21 !== 0) ? b * (-1 / d21) + c * (1 / d21) : 0;
  const da3dt = (d32 !== 0) ? c * (-1 / d32) + d * (1 / d32) : 0;

  const db1dt = (d20 !== 0) ? a1 * (-1 / d20) + da1dt * (d2t / d20) + a2 * (1 / d20) + da2dt * (-d0t / d20) : 0;
  const db2dt = (d31 !== 0) ? a2 * (-1 / d31) + da2dt * (d3t / d31) + a3 * (1 / d31) + da3dt * (-d1t / d31) : 0;

  const dvdt = (d21 !== 0) ? b1 * (-1 / d21) + db1dt * (d2t / d21) + b2 * (1 / d21) + db2dt * (-d1t / d21) : 0;

  return [v, dvdt];
};

// Weighted catmull rom (chordal = 1, centripetal = 2)
export const catmullRomWeighted = (
  fraction: number,
  a: number,
  b: number,
  c: number,
  d: number,
  ab: number,
  bc: number,
  cd: number,
  power: number = 2,
) => {
  const inv = 1 / power;
  const d1 = Math.pow(ab, inv);
  const d2 = Math.pow(bc, inv);
  const d3 = Math.pow(cd, inv);

  const t0 = -d1;
  const t1 = 0;
  const t2 = d2;
  const t3 = d2 + d3;

  return catmullRom(fraction * d2, t0, t1, t2, t3, a, b, c, d);
};

// Weighted catmull rom value+derivative (chordal = 1, centripetal = 2)
export const catmullRomWeightedDual = (
  fraction: number,
  a: number,
  b: number,
  c: number,
  d: number,
  ab: number,
  bc: number,
  cd: number,
  power: number = 2,
): [number, number] => {
  const inv = 1 / power;
  const d1 = Math.pow(ab, inv);
  const d2 = Math.pow(bc, inv);
  const d3 = Math.pow(cd, inv);

  const t0 = -d1;
  const t1 = 0;
  const t2 = d2;
  const t3 = d2 + d3;

  const [v, dvdt] = catmullRomDual(fraction * d2, t0, t1, t2, t3, a, b, c, d);
  return [v, dvdt * d2];
};

// Sample spline at endpoints (0..1) to make cubic bezier
export const sampleToCubicBezier = (
  sampleDual: (t: number) => [number, number],
) => {
  const [b0, v0] = sampleDual(0);
  const [b3, v3] = sampleDual(1);

  const b1 = b0 + v0 / 3;
  const b2 = b3 - v3 / 3;

  return [b0, b1, b2, b3];
};

// Arc length map for a spline
type ArcLengthMap = {
  map: Float32Array,
  count: number,
  length: number,
  limit: number,
};

// Make arc length map for a spline
export const makeArcLengthMap = (
  measure: (t1: number, t2: number) => number,
  tolerance: number = 0.005,
  evenness: number = 0.5,
  limit: number = 8,
) => {

  let n = 0;
  let accum = 0;
  const eps = Math.pow(2, Math.ceil(Math.log2(tolerance)));

  // Extra epsilon at start
  const data: number[] = [-measure(-eps, 0), -eps, 0];

  // Accumulate samples from 0..1
  const range = (a: number, b: number, l: number, force: number, limit: number) => {
    const m = (a + b) / 2;
    const l1 = measure(a, m);
    const l2 = measure(m, b);
    const d = l1 + l2;
    const e = Math.min(l1 / l2, l2 / l1);

    if ((force > 0 || (l / d < 1 - tolerance) || (e < evenness)) && (limit > 0)) {
      range(a, m, l1, force - 1, limit - 1);
      range(m, b, l2, force - 1, limit - 1);
    }
    else {
      n++;
      const r = l / d;
      accum += d / (1 + r) * 2;
      data.push(a);
      data.push(accum);
    }
  };

  range(0, 1, measure(0, 1), 2, limit);
  data.push(1);

  // Extra epsilon at end
  data.push(accum + measure(1, 1 + eps));
  data.push(1 + eps);

  const count = n;
  const length = accum;
  const map = new Float32Array(data);

  return {map, count, length, limit};
};

// Query value in arc length map
export const queryArcLengthMap = (am: ArcLengthMap, value: number) => {
  let {map, count, limit} = am;

  let a = 1;
  let b = count;

  while (b > a && limit-- > 0) {
    const m = b - ((b - a) >> 1);
    const d = map[m * 2];
    if (d > value) b = m - 1;
    else a = m;
  }

  const a2 = a * 2;

  const d0 = map[a2 - 2];
  const t0 = map[a2 - 1];

  const d1 = map[a2];
  const t1 = map[a2 + 1];

  const d2 = map[a2 + 2];
  const t2 = map[a2 + 3];

  const d3 = map[a2 + 4];
  const t3 = map[a2 + 5];

  return clamp(catmullRom(value, d0, d1, d2, d3, t0, t1, t2, t3), 0, 1);
};
