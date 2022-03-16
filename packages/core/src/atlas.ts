type Rectangle = [number, number, number, number];
type Point = [number, number];
type Caret = [number, number];
type Direction = number;

type Anchor = {
  pt: Point,
  shadow: [number, number] | null,
  caret: Caret | null,
};

type Edge = {
  a: Point,
  b: Point,
  dir: Direction,
  dx: number,
  dy: number,
};

const NONE = 0;
const UL = 1;
const UR = 2;
const BL = 3;
const BR = 4;

export type AtlasMapping = {
  rect: Rectangle,
  uv: Rectangle,
};

type Slot = [number, number, number, number, number, number, number];
type Bin = Set<Slot>;
type Bins = Map<number, Slot>;

export const makeAtlas = (
  width: number,
  height: number,
  snap: number = 10,
) => {
  
  const ls: Bins = new Map();
  const rs: Bins = new Map();
  const ts: Bins = new Map();
  const bs: Bins = new Map();
  const slots: Bin = new Set();

  const queue: [number, number, number][] = [];

  const place = (key: number, w: number, h: number) => {
    queue.push([key, w, h]);
  };
  
  const flush = () => {
    //queue.sort((a, b) => (b[1] * b[2]) - (a[1] * a[2]));

    let q = queue.slice();
    queue.length = 0;

    for (const [k, w, h] of q) _place(k, w, h);
  };
  
  const _place = (key: number, w: number, h: number) => {    
    if (map.get(key)) throw new Error("key mapped already", key);

    const cw = Math.ceil(w / snap) * snap;
    const ch = Math.ceil(h / snap) * snap;

    const slot = getNextAvailable(cw, ch, true);
    if (!slot) {
      console.warn('atlas full?', w, h);
      return null;
    }

    const [x, y] = slot;
    const rect = [x, y, x + w, y + h];
    const uv = [rect[0] / width, rect[1] / height, rect[2] / width, rect[2] / height];

    lastR = x + w;
    lastB = y + h;

    clipRectangle(rect);

    const placement = {rect, uv};
    map.set(key, placement);
    return placement;
  };
  
  const getBin = (xs: Set, x: number) => {
    let vs = xs.get(x);
    if (!vs) xs.set(x, vs = new Set());
    return vs;
  }

  const addSlot = (slot: Slot) => {
    const [l, t, r, b] = slot;

    {
      const lsb = ls.get(l);
      const rsb = rs.get(r);
      const tsb = ts.get(t);
      const bsb = bs.get(b);

      const remove: Slot[] = [] ;
      if (lsb) for (const s of lsb) {
        if (containsRectangle(s, slot)) return;
        if (containsRectangle(slot, s)) remove.push(s);
      }
      if (rsb) for (const s of rsb) {
        if (containsRectangle(s, slot)) return;
        if (containsRectangle(slot, s)) remove.push(s);
      }
      if (tsb) for (const s of tsb) {
        if (containsRectangle(s, slot)) return;
        if (containsRectangle(slot, s)) remove.push(s);
      }
      if (bsb) for (const s of bsb) {
        if (containsRectangle(s, slot)) return;
        if (containsRectangle(slot, s)) remove.push(s);
      }
    
      for (const s of remove) removeSlot(s);
    }

    {
      const lsb = getBin(ls, l);
      const rsb = getBin(rs, r);
      const tsb = getBin(ts, t);
      const bsb = getBin(bs, b);

      slots.add(slot);
      lsb.add(slot);
      rsb.add(slot);
      tsb.add(slot);
      bsb.add(slot);
    }
  };

  const removeSlot = (slot: Slot) => {
    const [l, t, r, b] = slot;

    const lsb = getBin(ls, l);
    const rsb = getBin(rs, r);
    const tsb = getBin(ts, t);
    const bsb = getBin(bs, b);
    
    slots.delete(slot);
    lsb.delete(slot);
    rsb.delete(slot);
    tsb.delete(slot);
    bsb.delete(slot);

    if (lsb.size === 0) ls.delete(l);
    if (rsb.size === 0) rs.delete(r);
    if (tsb.size === 0) ts.delete(t);
    if (bsb.size === 0) bs.delete(b);
  };
  
  const map = new Map<number, AtlasMapping>();

  let lastR = 0;
  let lastB = 0;

  const getNextAvailable = (w: number, h: number, debug: boolean = false) => {
    let slot: Slot | null = null;
    let max = 0;

    for (const s of slots.values()) {
      const [l, t, r, b, sx, sy, corner] = s;
      
      const x = l;
      const y = t;
      const cw = r - l;
      const ch = b - t;

      if (w <= cw && h <= ch) {
        const fx = (w <= sx ? w / sx : w / cw);
        const fy = (h <= sy ? h / sy : h / ch);

        const b = corner + 1;
        const f = 1.0 - (Math.min(x / width, y / height) + (x / width * y / height)) * .25;
        const d = b * f * fx * fy;

        if (d > max) {
          slot = s;
          max = d;
        }
      }
    }

    return slot;
  }
  
  const stats = {
    slots: 0,
    checks: 0,
    clips: 0,
  };
  
  const clipRectangle = (other: Rectangle) => {
    const add = [] as Slot[];
    const remove = [] as Slot[];

    const [l, t, r, b] = other;
    const w = r - l;
    const h = b - t;

    for (const slot of slots.values()) {
      stats.checks++;
      if (intersectRectangle(slot, other)) {
        const splits = subtractRectangle(slot, other);
        add.push(...splits);
        remove.push(slot);

        stats.slots += splits.length;
        stats.clips++;
      }
    };
    
    for (const s of remove) removeSlot(s);
    for (const s of add) addSlot(s);
  };

  const debugPlacements = () => Array.from(map.keys()).map(k => map.get(k)!);
  const debugSlots = () => Array.from(slots.values()).map(s => s);

  const debugClusters = () => {
    const clusters: Rectangle[][] = [];
  
    const rects = debugSlots();
    const n = rects.length;
    
    let wasted = 0;
    const outer = [0, 0, width, height];
    nextRect: for (let i = 0; i < n; ++i) {
      const a = rects[i];
      if (a[0] !== 0 && a[1] !== 0 && a[2] !== width && a[3] !== height) {
        wasted += (a[2] - a[0]) * (a[3] - a[1]);
      }
    }
    
    nextRect: for (let i = 0; i < n; ++i) {
      const a = rects[i];
      for (let c of clusters) {
        for (let b of c) {
          if (touchRectangle(a, b)) {
            c.push(a);
            continue nextRect;
          }
        }
      }
      clusters.push([a]);
    }
    
    console.log('clusters', clusters.length, '-', wasted);
  }
  
  const debugValidate = () => {
    const rects = debugPlacements().map(({rect}) => rect);
    let n = rects.length;
    
    debugClusters();
    
    const out: Caret[] = [];
    
    const box: Rectangle = [Infinity, Infinity, -Infinity, -Infinity];

    for (let i = 0; i < n; ++i) {
      const a = rects[i];
      const [l, t, r, b] = a;

      box[0] = Math.min(box[0], l);
      box[1] = Math.min(box[1], t);
      box[2] = Math.max(box[2], r);
      box[3] = Math.max(box[3], b);

      for (let j = i + 1; j < n; ++j) {
        const b = rects[j];

        if (!(a[0] >= b[2] || b[0] >= a[2] || a[1] >= b[3] || b[1] >= a[3])) {
          console.warn(`Overlap detected ${a.join(',')} => ${b.join(',')}`);
          const pl = Math.max(a[0], b[0]);
          const pt = Math.max(a[1], b[1]);
          const pr = Math.min(a[2], b[2]);
          const pb = Math.min(a[3], b[3]);
          const dx = pr - pl;
          const dy = pb - pt;
          out.push({x: pl, y: pt, dx, dy});
        }
      }
    }

    console.info('atlas', map.size, slots.size);
    console.info('bounding box', box);
    console.info('stats', stats);
    
    console.info('ls', Array.from(ls.keys()), Array.from(ls.keys()).map(k => ls.get(k).size));
    console.info('rs', Array.from(rs.keys()), Array.from(rs.keys()).map(k => rs.get(k).size));
    console.info('ts', Array.from(ts.keys()), Array.from(ts.keys()).map(k => ts.get(k).size));
    console.info('bs', Array.from(bs.keys()), Array.from(bs.keys()).map(k => bs.get(k).size));

    return out;
  }

  const slot = [0, 0, width, height, width, height, 1];
  addSlot(slot);

  return {place, flush, map, width, height, debugPlacements, debugSlots, debugValidate};
};

