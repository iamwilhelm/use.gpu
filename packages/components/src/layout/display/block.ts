import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { Point, Point4 } from '@use-gpu/core/types';
import { LayoutElement, AutoPoint, Dimension, Direction, MarginLike, Margin } from '../types';

import { use, memo, gather, yeet, useFiber } from '@use-gpu/live';
import { getBlockMinMax, getBlockMargin, fitBlock } from '../lib/block';
import { isHorizontal, makeBoxLayout, makeBoxPicker, memoFit } from '../lib/util';
import { useInspectable } from '../../hooks/useInspectable';

import { BoxTrait, ElementTrait } from '../types';
import { useBoxTrait, useElementTrait } from '../traits';
import { evaluateDimension, parseDirectionY, parseMargin } from '../parse';
import { useProp } from '../../traits/useProp';
import { Element } from '../element/element';

export type BlockProps =
  Partial<BoxTrait> &
  Partial<ElementTrait> &
{
  direction?: Direction,
  
  padding?: MarginLike,
  snap?: boolean,
  contain?: boolean,

  children?: LiveElement<any>,
};

export const Block: LiveComponent<BlockProps> = memo((props: BlockProps) => {
  const {
    snap = true,
    children,
  } = props;

  const { width, height, radius, border, stroke, fill, image } = useElementTrait(props);
  const { margin: blockMargin, grow, shrink, inline } = useBoxTrait(props);

  const direction = useProp(props.direction, parseDirectionY);
  const padding = useProp(props.padding, parseMargin);

  const contain = props.contain ??
    !!(isHorizontal(direction)
      ? Math.abs(padding[0]) + Math.abs(padding[2])
      : Math.abs(padding[1]) + Math.abs(padding[3]));

  const background = (stroke || fill || image) ? (
    use(Element, {radius, border, stroke, fill, image, absolute: true, under: true})
  ) : null;

  const {id} = useFiber();
  const inspect = useInspectable();

  const Resume = (els: LayoutElement[]) => {
    const w = width != null && width === +width ? width : null;
    const h = height != null && height === +height ? height : null;

    const fixed = [w, h] as [number | null, number | null];

    const sizing = getBlockMinMax(els, fixed, direction);
    const margin = getBlockMargin(els, blockMargin, padding, direction, contain);

    let ratioX = undefined;
    let ratioY = undefined;
    if (typeof width  === 'string') ratioX = evaluateDimension(width,  1, false);
    if (typeof height === 'string') ratioY = evaluateDimension(height, 1, false);

    return yeet({
      sizing,
      margin,
      grow,
      shrink,
      inline,
      ratioX,
      ratioY,
      fit: memoFit((into: AutoPoint) => {
        const w = width != null ? evaluateDimension(width, into[0], snap) : null;
        const h = height != null ? evaluateDimension(height, into[1], snap) : null;
        const fixed = [
          width != null ? w : null,
          height != null ? h : null,
        ] as [number | number, number | null];

        const {size, overflow, sizes, offsets, renders, pickers} = fitBlock(els, into, fixed, padding, direction, contain);

        inspect({
          layout: {
            into,
            size,
            sizes,
            offsets,
          },
        });

        return {
          size,
          render: makeBoxLayout(sizes, offsets, renders),
          pick: makeBoxPicker(id, sizes, offsets, pickers),
        };
      })
    });
  };
  
  const c = background ? (children ? [background, children] : background) : children;
  return gather(c, Resume);
}, 'Block');
