import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { InlineElement, Point, Alignment, Base, Margin } from '../types';

import { memo, gather, yeet, useOne } from '@use-gpu/live';
import { getInlineMinMax, fitInline } from '../lib/inline';
import { normalizeMargin, makeInlineLayout, parseDimension, memoFit } from '../lib/util';

export type InlineProps = {
  direction?: 'x' | 'y',
  align?: Alignment,
  anchor?: Base,

  grow?: number,
  shrink?: number,
  margin?: number | Margin,
  padding?: number | Margin,
  wrap?: boolean,
  snap?: boolean,

  element?: LiveElement<any>,
  children?: LiveElement<any>,
};

export const Inline: LiveComponent<InlineProps> = memo((props: InlineProps) => {
  const {
    direction = 'x',
    align = 'start',
    anchor = 'base',
    grow = 1,
    shrink = 1,
    wrap = true,
    snap = true,
    margin: m = 0,
    padding: p = 0,
    children,
  } = props;

  const margin = normalizeMargin(m);
  const padding = normalizeMargin(p);

  const Resume = (els: InlineElement[]) => {
    const sizing = getInlineMinMax(els, direction, wrap, snap);

    return yeet({
      sizing,
      margin,
      grow,
      shrink,
      fit: memoFit((into: Point) => {
        const {size, ranges, offsets, renders} = fitInline(els, into, direction, align, anchor, wrap, snap);
        return {
          size,
          render: makeInlineLayout(ranges, offsets, renders),
        };
      })
    });
  };
  
  return children ? gather(children, Resume) : null;
}, 'Inline');
