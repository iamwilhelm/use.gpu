import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { InlineElement, LayoutPicker, LayoutRenderer, AutoPoint, Point, Alignment, Base, Margin } from '../types';

import { memo, gather, yeet, useFiber, useOne } from '@use-gpu/live';
import { getInlineMinMax, fitInline, resolveInlineBlockElements } from '../lib/inline';
import { normalizeMargin, makeInlineLayout, makeBoxLayout, makeBoxPicker, parseDimension, memoFit } from '../lib/util';
import { useInspectable } from '../../hooks/useInspectable'

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

  const {id} = useFiber();
  const inspect = useInspectable();

  const Resume = (els: InlineElement[]) => {
    const inlineEls = resolveInlineBlockElements(els, direction);
    const blockEls = inlineEls.filter(el => !!el.block);

    const sizing = getInlineMinMax(inlineEls, direction, wrap, snap);

    return yeet({
      sizing,
      margin,
      grow,
      shrink,
      fit: memoFit((into: AutoPoint) => {
        const {size, ranges, offsets, anchors, renders} = fitInline(inlineEls, into, direction, align, anchor, wrap, snap);

        const sizes: Point[] = [];
        const blockOffsets: Point[] = [];
        const blockRenders: LayoutRenderer[] = [];
        const blockPickers: LayoutPicker[] = [];

        let i = 0;
        for (const el of blockEls) {
          const {size, render, pick} = el.block!;
          sizes.push(size);
          blockOffsets.push(anchors[i++]);
          blockRenders.push(render);
          blockPickers.push(pick);
        }

        inspect({
          layout: {
            into,
            size,
            sizes,
            offsets: blockOffsets,
          },
        });

        return {
          size,
          render: (
            box: Rectangle,
            transform?: ShaderModule,
          ) => {
            const out = makeInlineLayout(ranges, offsets, renders)(box, transform);
            if (sizes.length) out.push(...makeBoxLayout(sizes, blockOffsets, blockRenders)(box, transform));
            return out;
          },
          pick: makeBoxPicker(id, sizes, blockOffsets, blockPickers),
        };
      })
    });
  };
  
  return children ? gather(children, Resume) : null;
}, 'Inline');
