import { LiveElement } from '@use-gpu/live/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { Point, Rectangle, Gap, Margin, Alignment, Anchor, Dimension, LayoutRenderer, LayoutPicker, InlineRenderer, InlineLine } from '../types';

import { chainTo } from '@use-gpu/shader/wgsl';

type Fitter<T> = (into: Point) => T;
export const memoFit = <T>(f: Fitter<T>): Fitter<T> => {
  let last: Point | null = null;
  let value: T | null = null;
  return (into: Point) => {
    if (last && last[0] === into[0] && last[1] === into[1]) {
      return value!;
    }
    value = f(into);
    last = into;
    return value;
  };
}

export const parseDimension = (x: string | number | null | undefined, total: number, snap: boolean = false): number => {
  if (typeof x === 'number') return snap ? Math.round(x) : x;
  if (x == null) return snap ? Math.round(total) : total;

  let v;
  const s = x as string;
  if (s[s.length - 1] === '%') {
    v = +s.slice(0, -1) / 100 * total;
  }
  else {
    v = +s;
  }

  return snap ? Math.round(v) : v;
}

export const parseAnchor = (x: string): number => {
  const isStart = (x === 'start' || x === 'justify-start');
  const isEnd = (x === 'end' || x === 'justify-end');

  const align = isStart ? 0 : isEnd ? 1 : 0.5;
  return align;
}

export const parseBase = (x: string): number | null => {
  const isBase = (x === 'base');
    return isBase ? null : parseAnchor(x);
}

export const normalizeAlignment = (x: Alignment | [Alignment, Alignment]): [Alignment, Alignment] =>
  !Array.isArray(x)
    ? [x, x] as [Alignment, Alignment]
    : x;

export const normalizeAnchor = (x: Anchor | [Anchor, Anchor]): [Anchor, Anchor] =>
  !Array.isArray(x)
    ? [x, x] as [Anchor, Anchor]
    : x;

export const normalizeMargin = (m: number | Margin): Margin =>
  !Array.isArray(m)
    ? [m, m, m, m] as Margin
    : [m[0] || 0, m[1] || 0, (m[2] ?? m[0]) || 0, (m[3] ?? m[1]) || 0];

export const normalizeGap = (g: number | Gap): Gap =>
  !Array.isArray(g)
    ? [g, g] as Gap
    : g;

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
  transform?: ShaderModule,
) => (
  box: Rectangle,
  parent?: ShaderModule,
) => {
  let [left, top, right, bottom] = box;
  const out = [] as LiveElement<any>[];
  const n = sizes.length;

  for (let i = 0; i < n; ++i) {
    const size = sizes[i];
    const offset = offsets[i];
    const render = renders[i];

    const l = left + offset[0];
    const t = top + offset[1];
    const r = l + size[0];
    const b = t + size[1];

    const layout = [l, t, r, b] as Rectangle;
    const el = render(layout, parent && transform ? chainTo(parent, transform) : parent ?? transform);

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
  transform?: ShaderModule,
) => {
  let [left, top, right, bottom] = box;
  const n = ranges.length;

  let last: InlineRenderer | null = null;
  let lines: InlineLine[] = [];

  const out: LiveElement<any> = [];
  const flush = (render: InlineRenderer) => {
    const el = render(lines, transform);
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
