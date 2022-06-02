import { Alignment } from '../types';

import { makeTuples } from '@use-gpu/core';
import { evaluateAnchor } from '../parse';

type Reduce = (
  start: number,
  end: number,
  gap: number,
  lead: number,
  count: number,
  cross: number,
  ascent: number,
  descent: number,
  xHeight: number,
  index: number,
) => void;

type LayoutCursor = {
  push: (
    advance: number,
    trim: number,
    hard: number,
    cross: number,
    base: number,
    descent: number,
    xHeight: number,
  ) => void;
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
  let spanAscent = 0;
  let spanDescent = 0;
  let spanXHeight = 0;

  let start: number = 0;
  let end: number = 0;
  
  let chunkAdvance = 0;
  let chunkIndex = 0;
  let chunkCross = 0;

  let rows: number[] = [];
  let sizes: number[] = [];
  let index = 0;

  const push = (
    advance: number,
    trim: number,
    hard: number,
    cross: number,
    ascent: number,
    descent: number,
    xHeight: number,
  ) => {
    if (max > 0 && (spanAdvance + advance - trim > max)) {
      flush(0);
      start = index;
    }

    end = index + 1;

    if (hard) {
      spanCount++;
    }
    else if (trim) {
      spanCount++;
      spanTrim = trim;
    }
    spanAdvance += advance;
    spanCross = Math.max(spanCross, cross);
    spanAscent = Math.max(spanAscent, ascent);
    spanDescent = Math.max(spanDescent, descent);
    spanXHeight = Math.max(spanXHeight, xHeight);

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

      rows.push(start, end, hard, spanSize, spanCount, spanCross, spanAscent, spanDescent, spanXHeight, chunkIndex);
      chunkCross += spanCross;
    }

    spanCount = 0;
    spanAdvance = 0;
    spanTrim = 0;
    spanCross = 0;
    spanAscent = 0;
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
    const r = makeTuples(rows, 10);
    r.iterate((
      start: number,
      end: number,
      hard: number,
      advance: number,
      count: number,
      cross: number,
      ascent: number,
      descent: number,
      xHeight: number,
      index: number,
    ) => {
      const slack = (max || s.get(index, 0)) - advance;
      const [gap, lead] = getAlignmentSpacing(slack, count, !!hard, align);
      reduce(start, end, gap, lead, count, cross, ascent, descent, xHeight, index);
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
