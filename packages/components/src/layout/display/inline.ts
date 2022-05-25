import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { Point, Rectangle } from '@use-gpu/core/types';
import { InlineElement, LayoutPicker, LayoutRenderer, AutoPoint, Direction, Alignment, Base, MarginLike } from '../types';
import { ShaderModule } from '@use-gpu/shader/types';

import { memo, gather, yeet, useFiber, useOne } from '@use-gpu/live';
import { getInlineMinMax, fitInline, resolveInlineBlockElements } from '../lib/inline';
import { makeInlineLayout, makeBoxLayout, makeBoxPicker, memoFit } from '../lib/util';
import { useInspectable } from '../../hooks/useInspectable'
import { useProp } from '../../traits/useProp';
import { BoxTrait } from '../types';
import { useBoxTrait } from '../traits';
import { parseAlignment, parseAnchor, parseDirectionX, parseMargin } from '../parse';

export type InlineProps = BoxTrait & {
  direction?: 'x' | 'y',

  align?: Alignment,
  anchor?: Base,
  padding?: MarginLike,

  wrap?: boolean,
  snap?: boolean,
  children?: LiveElement<any>,
};

export const Inline: LiveComponent<InlineProps> = memo((props: InlineProps) => {
  const {
    wrap = true,
    snap = true,
    children,
  } = props;

  const { margin, grow, shrink } = useBoxTrait(props);

  const direction = useProp(props.direction, parseDirectionX);
  const padding = useProp(props.padding, parseMargin);
  const anchor = useProp(props.anchor, parseAnchor);
  const align = useProp(props.align, parseAlignment);

  const {id} = useFiber();
  const inspect = useInspectable();
  if (margin === undefined) debugger

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
          pick: makeBoxPicker(id, pickSizes, pickOffsets as any, pickPickers),
        };
      })
    });
  };
  
  return children ? gather(children, Resume) : null;
}, 'Inline');
