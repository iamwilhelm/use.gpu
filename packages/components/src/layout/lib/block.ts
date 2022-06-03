import { Point, Point4, Rectangle } from '@use-gpu/core/types';
import { AutoPoint, Direction, LayoutElement, LayoutRenderer, LayoutPicker, Margin } from '../types';
import { isHorizontal, mergeMargin } from './util';

const isNotAbsolute = (el: LayoutElement) => !el.absolute;

export const getBlockMinMax = (
  els: LayoutElement[],
  fixed: [number | null, number | null],
  direction: Direction,
) => {
  if (fixed[0] != null && fixed[1] != null) {
    return [fixed[0], fixed[1], fixed[0], fixed[1]];
  }

  const isX = isHorizontal(direction);
  
  let allMinX = 0;
  let allMinY = 0;
  let allMaxX = 0;
  let allMaxY = 0;

  let i = 0;
  let m = 0;

  const n = els.length;
  if (isX) for (const {sizing, margin, absolute} of els) {
    if (!absolute) {
      const [minX, minY, maxX, maxY] = sizing;
      const [ml, mt, mr, mb] = margin;
    
      allMinX = allMinX + minX;
      allMinY = Math.max(allMinY, minY + mt + mb);

      allMaxX = allMaxX + maxX;
      allMaxY = Math.max(allMaxY, maxY + mt + mb);

      if (i !== 0) {
        m = mergeMargin(m, ml);
        allMinX = allMinX + m;
        allMaxX = allMaxX + m;
      }
      m = mr;
      ++i;
    }
  }
  else for (const {sizing, margin, absolute} of els) {
    if (!absolute) {
      const [minX, minY, maxX, maxY] = sizing;
      const [ml, mt, mr, mb] = margin;

      allMinY = allMinY + minY;
      allMinX = Math.max(allMinX, minX + ml + mr);

      allMaxY = allMaxY + maxY;
      allMaxX = Math.max(allMaxX, maxX + ml + mr);

      if (i !== 0) {
        m = mergeMargin(m, mt);
        allMinY = allMinY + m;
        allMaxY = allMaxY + m;
      }
      m = mb;
      ++i;
    }
  }

  if (fixed[0] != null) {
    allMinX = fixed[0];
    allMaxX = fixed[0];
  }
  if (fixed[1] != null) {
    allMinY = fixed[1];
    allMaxY = fixed[1];
  }

  return [allMinX, allMinY, allMaxX, allMaxY];
}

export const getBlockMargin = (
  els: LayoutElement[],
  margin: Margin,
  padding: Margin,
  direction: Direction,
  contain: boolean,
) => {
  const isX = isHorizontal(direction);
  const [pl, pt, pr, pb] = padding;

  const first = els.find(isNotAbsolute);
  const last  = (els as any).findLast(isNotAbsolute);

  const out = margin.slice() as Margin;
  if (!contain && first) {
    const [ml, mt] = first.margin;
    if (isX) out[0] = mergeMargin(out[0], Math.max(0, ml - pl));
    else out[1] = mergeMargin(out[1], Math.max(0, mt - pt));
  }
  if (!contain && last) {
    const [,, mr, mb] = last.margin;
    if (isX) out[2] = mergeMargin(out[2], Math.max(0, mr - pr));
    else out[3] = mergeMargin(out[3], Math.max(0, mb - pb));
  }

  return out;
}

