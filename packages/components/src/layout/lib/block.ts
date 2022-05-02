import { LiveElement } from '@use-gpu/live/types';
import { Point, Point4, LayoutElement, LayoutRenderer, LayoutPicker, Margin, Rectangle } from '../types';
import { mergeMargin } from './util';

const isNotAbsolute = (el: LayoutElement) => !el.absolute;

export const getBlockMinMax = (
  els: LayoutElement[],
  fixed: [number | number, number | null],
  direction: 'x' | 'y',
) => {
  if (fixed[0] != null && fixed[1] != null) {
    return [fixed[0], fixed[1], fixed[0], fixed[1]];
  }

  const isX = direction === 'x';
  
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
        allMinX = allMinX + m;
        allMaxX = allMaxX + m;
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
  direction: 'x' | 'y',
  contain: boolean,
) => {
  const isX = direction === 'x';
  const [pl, pt, pr, pb] = padding;

  const first = els.find(isNotAbsolute);
  const last  = (els as any).findLast(isNotAbsolute);

  const out = margin.slice() as Margin;
  if (!contain && first) {
    const [ml, mt] = first.margin;
    if (isX) margin[0] = mergeMargin(margin[0], Math.max(0, ml - pl));
    else margin[1] = mergeMargin(margin[1], Math.max(0, mt - pt));
  }
  if (!contain && last) {
    const [,, mr, mb] = last.margin;
    if (isX) margin[2] = mergeMargin(margin[2], Math.max(0, mr - pr));
    else margin[3] = mergeMargin(margin[3], Math.max(0, mb - pb));
  }

  return margin;
}

export const fitBlock = (
  els: LayoutElement[],
  into: Point,
  fixed: [number | null, number | null],
  padding: Point4,
  direction: 'x' | 'y',
  contain: boolean,
) => {
  const isX = direction === 'x';

  const [pl, pt, pr, pb] = padding;
  let w =  isX ? pl : fixed[0] ?? into[0];
  let h = !isX ? pt : fixed[1] ?? into[1];

  let i = 0;
  let m = 0;

  const resolved = [
    (fixed[0] != null) ? (!isX ? Math.min(fixed[0], into[0]) : fixed[0]) : into[0],
    (fixed[1] != null) ? ( isX ? Math.min(fixed[1], into[1]) : fixed[1]) : into[1],
  ] as Point;

  const sizes = [] as Point[];
  const offsets = [] as Point[];
  const renders = [] as LayoutRenderer[];
  const pickers = [] as LayoutPicker[];

  for (const el of els) if (!el.absolute) {
    const {margin, fit} = el;
    const [ml, mt, mr, mb] = margin;

    const size = resolved.slice() as Point;
    size[0] -= pl + pr;
    size[1] -= pt + pb;

    if (isX) size[1] -= mt + mb;
    else size[0] -= ml + mr;

    const {render, pick, size: fitted} = fit(size);

    sizes.push(fitted);
    renders.push(render);
    pickers.push(pick);

    if (isX) {
      if (contain || i !== 0) w += Math.max(m, ml);
      m = mr;

      offsets.push([w, pt + mt]);
      w += fitted[0];
    }
    else {
      if (contain || i !== 0) h += Math.max(m, mt);
      m = mb;

      offsets.push([pl + ml, h]);
      h += fitted[1];
    }
    ++i;
  }
  
  if (isX) w = fixed[0] != null ? fixed[0] : w + pr;
  else     h = fixed[1] != null ? fixed[1] : h + pb;

  if (isX) resolved[0] = w;
  else resolved[1] = h;

  i = 0;
  for (const el of els) if (el.absolute) {
    const {margin, fit, under} = el;
    const [ml, mt, mr, mb] = margin;

    const size = resolved.slice() as Point;
    if (isX) size[1] -= mt + mb;
    else size[0] -= ml + mr;

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
    size: [w, h],
    sizes,
    offsets,
    renders,
    pickers,
  };
}
