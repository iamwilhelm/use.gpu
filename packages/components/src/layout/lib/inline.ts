import { LiveElement } from '@use-gpu/live/types';
import { FontMetrics } from '@use-gpu/text/types';
import { LayoutElement, InlineElement, LayoutRenderer, LayoutPicker, Direction, Point, Margin, Rectangle, Alignment, Base } from '../types';

import { parseBase, parseAnchor } from './util';
import { getAlignmentSpacing } from './cursor';

export const getInlineMinMax = (
  els: (LayoutElement | InlineElement)[],
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
  els: LayoutElement[],
  into: Point,
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

  const spaceMain  = isX ? into[0] : into[1];
  const spaceCross = isX ? into[1] : into[0];

  let caretMain = 0;
  let caretCross = 0;
  let trimMain = 0;
  let trimCross = 0;

  const n = els.length;

  let mainBase = 0;
  let mainSize = 0;
  let crossSize = 0;
  let wordCount = 0;

  const ranges  = [] as Point[];
  const offsets = [] as [number, number, number][];
  const renders = [] as LayoutRenderer[];
  const pickers = [] as LayoutPicker[];

  const mainSpans = [] as [number, number, number, number];
  const mainEls = [] as InlineElement[];

  const reduceMain = (hard: boolean) => {
    const n = mainEls.length;
    if (!n) return;

    const slack = spaceMain - (caretMain - trimMain);

    let mainGap = 0;
    let mainPos = 0;
    if (slack) [mainGap, mainPos] = getAlignmentSpacing(slack, wordCount, hard, align);

    for (let i = 0; i < n; ++i) {
      const span = mainSpans[i];
      const [startIndex, endIndex, chunkAdvance, chunkCount] = span;

      const {spans, height, render, pick} = mainEls[i];
      const {ascent, descent, lineHeight} = height;

      const crossPos = caretCross + mainBase - ascent;
      const offset = isX ? [mainPos, crossPos, mainGap] : [crossPos, mainPos, mainGap];

      mainPos += chunkAdvance + chunkCount * mainGap;

      ranges.push(span);
      offsets.push(offset);
      renders.push(render);
      pickers.push(pick);
    }

    caretMain = 0;
    caretCross += crossSize;

    mainBase = 0;
    mainSize = 0;
    trimMain = 0;
    crossSize = 0;
    wordCount = 0;
  
    mainSpans.length = 0;
    mainEls.length = 0;
  };

  const addSpan = (el: InlineElement, startIndex: number, endIndex: number, chunkAdvance: number, chunkCount: number) => {
    if (startIndex === endIndex) return;

    const {height: {ascent, descent, lineHeight}} = el;

    mainBase = Math.max(mainBase, ascent);
    mainSize = Math.max(mainSize, ascent - descent);
    crossSize = Math.max(crossSize, lineHeight);

    mainSpans.push([startIndex, endIndex, chunkAdvance, chunkCount]);
    mainEls.push(el);
  };

  for (const el of els) {
    let startIndex = 0;
    let endIndex = 0;
    let chunkCount = 0;
    let chunkAdvance = 0;

    let i = 0;
    const {spans, absolute} = el;
    spans.iterate((advance, trim, hard) => {
      if (wrap && (caretMain + advance - trim > spaceMain)) {
        addSpan(el, startIndex, endIndex, chunkAdvance, chunkCount);
        reduceMain(false);
        startIndex = i;
        chunkCount = 0;
        chunkAdvance = 0;
      }

      endIndex = ++i;
      caretMain += advance;
      chunkAdvance += advance;

      trimMain = trim;
      if (trim || hard) {
        wordCount++;
        chunkCount++;
      }

      if (hard) {
        addSpan(el, startIndex, endIndex, chunkAdvance, chunkCount);
        reduceMain(true);

        startIndex = endIndex;
        chunkCount = 0;
        chunkAdvance = 0;
      }
    });

    addSpan(el, startIndex, endIndex, chunkAdvance, chunkCount);
  }
  reduceMain(true);
  
  const size = isX ? [into[0], caretCross] : [caretCross, into[1]];
  
  return {
    size,
    ranges,
    offsets,
    renders,
    pickers,
  };
}

export const getInlineSpacing = (
  slack: number,
  n: number,
  align: Alignment,
) => {
  let gap = 0;
  let lead = 0;

  const isJustify = align === 'justify';
  const isBetween = align === 'between';
  const isEvenly  = align === 'evenly';

  if (slack > 0 && (isEvenly || isBetween || isJustify)) {
    if (n === 1) {
      lead = slack / 2;
    }
    else if (isEvenly) {
      gap = Math.max(0, slack / (n + 1));
      lead = gap;
    }
    else if (isBetween) {
      gap = Math.max(0, slack / n);
      lead = gap / 2;
    }
    else if (isJustify) {
      gap = Math.max(0, slack / Math.max(1, n - 1));
    }
  }
  else {
    lead = parseAnchor(align) * slack;
  }

  return [gap, lead];
};
