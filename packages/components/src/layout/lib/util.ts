import { LiveElement } from '@use-gpu/live/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { Point, Point4, Rectangle } from '@use-gpu/core/types';
import { AutoPoint, Direction, Gap, MarginLike, Margin, Alignment, Anchor, Dimension, LayoutRenderer, LayoutPicker, InlineRenderer, InlineLine, UIAggregate } from '../types';

import { yeet, fragment } from '@use-gpu/live';
import { getHashValue } from '@use-gpu/state';
import { bindBundle, chainTo } from '@use-gpu/shader/wgsl';
import { getCombinedClip, getTransformedClip } from '@use-gpu/wgsl/clip/clip.wgsl';
import { INSPECT_STYLE } from './constants';

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

type Layout<T> = (
  box: Rectangle,
  clip?: ShaderModule,
  transform?: ShaderModule,
) => T;
export const memoLayout = <T>(f: Layout<T>): Layout<T> => {
  let lastBox: Rectangle | null = null;
  let lastClip: ShaderModule | null = null;
  let lastTransform: ShaderModule | null = null;

  const sameBox = (a: Rectangle, b: Rectangle) => {
    return (a[0] === b[0]) && (a[1] === b[1]) && (a[2] === b[2]) && (a[3] === b[3]);
  }

  let value: T | null = null;
  return (
    box: Rectangle,
    clip?: ShaderModule,
    transform?: ShaderModule,
  ) => {
    if (lastBox && sameBox(lastBox, box) && lastClip === clip && lastTransform === transform) {
      return value!;
    }
    value = f(box, clip, transform);
    lastBox = box;
    lastClip = clip;
    lastTransform = transform;
    return value;
  };
}

type Inline<T> = (
  lines: InlineLine[],
  clip?: ShaderModule,
  transform?: ShaderModule,
) => T;
export const memoInline = <T>(f: Inline<T>): Inline<T> => {
  let lastHash: number | null = null;
  let lastClip: ShaderModule | null = null;
  let lastTransform: ShaderModule | null = null;

  let value: T | null = null;
  return (
    lines: InlineLine[],
    clip?: ShaderModule,
    transform?: ShaderModule,
    version?: number,
  ) => {
    const hash = version ?? getHashValue(lines);
    if (lastHash && lastHash === hash && lastClip === clip && lastTransform === transform) {
      return value!;
    }
    value = f(lines, clip, transform);
    lastHash = hash;
    lastClip = clip;
    lastTransform = transform;
    return value;
  };
}

export const mergePadding = (a: Point4, b: Point4) => {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
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
  const [left, top, right, bottom] = box;
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

    if (Array.isArray(el)) {
      if (el.length > 1) out.push(fragment(el as any[]));
      else out.push(el[0] as any);
    }
    else out.push(el);
  }
  
  if (out.length === 1 && Array.isArray(out[0])) return out[0];
  return out;
};

export const makeBoxInspectLayout = (
  id: number,
  sizes: Point[],
  offsets: Point[],
  renders?: LayoutRenderer[],
  clip?: ShaderModule,
  transform?: ShaderModule,
  inverse?: ShaderModule,
  update?: (r: Rectangle) => void,
) => (
  box: Rectangle,
  parentClip?: ShaderModule,
  parentTransform?: ShaderModule,
) => {
  let out = renders ? makeBoxLayout(sizes, offsets, renders, clip, transform, inverse, update)(box, parentClip, parentTransform) : [];
  
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

  let i = 0;
  const next = () => id.toString() + '-' + i++;
  const yeets = [] as UIAggregate[];
  yeets.push({
    id: next(),
    rectangle: box,
    uv: [0, 0, 1, 1],
    fill: [0, 1, 1, .2],
    stroke: [0.3, 0.9, 1, 1],
    border: [2, 2, 2, 2],
    count: 1,
    repeat: 0,
    clip: parentClip,
    transform: parentTransform,
    bounds: box,
  });

  const [left, top] = box;
  const n = sizes.length;
  for (let i = 0; i < n; ++i) {
    const size = sizes[i];
    const offset = offsets[i];

    const w = size[0];
    const h = size[1];

    const l = left + offset[0];
    const t = top + offset[1];
    const r = l + w;
    const b = t + h;
    const layout = [l, t, r, b] as Rectangle;

    yeets.push({
      id: next(),
      rectangle: layout,
      uv: [0, 0, 1, 1],
      fill: [.5, 1, .7, .2],
      stroke: [.5, 1, .7, .5],
      border: [1, 1, 1, 1],
      count: 1,
      repeat: 0,
      clip: xclip,
      transform: xform,
    });
  }
  
  out = [...out, yeet(yeets)];
  return out;
}

