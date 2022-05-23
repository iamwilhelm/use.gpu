import { InlineElement, InlineRenderer, LayoutPicker, Direction, Point, Point4, Margin, Rectangle, Alignment, Anchor, Base } from '../types';

import { parseBase, parseAnchor } from './util';
import { makeLayoutCursor, getAlignmentSpacing } from './cursor';

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
  for (const {spans, height, absolute} of els) {
    if (!absolute) {
      lineHeight = height.lineHeight;
      spans.iterate(perSpan);
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
  const offsets = [] as [number, number, number][];
  const renders = [] as InlineRenderer[];
  const pickers = [] as LayoutPicker[];

  // Push all text spans into layout
  const cursor = makeLayoutCursor(wrap ? spaceMain || 0 : 0, align);

  for (const el of els) {
    const {spans, absolute, height: {lineHeight, baseline}} = el;
    spans.iterate((advance, trim, hard) => cursor.push(advance, trim, hard, lineHeight, baseline));
  }

  // Process produced spans
  let i = 0;
  let span = 0;
  const layouts = cursor.gather((start, end, lead, gap, count, cross, base, index) => {
    let n = end - start;
    let mainPos = lead;

    while (n > 0 && i < els.length) {
      const el = els[i];
      const {spans, height, render/*, pick*/} = el;
      const {baseline, lineHeight} = height;

      const crossPos = anchor === 'base'
        ? caretCross + base - baseline
        : caretCross + getAlignmentSpacing(Math.max(0, cross - lineHeight), 1, false, anchor as Anchor)[1];

      const offset = (isX ? [mainPos, crossPos, gap] : [crossPos, mainPos, gap]) as [number, number, number];

      const count = Math.min(n, spans.length - span);
      const s = span;
      const e = span + count;
      spans.iterate((advance) => mainPos += advance, s, e);
      mainPos += count * gap;

      ranges.push([s, e]);
      offsets.push(offset);
      renders.push(render);
      //pickers.push(pick);
      
      span += count;
      n -= count;
      
      if (count === spans.length - span) {
        i++;
        span = 0;
      }
    }

    maxMain = Math.max(maxMain - gap, 0);
    caretCross += cross;
  });
  
  const size = isX ? [into[0] ?? maxMain, caretCross] : [caretCross, into[1] ?? maxMain];
  
  return {
    size,
    ranges,
    offsets,
    renders,
    pickers,
  };
}
