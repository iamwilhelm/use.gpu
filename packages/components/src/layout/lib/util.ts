import { LiveElement } from '@use-gpu/live/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { AutoPoint, Point, Direction, Rectangle, Gap, MarginLike, Margin, Alignment, Anchor, Dimension, LayoutRenderer, LayoutPicker, InlineRenderer, InlineLine } from '../types';

import { bindBundle, chainTo } from '@use-gpu/shader/wgsl';
import { getCombinedClip, getTransformedClip } from '@use-gpu/wgsl/clip/clip.wgsl';

export const isHorizontal = (d: Direction) => d === 'x' || d === 'lr' || d === 'rl';
export const isVertical = (d: Direction) => d === 'y' || d === 'tb' || d === 'bt';
export const isFlipped = (d: Direction) => d === 'rl' || d === 'bt';

type Fitter<T> = (into: AutoPoint) => T;
export const memoFit = <T>(f: Fitter<T>): Fitter<T> => {
  let last: AutoPoint | null = null;
  let value: T | null = null;
  return (into: AutoPoint) => {
    if (last && last[0] === into[0] && last[1] === into[1]) {
      return value!;
    }
    value = f(into);
    last = into;
    return value;
  };
}

export const mergeMargin = (a: number, b: number) => {
  if (a >= 0 && b >= 0) return Math.max(a, b);
  if (a >= 0) return a + b;
  if (b >= 0) return b + a;
  return Math.min(a, b);
}

export const makeBoxLayout = (
  sizes: Point[],
  offsets: Point[],
  renders: LayoutRenderer[],
  clip?: ShaderModule,
  transform?: ShaderModule,
  inverse?: ShaderModule,
  update?: (r: Rectangle) => void,
) => (
  box: Rectangle,
  parentClip?: ShaderModule,
  parentTransform?: ShaderModule,
) => {
  let [left, top, right, bottom] = box;
  const out = [] as LiveElement<any>[];
  const n = sizes.length;

  if (update) update(box);

  const xform = parentTransform && transform ? chainTo(parentTransform, transform) : parentTransform ?? transform;
  const xclip = parentClip ? (
    transform
    ? bindBundle(
        clip ? getCombinedClip : getTransformedClip,
        {
          getParent: parentClip,
          getSelf: clip ?? null,
          applyTransform: inverse ?? null,
        }
      )
    : parentClip
  ) : clip;

  for (let i = 0; i < n; ++i) {
    const size = sizes[i];
    const offset = offsets[i];
    const render = renders[i];

    const w = size[0];
    const h = size[1];

    const l = left + offset[0];
    const t = top + offset[1];
    const r = l + w;
    const b = t + h;
    
    const layout = [l, t, r, b] as Rectangle;
    const el = render(layout, xclip, xform);

    if (Array.isArray(el)) out.push(...(el as any[]));
    else out.push(el);
  }

  return out;
};

export const makeInlineLayout = (
  ranges: Point[],
  //sizes: Point[],
  offsets: [number, number, number][],
  renders: InlineRenderer[],
) => (
  box: Rectangle,
  clip?: ShaderModule,
  transform?: ShaderModule,
) => {
  let [left, top, right, bottom] = box;
  const n = ranges.length;

  let last: InlineRenderer | null = null;
  let lines: InlineLine[] = [];

  const out: LiveElement<any>[] = [];
  const flush = (render: InlineRenderer) => {
    const el = render(lines, clip, transform);
    if (Array.isArray(el)) out.push(...(el as any[]));
    else out.push(el);

    lines = [];
  };
  
  for (let i = 0; i < n; ++i) {
    const range = ranges[i];
    //const size = sizes[i];
    const offset = offsets[i];
    const render = renders[i];

    const [x, y, gap] = offset;
    const l = left + x;
    const t = top + y;
    const r = l;// + size[0];
    const b = t;// + size[1];

    const layout = [l, t, r, b] as Rectangle;
    const [start, end] = range;

    if (last !== render) {
      if (last) flush(last);
      last = render;
    }

    lines.push({layout, start, end, gap});
  }

  if (last) flush(last);

  return out;
};

export const makeBoxPicker = (
  id: number,
  sizes: Point[],
  offsets: Point[],
  pickers: LayoutPicker[],
  scrollPos?: Point,
  onScroll?: (dx: number, dy: number) => void,
) => (
  x: number,
  y: number,
  ox: number,
  oy: number,
  scroll: boolean = false,
): [
  number,
  Rectangle,
  ((dx: number, dy: number) => void) | undefined,
] | null => {
  const n = sizes.length;

  for (let i = n - 1; i >= 0; --i) {
    const size = sizes[i];
    const offset = offsets[i];
    const pick = pickers[i];

    const [w, h] = size;

    let [l, t] = offset;
    l += ox;
    t += oy;

    if (scrollPos) {
      l -= scrollPos[0];
      t -= scrollPos[1];
    }

    let r = l + w;
    let b = t + h;
    
    if (x >= l && x < r && y >= t && y < b) {
      const sub = pick && pick(x, y, l, t, scroll);
      if (sub) return sub;
      return (!scroll || onScroll) ? [id, [l, t, r, b], onScroll] : null;
    }
  }

  return null;
};

export const intersectRange = (minA: number, maxA: number, minB: number, maxB: number) => !(minA >= maxB || minB >= maxA);

export const overlapBounds = (a: Rectangle, b: Rectangle): boolean => {
  const [al, at, ar, ab] = a;
  const [bl, bt, br, bb] = b;

  return intersectRange(al, ar, bl, br) && intersectRange(at, ab, bt, bb);
}

export const joinBounds = (a: Rectangle, b: Rectangle): Rectangle => {
  const [al, at, ar, ab] = a;
  const [bl, bt, br, bb] = b;
  return [
    Math.min(al, bl),
    Math.min(at, bt),
    Math.max(ar, br),
    Math.max(ab, bb),
  ] as Rectangle;
};

export const intersectBounds = (a: Rectangle, b: Rectangle): Rectangle => {
  const [al, at, ar, ab] = a;
  const [bl, bt, br, bb] = b;
  return [
    Math.max(al, bl),
    Math.max(at, bt),
    Math.min(ar, br),
    Math.min(ab, bb),
  ] as Rectangle;
};
