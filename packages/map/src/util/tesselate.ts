type XY = [number, number];
type Field = ([x, y]: XY) => number;

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

const getZeroLevel = (a: number, b: number) => -a / (b - a);

export const cutPolygons = (
  polygons: XY[][][],
  nx: number,
  ny: number,
  d: number,
) => {
  const getValue   = ([x, y]: XY) =>  nx * x + ny * y - d;
  const getTangent = ([x, y]: XY) => -ny * x + nx * y;
  const out: XY[][][] = [];
  for (const rings of polygons) {
    const cut = cutPolygonWith(rings, getValue, getTangent);
    if (cut) out.push(...cut);
  }
  return out;
};

export const cutPolygon = (
  rings: XY[][],
  nx: number,
  ny: number,
  d: number,
) => {
  const getValue   = ([x, y]: XY) =>  nx * x + ny * y - d;
  const getTangent = ([x, y]: XY) => -ny * x + nx * y;
  return cutPolygonWith(rings, getValue, getTangent);
};

export const cutPolygonWith = (
  rings: XY[][],
  getValue: Field,
  getTangent: Field,
) => {
  const cut: XY[][] = [];
  const whole: XY[][] = [];

  let cuts = 0;
  for (const r of rings) if (r.length) {
    const cr = cutRingWith(r, getValue);
    if (cr?.[0] === r) whole.push(r);
    else if (cr === null) {
      cuts++;
      continue;
    }
    else if (cr.length) {
      cut.push(...cr);
      cuts++;
    }
  }

  if (cuts === 0) return [rings];
  if (cut.length === 0) return null;

  const holes = whole;
  const areas = holes.map(getRingArea);

  const out = assembleCutRingWith(cut, getTangent).map(r => [r]);
  for (const h of holes) {
    nextHole: for (const polygon of out) {
      const [exterior] = polygon;
      if (pointInRing(exterior, h[0])) {
        polygon.push(h);
        break nextHole;
      }
    }
  }

  return out;
}

export const cutRing = (
  ring: XY[],
  nx: number,
  ny: number,
  d: number,
) => {
  const getValue = ([x, y]: XY) => nx * x + ny * y - d;
  return cutRingWith(ring, getValue);
}

export const cutRingWith = (
  ring: XY[],
  getValue: Field,
) => {
  const n = ring.length;

  const out: XY[][] = [];
  let pos = 0;
  let last: XY | null = null;

  for (let i = 0; i < n; ++i) {
    const a = ring[i];
    const b = ring[i + 1] || ring[i - n + 1];

    const va = getValue(a);
    const vb = getValue(b);

    const f = va != vb ? getZeroLevel(va, vb) : 0;

    let p: XY | null;
    if (f > 0 && f < 1) {
      const p = [
        Math.round(lerp(a[0], b[0], f)),
        Math.round(lerp(a[1], b[1], f)),
      ] as XY;
      if (va > 0) {
        const cut = ring.slice(pos, i + 1);
        if (last) cut.unshift(last);
        cut.push(p);
        if (!out.length || getRingArea(cut)) out.push(cut);
        last = null;
      }
      else {
        last = p;
        pos = i + 1;
      }
    } else {
      if (va === 0) {
        if (vb < 0) {
          const cut = ring.slice(pos, i + 1);
          if (last) cut.unshift(last);
          if (!out.length || getRingArea(cut)) out.push(cut);
          last = null;
        }
        if (vb === 0 && i === 0) {
          last = a;
        }
      }
      else if (vb === 0) {
        if (va < 0) {
          last = b;
          pos = i + 2;
        }
      }
    }
  }

  if (last) out[0] = [last, ...ring.slice(pos), ...(out[0] ?? [])];
  if (out[0] && !getRingArea(out[0])) out.shift();
  else if (out.length === 0 && ring.length) {
    let i = 0;
    let r = null;
    while ((r = ring[i]) && getValue(r) === 0) { i++ };
    if (ring[i] && getValue(ring[i]) > 0) return [ring];
  }

  return out.length ? out : null;
};

export const assembleCutRing = (
  segments: XY[][],
  nx: number,
  ny: number,
) => {
  const getTangent = ([x, y]: XY) => -ny * x + nx * y;
  return assembleCutRingWith(segments, getTangent);
}

export const assembleCutRingWith = (
  segments: XY[][],
  getTangent: Field,
) => {

  const score = segments.map(seg => {
    const start = seg[0];
    const end = seg[seg.length - 1];
    return Math.min(getTangent(start), getTangent(end));
  });
  const order = segments.map((_, i) => i);
  order.sort((a, b) => score[a] - score[b]);

  const paths: {
    path: XY[],
    min: number,
    max: number,
  }[] = [];

  for (const i of order) {
    const seg = segments[i];
    const s = seg[0];
    const e = seg[seg.length - 1];

    const a = getTangent(s);
    const b = getTangent(e);
    const min = Math.min(a, b);
    const max = Math.max(a, b);

    const area = getRingArea(seg);

    if (!paths.length) {
      paths.push({path: seg, min, max});
    }
    else {
      let found = false;
      for (const path of paths) {
        if (!(max < path.min || min > path.max)) {
          path.path = [...seg, ...path.path];
          path.min = max;
          found = true;
          break;
        }
      }
      if (!found) {
        paths.push({path: seg, min, max});
      }
    }
  }

  return paths.map(({path}) => path);
};

export const clipTileEdges = (polygons: XY[][][], minX: number, minY: number, maxX: number, maxY: number) => {
  const line = [];
  const loop = [];

  let section = null;
  let cut = false;
  let edge = false;

  for (const polygon of polygons) {
    for (const ring of polygon) {
      const cuts = [];

      let i = 0;
      for (const p of ring) {
        const [x, y] = p;
        if (x <= minX || y <= minY || x >= maxX || y >= maxY) cuts.push(i);
        ++i;
      }
      
      if (!cuts.length) loop.push(ring);
      else {
        if (cuts[0] > 0) line.push(ring.slice(0, cuts[0] + 1));
        for (let i = 0; i < cuts.length; ++i) {
          if (cuts[i] + 1 != cuts[i + 1]) line.push(ring.slice(cuts[i], (cuts[i + 1] ?? ring.length) + 1));
        }
      }
    }
  }

  return {line, loop};
};

export const getRingArea = (ring: XY[]): number => {
  let area = 0;

  let n = ring.length;
  for (let i = 0; i < n; ++i) {
    const a = ring[i];
    const b = ring[i + 1] || ring[i + 1 - n];

    area += a[0] * b[1];
    area -= a[1] * b[0];
  }

  return area / 2;
};

export const pointInPolygon = (
  rings: XY[][],
  point: XY,
) => {
  if (!rings.length) return false;
  if (!pointInRing(rings[0], point)) return false;

  let n = rings.length;
  for (let i = 1; i < n; ++i) {
    if (pointInRing(rings[i], point)) return false;
  }
  return true;
}

export const pointInRing = (
  ring: XY[],
  point: XY,
) => {
  const [x, y] = point;
  let n = ring.length;

  let winding = 0;
  for (let i = 0; i < n; ++i) {
    const a = ring[i];
    const b = ring[i + 1] ?? ring[i + 1 - n];

    const ax = b[0] - a[0];
    const ay = b[1] - a[1];

    const bx = x - a[0];
    const by = y - a[1];

    const s = ax * by - ay * bx;
    if (a[1] <= y) {
      if (b[1] > y) if (s > 0) winding++;
    }
    else {
      if (b[1] <= y) if (s < 0) winding--;
    }
  }

  return winding !== 0;
};
