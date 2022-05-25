import { Point, Rectangle } from '@use-gpu/core/types';
import { LayoutElement, LayoutRenderer, LayoutPicker, AutoPoint } from '../types';
import { evaluateDimension } from '../parse';

const NO_LAYOUT = [0, 0, 0, 0] as Rectangle;

export const fitAbsoluteBox = (
  els: LayoutElement[],
  into: AutoPoint,
  l?: string | number | null,
  t?: string | number | null,
  r?: string | number | null,
  b?: string | number | null,
  w?: string | number | null,
  h?: string | number | null,
  snap?: boolean,
) => {
  const [iw, ih] = into;
  const box = resolveAbsoluteBox([0, 0, iw ?? 0, ih ?? 0], l, t, r, b, w, h, snap);
  const [left, top, right, bottom] = box;

  const width = right - left;
  const height = bottom - top;
  const size = [width, height] as Point;

  const sizes = [] as Point[];
  const offsets = [] as Point[];
  const renders = [] as LayoutRenderer[];
  const pickers = [] as LayoutPicker[];

  const n = els.length;
  for (const el of els) {
    const {margin, fit, stretch} = el;
    const [ml, mt, mr, mb] = margin;

    const mw = ml + mr;
    const mh = mt + mb;
    
    const into = size.slice() as Point;
    into[0] -= mw;
    into[1] -= mh;

    let {render, pick, size: fitted} = fit(into);

    if (stretch) {
      let ew = fitted[0] + mw;
      let eh = fitted[1] + mh;

      if (into[0] != null) ew = Math.min(ew, width);
      if (into[1] != null) eh = Math.min(eh, height);

      fitted = [ew - mw, eh - mh];
    }

    sizes.push(fitted);
    offsets.push([left + ml, top + mt]);
    renders.push(render);
    pickers.push(pick);
  }

  return {size, sizes, offsets, renders, pickers};
};

export const resolveAbsoluteBox = (
  box: Rectangle,
  l?: string | number | null,
  t?: string | number | null,
  r?: string | number | null,
  b?: string | number | null,
  w?: string | number | null,
  h?: string | number | null,
  snap?: boolean,
) => {
  let [
    left,
    top,
    right,
    bottom,
  ] = box;
  
  let width = right - left;
  let height = bottom - top;

  let favorW = false;
  let favorH = false;

  if (l != null) left   += evaluateDimension(l, width)!;
  if (r != null) right  -= evaluateDimension(r, width)!;
  if (t != null) top    += evaluateDimension(t, height)!;
  if (b != null) bottom -= evaluateDimension(b, height)!;

  if (w != null) {
    width = evaluateDimension(w, width)!;
    if (l != null || r == null) right = left + width;
    else left = right - width;
    favorW = true;
  }

  if (h != null) {
    height = evaluateDimension(h, height)!;
    if (t != null || b == null) bottom = top + height;
    else top = bottom - height;
    favorH = true;
  }

  if (snap) {
    left = Math.round(left);
    top = Math.round(top);

    if (favorW) {
      width = Math.round(width);
      right = left + width;
    }
    else {
      right = Math.round(right);
      width = right - left;
    }

    if (favorH) {
      height = Math.round(height);
      bottom = top + height;
    }
    else {
      bottom = Math.round(bottom);
      height = bottom - top;
    }
  }

  return [left, top, right, bottom] as Rectangle;
}