export const fitBlock = (
  els: LayoutElement[],
  into: AutoPoint,
  fixed: AutoPoint,
  padding: Point4,
  direction: Direction,
  contain: boolean,
  shrinkWrap?: boolean,
) => {
  const isX = isHorizontal(direction);
  const [pl, pt, pr, pb] = padding;

  // Track growing width and height
  let w = 0;
  let h = 0;

  let i = 0;
  let m = 0;

  // Resolved fit size
  const resolved = [
    (fixed[0] != null) ? (!isX && into[0] != null ? Math.min(fixed[0], into[0]) : fixed[0]) : into[0],
    (fixed[1] != null) ? ( isX && into[1] != null ? Math.min(fixed[1], into[1]) : fixed[1]) : into[1],
  ] as AutoPoint;

  if (shrinkWrap) {
    if (!isX && fixed[0] == null) resolved[0] = Math.min(into[0] ?? Infinity, els.reduce((a, b) => Math.max(a, b.sizing[0]), 0));
    if ( isX && fixed[1] == null) resolved[1] = Math.min(into[1] ?? Infinity, els.reduce((a, b) => Math.max(a, b.sizing[1]), 0));
  }

  const relativeFit = [
     isX ? null : resolved[0] != null ? resolved[0] - (pl + pr) : null,
    !isX ? null : resolved[1] != null ? resolved[1] - (pt + pb) : null,
  ] as AutoPoint;

  const sizes = [] as Point[];
  const offsets = [] as Point[];
  const renders = [] as LayoutRenderer[];
  const pickers = [] as LayoutPicker[];

  for (const el of els) if (!el.absolute && !el.stretch) {
    const {margin, fit, sizing} = el;
    const [ml, mt, mr, mb] = margin;

    const size = relativeFit.slice() as AutoPoint;
    if (isX) {
      if (size[1] != null) size[1] -= mt + mb;
    }
    else {
      if (size[0] != null) size[0] -= ml + mr;
    }

    console.log('block fit', size)
    const {render, pick, size: fitted} = fit(size);

    sizes.push(fitted);
    renders.push(render);
    pickers.push(pick);

    if (isX) {
      if (contain || i !== 0) w += mergeMargin(m, ml);
      m = mr;

      offsets.push([w + pl, pt + mt]);
      w += fitted[0];
      h = Math.max(h, mt + fitted[1] + mb);
    }
    else {
      if (contain || i !== 0) h += mergeMargin(m, mt);
      m = mb;

      offsets.push([pl + ml, h + pt]);
      h += fitted[1];
      w = Math.max(w, ml + fitted[0] + mr);
    }
    ++i;
  }
  
  if (contain && m) {
    if (isX) w += m;
    else h += m;
  }

  for (const el of els) if (el.stretch) {
    const {margin, fit, under} = el;
    const [ml, mt, mr, mb] = margin;

    const size = resolved.slice() as Point;
    if (size[0] != null) size[0] -= ml + mr;
    if (size[1] != null) size[1] -= mt + mb;

    const {render, pick, size: fitted} = fit(size);

    let ew = fitted[0] + ml + mr;
    let eh = fitted[1] + mt + mb;

    if (resolved[0] != null) ew = Math.min(ew, resolved[0]);
    if (resolved[1] != null) eh = Math.min(eh, resolved[1]);

    if (isX) w = Math.max(ew, fitted[0]);
    else h = Math.max(eh, fitted[1]);

    sizes.push([ew - ml - mr, eh - mt - mb]);
    renders.push(render);
    pickers.push(pick);
    offsets.push([ml, mt]);
  }

  if (resolved[0] == null) resolved[0] = w + pl + pr;
  if (resolved[1] == null) resolved[1] = h + pt + pb;

  for (const el of els) if (el.absolute) {
    const {margin, fit, under} = el;
    const [ml, mt, mr, mb] = margin;

    const size = resolved.slice() as Point;
    size[0] -= ml + mr;
    size[1] -= mt + mb;

    const {render, pick, size: fitted} = fit(size);
    
    if (under) {
      sizes.unshift(fitted);
      renders.unshift(render);
      pickers.unshift(pick);
      offsets.unshift([ml, mt]);
    }
    else {
      sizes.push(fitted);
      renders.push(render);
      pickers.push(pick);
      offsets.push([ml, mt]);
    }
  }

  return {
    size: resolved,
    sizes,
    offsets,
    renders,
    pickers,
  };
}
