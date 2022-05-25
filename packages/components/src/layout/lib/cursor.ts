import { Alignment } from '../types';

import { makeTuples } from '@use-gpu/core';
import { evaluateAnchor } from '../parse';

type Reduce = (start: number, end: number, gap: number, lead: number, count: number, cross: number, ascent: number, descent: number, index: number) => void;

type LayoutCursor = {
  push: (advance: number, trim: number, hard: number, cross?: number, base?: number, descent?: number) => void,
  flush: (x: number) => void,
  gather: (reduce: Reduce) => Float32Array,
};

// Layout cursor for putting inline items on lines, with line wrapping, alignment and justification.
export const makeLayoutCursor = (
  max: number,
  align: Alignment,
): LayoutCursor => {

  let spanCount = 0;
  let spanAdvance = 0;
  let spanTrim = 0;
  let spanCross = 0;
  let spanBase = 0;
  let spanDescent = 0;

  let start: number = 0;
  let end: number = 0;
  
  let chunkAdvance = 0;
  let chunkIndex = 0;
  let chunkCross = 0;

  let rows: number[] = [];
  let sizes: number[] = [];
  let index = 0;

  const push = (advance: number, trim: number, hard: number, cross: number = 0, base: number = 0, descent: number = 0) => {
    if (max > 0 && (spanAdvance + advance - trim > max)) {
      flush(0);
      start = index;
    }

    end = index + 1;

    if (trim) {
      spanCount++;
      spanTrim = trim;
    }
    spanAdvance += advance;
    spanCross = Math.max(spanCross, cross);
    spanBase = Math.max(spanBase, base);
    spanDescent = Math.max(spanDescent, descent);

    if (hard) {
      flush(hard);
      start = end;
    }

    index++;
  };

  const flush = (hard: number) => {
    const n = end > start;
    if (n) {
      const spanSize = spanAdvance - spanTrim;
      chunkAdvance = Math.max(chunkAdvance, spanSize);

      rows.push(start, end, hard, spanSize, spanCount, spanCross, spanBase, spanDescent, chunkIndex);
      chunkCross += spanCross;
    }

    spanCount = 0;
    spanAdvance = 0;
    spanTrim = 0;
    spanCross = 0;
    spanBase = 0;
    spanDescent = 0;

    if (hard === 2) {
      chunkIndex++;
      sizes.push(chunkAdvance, chunkCross);

      chunkAdvance = 0;
      chunkCross = 0;
    }
  };
  
  const gather = (reduce: Reduce) => {
    flush(2);

    const s = makeTuples(sizes, 2);
    const r = makeTuples(rows, 9);
    r.iterate((start: number, end: number, hard: number, advance: number, count: number, cross: number, base: number, descent: number, index: number) => {
      const slack = (max || s.get(index, 0)) - advance;
      const [gap, lead] = getAlignmentSpacing(slack, count, !!hard, align);
      reduce(start, end, gap, lead, count, cross, base, descent, index);
    });

    return new Float32Array(sizes);
  };

  return { push, flush, gather };
}

export const getAlignmentSpacing = (
  slack: number,
  n: number,
  hard: boolean,
  align: Alignment,
) => {
  let gap = 0;
  let lead = 0;

  const isJustifyStart  = align === 'justify-start';
  const isJustifyCenter = align === 'justify-center';
  const isJustifyEnd    = align === 'justify-end';

  const isJustify = align === 'justify' ||
                    ((isJustifyStart || isJustifyCenter || isJustifyEnd) && !hard);
  const isBetween = align === 'between';
  const isEvenly  = align === 'evenly';

  if (slack > 0) {
    if (isEvenly || isBetween || isJustify) {
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
      lead = evaluateAnchor(align) * slack;
    }
  }

  return [gap, lead];
};