const intersectRange = (minA: number, maxA: number, minB: number, maxB: number) => !(minA >= maxB || minB >= maxA);
const intersectRangeEnds = (minA: number, maxA: number, minB: number, maxB: number) => !(minA > maxB || minB > maxA);
const containsRange = (minA: number, maxA: number, minB: number, maxB: number) => (minA <= minB && maxA >= maxB);
const getOverlap = (minA: number, maxA: number, minB: number, maxB: number) => Math.max(0, Math.min(maxA, maxB) - Math.max(minA, minB));

const containsRectangle = (a: Rectangle, b: Rectangle) => {
  const [al, at, ar, ab] = a;
  const [bl, bt, br, bb] = b;

  return containsRange(al, ar, bl, br) && containsRange(at, ab, bt, bb);
};

const touchRectangle = (a: Rectangle, b: Rectangle) => {
  const [al, at, ar, ab] = a;
  const [bl, bt, br, bb] = b;

  return intersectRangeEnds(al, ar, bl, br) && intersectRangeEnds(at, ab, bt, bb);
};

const intersectRectangle = (a: Rectangle, b: Rectangle) => {
  const [al, at, ar, ab] = a;
  const [bl, bt, br, bb] = b;

  return intersectRange(al, ar, bl, br) && intersectRange(at, ab, bt, bb);
};

const subtractRectangle = (a: Slot, b: Rectangle): Slot => {
  const [al, at, ar, ab, sx, sy, corner] = a;
  const [bl, bt, br, bb] = b;
  
  const w = getOverlap(al, ar, bl, br);
  const h = getOverlap(at, ab, bt, bb);

  const out: Rectangle[] = [];

  if (al < bl) {
    out.push([al, at, bl, ab, Math.min(sx, bl - al), ab - at, 1]);
  }
  if (ar > br) {
    out.push([br, at, ar, ab, Math.min(sx, ar - br), h, +(at >= bt)]);
  }
  if (at < bt) {
    out.push([al, at, ar, bt, ar - al, Math.min(sy, bt - at), 1]);
  }
  if (ab > bb) {
    out.push([al, bb, ar, ab, w, Math.min(sy, ab - bb), +(al >= bl)]);
  }

  return out;
};
