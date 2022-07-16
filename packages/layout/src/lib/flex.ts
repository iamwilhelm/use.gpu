import { Point, Point4, Rectangle } from '@use-gpu/core/types';
import { LayoutElement, LayoutRenderer, LayoutPicker, Direction, AutoPoint, Margin, Alignment, Anchor } from '../types';

import { makeFlexCursor } from './cursor';
import { isHorizontal, getAlignmentAnchor, getAlignmentSpacing } from './util';

export const getFlexMinMax = (
  els: LayoutElement[],
  fixed: [number | null, number | null],
  direction: Direction,
  gap: Point,
  wrap: boolean,
  snap: boolean,
) => {
  if (fixed[0] != null && fixed[1] != null) {
    if (snap) return [Math.round(fixed[0]), Math.round(fixed[1]), Math.round(fixed[0]), Math.round(fixed[1])];
    return [fixed[0], fixed[1], fixed[0], fixed[1]];
  }

  const isX = isHorizontal(direction);
  const [gapX, gapY] = gap;

  let allMinMain = 0;

  let i = 0;
  let caretMain = 0;
  let caretCross = 0;

  const n = els.length;
  for (const {sizing, margin, absolute} of els) {
    const [minX, minY, maxX, maxY] = sizing;
    const [ml, mt, mr, mb] = margin;

    const mx = ml + mr;
    const my = mt + mb;

    const advance = isX ? maxX + mx : maxY + my;
    const trim = isX ? gapX : gapY;
    caretMain += advance + trim;
    caretCross = Math.max(caretCross, isX ? maxY + my : maxX + mx);

    allMinMain = Math.max(allMinMain, advance);
  }
  const allMaxMain = caretMain - (isX ? gapX : gapY);

  let allMinX = isX ? allMinMain : null;
  let allMinY = isX ? null : allMinMain;

  let allMaxX = isX ? allMaxMain : caretCross;
  let allMaxY = isX ? caretCross : allMaxMain;

  if (fixed[0] != null) {
    allMinX = fixed[0];
    allMaxX = fixed[0];
  }
  if (fixed[1] != null) {
    allMinY = fixed[1];
    allMaxY = fixed[1];
  }

  if (snap) {
    if (allMinX != null) allMinX = Math.round(allMinX);
    if (allMinY != null) allMinY = Math.round(allMinY);
    if (allMaxX != null) allMaxX = Math.round(allMaxX);
    if (allMaxY != null) allMaxY = Math.round(allMaxY);
  }

  return [allMinX, allMinY, allMaxX, allMaxY];
}

