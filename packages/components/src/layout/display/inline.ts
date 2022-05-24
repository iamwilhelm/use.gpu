import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { InlineElement, LayoutPicker, LayoutRenderer, AutoPoint, Point, Rectangle, Alignment, Base, Margin } from '../types';
import { ShaderModule } from '@use-gpu/shader/types';

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
    const blockEls = inlineEls.filter(el=> !!el.block);

    const sizing = getInlineMinMax(inlineEls, direction, wrap, snap);

    return yeet({
      sizing,
      margin,
      grow,
      shrink,
      fit: memoFit((into: AutoPoint) => {
        const {size, sizes, ranges, offsets, anchors, renders, pickers} = fitInline(inlineEls, into, direction, align, anchor, wrap, snap);

        const blockSizes: Point[] = [];
        const blockOffsets: Point[] = [];
        const blockRenders: LayoutRenderer[] = [];
        const blockPickers: LayoutPicker[] = [];

        let i = 0;
        for (const el of blockEls) {
          const {block} = el;
          const {size, render, pick} = block!;

          blockSizes.push(size);
          blockOffsets.push(anchors[i++]);
          blockRenders.push(render);
          blockPickers.push(pick);
        }
        
        inspect({
          layout: {
            into,
            size,
            sizes,
            offsets,
          },
        });
        
        const pickSizes   = blockSizes.length ? [...sizes,   ...blockSizes] : [];
        const pickOffsets = blockSizes.length ? [...offsets, ...blockOffsets] : [];
        const pickPickers = blockSizes.length ? [...pickers, ...blockPickers] : [];

        return {
          size,
          render: (
            box: Rectangle,
            clip?: ShaderModule,
            transform?: ShaderModule,
          ) => {
            const out = makeInlineLayout(ranges, offsets, renders)(box, clip, transform);
            if (sizes.length) out.push(...makeBoxLayout(blockSizes, blockOffsets, blockRenders)(box, clip, transform));
            return out;
          },
          pick: makeBoxPicker(id, pickSizes, pickOffsets, pickPickers),
        };
      })
    });
  };
  
  return children ? gather(children, Resume) : null;
}, 'Inline');