export const makeInlineLayout = (
  ranges: Point[],
  sizes: Point[],
  offsets: [number, number, number][],
  renders: InlineRenderer[],
  key: number,
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
    const el = render(lines, clip, transform, key);
    if (Array.isArray(el)) out.push(...(el as any[]));
    else out.push(el);

    lines = [];
  };
  
  for (let i = 0; i < n; ++i) {
    const range = ranges[i];
    const size = sizes[i];
    const offset = offsets[i];
    const render = renders[i];

    const [x, y, gap] = offset;
    const l = left + x;
    const t = top + y;
    const r = l + size[0];
    const b = t + size[1];

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

export const makeInlineInspectLayout = (
  id: number,
  ranges: Point[],
  sizes: Point[],
  offsets: [number, number, number][],
  renders?: InlineRenderer[],
  versionRef: ({current: number}),
) => (
  box: Rectangle,
  clip?: ShaderModule,
  transform?: ShaderModule,
) => {
  let out = renders ? makeInlineLayout(ranges, sizes, offsets, renders, versionRef)(box, clip, transform) : [];

  let i = 0;
  const next = () => id.toString() + '-' + i++;
  const yeets = [] as UIAggregate[];
  yeets.push({
    id: next(),
    rectangle: box,
    uv: [0, 0, 1, 1],
    count: 1,
    repeat: 0,
    clip,
    transform,
    bounds: box,
    ...INSPECT_STYLE.parent,
  });

  const [left, top] = box;
  const n = ranges.length;
  for (let i = 0; i < n; ++i) {
    const range = ranges[i];
    const size = sizes[i];
    const offset = offsets[i];

    const [x, y, gap] = offset;
    const l = left + x;
    const t = top + y;
    const r = l + size[0];
    const b = t + size[1];

    const layout = [l, t, r, b] as Rectangle;

    yeets.push({
      id: next(),
      rectangle: layout,
      uv: [0, 0, 1, 1],
      count: 1,
      repeat: 0,
      clip,
      transform,
      ...INSPECT_STYLE.child
    });
  }
  
  out = [...out, yeet(yeets)];
  return out;
};

export const makeBoxPicker = (
  id: number,
  sizes: Point[],
  offsets: Point[],
  pickers: (LayoutPicker | null)[],
  scrollPos?: Point,
  onScroll?: (dx: number, dy: number) => void,
) => (
  x: number,
  y: number,
  l: number,
  t: number,
  r: number,
  b: number,
  scroll: boolean = false,
): [
  number,
  Rectangle,
  ((dx: number, dy: number) => void) | undefined,
] | null => {
  const n = sizes.length;

  if (x < l || x > r || y < t || y > b) return null;

  for (let i = n - 1; i >= 0; --i) {
    const size = sizes[i];
    const offset = offsets[i];
    const pick = pickers[i];

    const [w, h] = size;

    let [ll, tt] = offset;
    ll += l;
    tt += t;

    if (scrollPos) {
      ll -= scrollPos[0];
      tt -= scrollPos[1];
    }

    let rr = ll + w;
    let bb = tt + h;
    
    const sub = pick && pick(x, y, ll, tt, rr, bb, scroll);
    if (sub) return sub;
  }

  return (!scroll || onScroll) ? [id, [l, t, r, b], onScroll] : null;
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
