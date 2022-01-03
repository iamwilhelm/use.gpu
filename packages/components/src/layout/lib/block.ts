import { LiveElement } from '@use-gpu/live/types';
import { Point, LayoutElement, LayoutRenderer, Margin, Rectangle } from '../types';
import { mergeMargin } from './util';

const isAbsolute = (el: LayoutElement) => !!el.absolute;
const isNotAbsolute = (el: LayoutElement) => !el.absolute;

export const getBlockMinMax = (
  els: LayoutElement[],
  direction: 'x' | 'y',
) => {
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

  return [allMinX, allMinY, allMaxX, allMaxY];
}

export const getBlockMargin = (
  els: LayoutElement[],
  margin: Margin,
  direction: 'x' | 'y',
) => {
  const isX = direction === 'x';

  const first = els.find(isNotAbsolute);
  const last  = (els as any).findLast(isNotAbsolute);

  const out = margin.slice() as Margin;
  if (first) {
    const [ml, mt] = first.margin;
    if (isX) margin[0] = mergeMargin(margin[0], ml);
    else margin[1] = mergeMargin(margin[1], mt);
  }
  if (last) {
    const [,, mr, mb] = last.margin;
    if (isX) margin[2] = mergeMargin(margin[2], mr);
    else margin[3] = mergeMargin(margin[3], mb);
  }

  return margin;
}

export const fitBlocks = (
  els: LayoutElement[],
  size: Point,
  direction: 'x' | 'y',
) => {
  const isX = direction === 'x';

  let w =  isX ? 0 : size[0];
  let h = !isX ? 0 : size[1];

  let i = 0;
  let m = 0;

  const sizes = [] as Point[];
  const offsets = [] as Point[];
  const renders = [] as LayoutRenderer[];

  for (const el of els) {
    const {margin, fit} = el;
    const {render, size: fitted} = fit(size);
    const [ml, mt, mr, mb] = margin;

    sizes.push(fitted);
    renders.push(render);

    if (isAbsolute(el)) {
      if (isX) {
        offsets.push([w, mt]);
      }
      else {
        offsets.push([ml, h]);
      }
    }
    else {
      if (isX) {
        if (i !== 0) w += Math.max(m, ml);
        m = mr;

        offsets.push([w, mt]);
        w += fitted[0];
      }
      else {
        if (i !== 0) h += Math.max(m, mt);
        m = mb;

        offsets.push([ml, h]);
        h += fitted[1];
      }
      ++i;
    }
  }
  
  return {
    size,
    sizes,
    offsets,
    renders,
  };
}
