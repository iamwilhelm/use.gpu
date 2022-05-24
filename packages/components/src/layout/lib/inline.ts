import { InlineElement, LayoutElement, InlineRenderer, LayoutRenderer, LayoutPicker, Direction, AutoPoint, Point, Point4, Margin, Rectangle, Alignment, Anchor, Base } from '../types';

import { makeTuples } from '@use-gpu/core';
import { parseBase, parseAnchor } from './util';
import { makeLayoutCursor, getAlignmentSpacing } from './cursor';

const NO_RENDER = () => null;
const NO_MARGIN: Point4 = [0, 0, 0, 0];

export const resolveInlineBlockElements = (els: (InlineElement | LayoutElement)[], direction: Direction) => {

  const into = [null, null] as AutoPoint;

  const isX = direction === 'x' || direction === 'lr' || direction === 'rl';

  const out: InlineElement[] = [];
  for (const el of els) {
    if ('spans' in el) out.push(el);
    else {
      const {fit, absolute, margin} = el;

      const block = fit(into);
      const {size} = block;

      const advance = isX ? size[0] : size[1];
      const cross = isX ? size[1] : size[0];

      out.push({
        spans: makeTuples([advance, 0, 0], 3),
        height: {ascent: 0, descent: 0, lineHeight: cross},
        margin,
        anchor: 'center',
        block,
        absolute,
        render: NO_RENDER,
      })
    }
  }

  return out;
};

export const getInlineMinMax = (
  els: InlineElement[],
  direction: Direction,
  wrap: boolean,
  snap: boolean,
) => {
  const isX = direction === 'x' || direction === 'lr' || direction === 'rl';

  let allMinMain = 0;
  let allMinCross = 0;
  let allMaxMain = 0;
  let allMaxCross = 0;

  let i = 0;
  let caretMain = 0;
  let caretCross = 0;

  let lineHeight = 0;
  const perSpan = (advance: number, trim: number, hard: number) => {
    allMinMain = Math.max(allMinMain, advance - trim);
    allMaxCross += lineHeight;

    caretMain += advance;
    if (hard) {
      caretMain -= trim;
      caretCross += lineHeight;

      allMaxMain = Math.max(allMaxMain, caretMain);
      caretMain = 0;
    }
  };

  const n = els.length;
  for (const {spans, height, margin, absolute} of els) {
    const [ml, mt, mr, mb] = margin ?? NO_MARGIN;
    if (!absolute) {
      lineHeight = height.lineHeight + (isX ? mt + mb : ml + mr);

      caretMain += isX ? ml : mt;
      spans.iterate(perSpan);
      caretMain += isX ? mr : mb;

      ++i;
    }
    if (!wrap) allMinMain = allMaxMain;
    allMinCross = caretCross;
  }

  if (snap) {
    allMinMain = Math.round(allMinMain);
    allMinCross = Math.round(allMinCross);
    allMaxMain = Math.round(allMaxMain);
    allMaxCross = Math.round(allMaxCross);
  }

  return isX
    ? [allMinMain, allMinCross, allMaxMain, allMaxCross]
    : [allMinCross, allMinMain, allMaxCross, allMaxMain];
}

export const fitInline = (
  els: InlineElement[],
  into: AutoPoint,
  direction: Direction,
  align: Alignment,
  anchor: Base,
  wrap: boolean,
  snap: boolean,
) => {
  const isX = direction === 'x' || direction === 'lr' || direction === 'rl';

  const anchorRatio = parseBase(anchor);

  const isSnap = !!snap;
  const isWrap = !!wrap;

  const spaceMain = isX ? into[0] : into[1];

  let caretCross = 0;
  let maxMain = 0;

  const n = els.length;

  const ranges  = [] as Point[];
  const sizes   = [] as Point[];
  const offsets = [] as [number, number, number][];
  const anchors = [] as Point[];
  const renders = [] as InlineRenderer[];
  const pickers = [] as LayoutPicker[];

  // Push all text spans into layout
  const cursor = makeLayoutCursor(wrap ? spaceMain || 0 : 0, align);

  for (const el of els) {
    const {spans, margin, absolute, height: {lineHeight, ascent, descent}} = el;
    const [ml, mt, mr, mb] = margin ?? NO_MARGIN;

    cursor.push(isX ? ml : mt, 0, 0, 0, 0, 0);
    spans.iterate((advance, trim, hard) => {
      cursor.push(advance, trim, hard, lineHeight + (isX ? (mt + mb) : (ml + mr)), ascent, descent);
    });
    cursor.push(isX ? mr : mb, 0, 0, 0, 0, 0);
  }

  // Process produced spans
  let i = 0;
  let span = 0;
  const layouts = cursor.gather((start, end, gap, lead, count, lineHeight, ascent, descent, index) => {
    let n = end - start;
    let mainPos = lead;

    const cross = Math.max(lineHeight, ascent + descent);

    while (n > 0 && i < els.length) {
      const el = els[i];
      const {spans, height, margin, anchor: blockAnchor, block, render, pick} = el;
      const {ascent: a, descent: d, lineHeight} = height;
      const [ml, mt, mr, mb] = margin ?? NO_MARGIN;
      
      const last = spans.length - span + 2;
      const count = Math.min(n, last);

      const indentStart = span  === 0    ? (isX ? ml : mt) : 0;
      const indentEnd   = count === last ? (isX ? mr : mb) : 0;
      mainPos += indentStart;
      
      const crossPos = (blockAnchor ?? anchor) === 'base'
        ? caretCross + ascent - a + getAlignmentSpacing(Math.max(0, cross - lineHeight), 1, false, 'center')[1]
        : caretCross + getAlignmentSpacing(Math.max(0, cross - lineHeight), 1, false, anchor as Anchor)[1];

      const offset = (isX ? [mainPos, crossPos, gap] : [crossPos, mainPos, gap]) as [number, number, number];

      let accum = 0;
      const s = Math.max(1, span) - 1;
      const e = Math.min(spans.length, span + count - 1);
      spans.iterate((advance) => accum += advance, s, e);

      accum += count * gap;
      mainPos += accum;
      mainPos += indentEnd;

      const size = (isX ? [accum, cross] : [cross, accum]) as Point;

      ranges.push([s, e]);
      sizes.push(size);
      offsets.push(offset);
      renders.push(render);
      pickers.push(pick);

      span += count;
      n -= count;
      
      if (count === last) {
        if (block) anchors.push(offset as number[] as Point);
        i++;
        span = 0;
      }
    }

    maxMain = Math.max(maxMain, mainPos - gap, 0);
    caretCross += cross;
  });
  
  const size = isX ? [into[0] ?? maxMain, caretCross] : [caretCross, into[1] ?? maxMain];
  
  return {
    size,
    ranges,
    sizes,
    offsets,
    anchors,
    renders,
    pickers,
  };
}
