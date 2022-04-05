import { makeTextureDataLayout, makeDynamicTexture, makeTextureView, uploadTexture } from './texture';
import { Rectangle, Atlas, TextureSource } from './types';
import uniq from 'lodash/uniq';

type Rectangle = [number, number, number, number];
type Point = [number, number];

type Slot = [number, number, number, number, number, number, number];
type Bin = Set<Slot>;
type Bins = Map<number, Slot>;

export const makeAtlasSource = (
  device: GPUDevice,
  atlas: Atlas,
  format: GPUTextureFormat,
): TextureSource => {
  const texture = makeDynamicTexture(device, atlas.width, atlas.height, 1, format);
  const source = {
    texture,
    view: makeTextureView(texture),
    sampler: {
      minFilter: 'linear',
      magFilter: 'linear',
    } as GPUSamplerDescriptor,
    layout: 'texture_2d<f32>',
    format,
    size: [atlas.width, atlas.height],
    version: 1,
  };
  return source;
}

export const makeAtlas = (
  width: number,
  height: number,
  maxWidth: number = 4096,
  maxHeight: number = 4096,
  snap: number = 1,
) => {
  
  const ls: Bins = new Map();
  const rs: Bins = new Map();
  const ts: Bins = new Map();
  const bs: Bins = new Map();
  const slots: Bin = new Set();

  const place = (key: number, w: number, h: number): Rectangle => {
    if (map.get(key)) throw new Error("key mapped already", key);
    self.version = self.version + 1;

    const cw = Math.ceil(w / snap) * snap;
    const ch = Math.ceil(h / snap) * snap;

    const slot = getNextAvailable(cw, ch, true);
    if (!slot) {
      expand();
      return place(key, w, h);
    }

    const [x, y] = slot;
    const rect = [x, y, x + w, y + h];

    if (snap) {
      const clip = [x, y, x + cw, y + ch];
      clipRectangle(clip);
    }
    else clipRectangle(rect);
    map.set(key, rect);
    return rect;
  };
  
  const expand = () => {
    const w = width * 2;
    const h = height * 2;
    
    if (w > maxWidth || h > maxHeight) {
      throw new Error(`Atlas is full and can't expand any more (${maxWidth}x${maxHeight})`);
    }

    const slot = [0, 0, w, h, w, h, 1];
    const splits = subtractRectangle(slot, [0, 0, width, height]);
    for (const s of splits) addSlot(s);

    const expandX = Array.from(rs.get(width).values());
    const expandY = Array.from(bs.get(height).values());
    const expand = uniq([...expandX, ...expandY]);

    for (const s of expand) removeSlot(s);
    for (const s of expand) {
      let [l, t, r, b, sx, sy, corner] = s;
      if (r === width) r = w;
      if (b === height) b = h;
      addSlot([l, t, r, b, sx, sy, corner]);
    }

    self.width = width = w;
    self.height = height = h;
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
  
  const map = new Map<number, Rectangle>();

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

  const debugValidate = () => {
    const rects = debugPlacements();
    let n = rects.length;
    
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

    return out;
  }

  const slot = [0, 0, width, height, width, height, 1];
  addSlot(slot);

  const self = {
    place, map, expand,
    width, height, version: 0,
    debugPlacements, debugSlots, debugValidate,
  } as Atlas;

  return self;
};

export const uploadAtlasMapping = (
  device: GPUDevice,
  texture: GPUTexture,
  format: GPUTextureFormat,
  data: Uint8Array,
  rect: Rectangle,
): void => {
  const [l, t, r, b] = rect;

  const offset = [l, t] as Point;
  const size = [r - l, b - t] as Point;
    
  const layout = makeTextureDataLayout(size, format);  
  uploadTexture(device, texture, data, layout, size, offset);
}

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
    out.push([br, at, ar, ab, Math.min(sx, ar - br), Math.max(h, bb - at), +(at >= bt)]);
  }
  if (at < bt) {
    out.push([al, at, ar, bt, ar - al, Math.min(sy, bt - at), 1]);
  }
  if (ab > bb) {
    out.push([al, bb, ar, ab, Math.max(w, br - al), Math.min(sy, ab - bb), +(al >= bl)]);
  }

  return out;
};