export const fitFlex = (
  els: LayoutElement[],
  into: AutoPoint,
  fixed: AutoPoint,
  direction: Direction,
  gap: Point,
  alignX: Alignment,
  alignY: Alignment,
  anchor: Anchor,
  wrap: boolean,
  snap: boolean,
) => {
  const isX = isHorizontal(direction);

  const [gapX, gapY] = gap;
  const gapMain = isX ? gapX : gapY;
  const gapCross = isX ? gapY : gapX;

  const alignMain = isX ? alignX : alignY;
  const alignCross = isX ? alignY : alignX;
  const anchorRatio = getAlignmentAnchor(anchor);

  const isSnap = !!snap;
  const isWrap = !!wrap;

  const containX = (fixed[0] != null) ? (into[0] != null ? Math.min(fixed[0], into[0]) : fixed[0]) : into[0];
  const containY = (fixed[1] != null) ? (into[1] != null ? Math.min(fixed[1], into[1]) : fixed[1]) : into[1];

  const spaceMain  = isX ? containX : containY;
  const spaceCross = isX ? containY : containX;
  const isMainFixed = spaceMain != null;
  const isCrossFixed = spaceCross != null;

  const sizes   = [] as Point[];
  const offsets = [] as Point[];
  const renders = [] as LayoutRenderer[];
  const pickers = [] as (LayoutPicker | null | undefined)[];

  const cursor = makeFlexCursor(spaceMain, alignMain, wrap);
  
  for (const el of els) if (!el.absolute) {
    const {margin, sizing, fit, grow, shrink, ratioX, ratioY} = el;
    const [ml, mt, mr, mb] = margin;

    const m = isX ? ml + mr : mt + mb;

    let basis: number | null = null;
    if       (isX) { if (ratioX != null && spaceMain != null) basis = spaceMain * ratioX; }
    else if (!isX) { if (ratioY != null && spaceMain != null) basis = spaceMain * ratioY; }

    const driver = isX ? sizing[0] : sizing[1];
    if (!basis) {
      if (!driver) {
        const into = [containX, containY] as AutoPoint;
        const {size} = fit(into);
        basis = size[isX ? 0 : 1];
      }
      else {
        basis = isX ? sizing[2] : sizing[3];
      }
    }

    if (snap) basis = Math.round(basis);
    cursor.push(basis!, m, gapMain, grow || 0, shrink || 0);
  }
  
  let caretCross = 0;
  const maxMain = cursor.gather((flexed, start, end, gap, lead) => {    
    let caretMain = lead;
    let maxCross = 0;

    const cc = isSnap ? Math.round(caretCross) : caretCross;

    for (let i = start; i < end; ++i) {
      const {margin, fit, ratioX, ratioY} = els[i];
      const [ml, mt, mr, mb] = margin;

      const mx = ml + mr;
      const my = mt + mb;

      let cm = isSnap ? Math.round(caretMain) : caretMain;
      let mainSize = isSnap ? Math.round(flexed[i]) : flexed[i];

      const into = (isX
        ? [mainSize, containY != null ? containY - my : null]
        : [containX != null ? containX - mx : null, mainSize]
      ) as AutoPoint;
      if (ratioX != null && into[0] != null) into[0] /= ratioX;
      if (ratioY != null && into[1] != null) into[1] /= ratioY;
      const {size, render, pick} = fit(into);

      maxCross = Math.max(maxCross, isX ? size[1] + my : size[0] + mx);
      size[isX ? 0 : 1] = mainSize;

      sizes.push(size);
      offsets.push(isX ? [ml + cm, mt + cc] : [ml + cc, mt + cm]);
      renders.push(render);
      pickers.push(pick);

      caretMain += mainSize + gapMain + gap + (isX ? mx : my);
    }

    for (let i = start; i < end; ++i) {
      const {flex, margin} = els[i];
      const [ml, mt, mr, mb] = margin;
      const m = isX ? ml + mr : mt + mb;

      const resolvedAnchor = flex ?? anchor;
      const [gap, lead] = getAlignmentSpacing(maxCross - sizes[i][isX ? 1 : 0] - m, 1, false, resolvedAnchor as any);
      offsets[i][isX ? 1 : 0] += lead;
    }
    
    caretCross += maxCross + gapCross;
  });
  caretCross -= gapCross;
  
  const size = [
    isX ? (containX ?? maxMain) : caretCross,
    isX ? caretCross : (containY ?? maxMain),
  ] as Point;

  return {
    size,
    sizes,
    offsets,
    renders,
    pickers,
  };
}

// Grow all applicable blocks in a row to add extra slack.
export const growRow = (slack: number, row: LayoutElement[], sizes: number[]) => {
  const n = row.length;

  let weight = 0;
  for (let i = 0; i < n; ++i) if (row[i].grow! > 0) weight += row[i].grow!;

  if (weight > 0) {
    for (let i = 0; i < n; ++i) if (row[i].grow! > 0) {
      sizes[i] += slack * row[i].grow! / weight;
    }
    return true;
  }
  return false;
}

// Shrink all applicable blocks in a row to remove excess slack.
export const shrinkRow = (slack: number, row: LayoutElement[], sizes: number[]): boolean => {
  const n = row.length;

  let weight = 0;
  for (let i = 0; i < n; ++i) if (row[i].shrink!) weight += row[i].shrink! * sizes[i];

  if (weight > 0) {
    let negative = 0;
    for (let i = 0; i < n; ++i) if (row[i].shrink! > 0 && sizes[i]) {
      sizes[i] += slack * row[i].shrink! * sizes[i] / weight;
      if (sizes[i] < 0) {
        negative += sizes[i];
        sizes[i] = 0;
      }
    }
    if (negative) {
      shrinkRow(negative, row, sizes);
    }
    return true;
  }
  return false;
}
