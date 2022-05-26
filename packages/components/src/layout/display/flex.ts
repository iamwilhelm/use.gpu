import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { LayoutElement, Margin, Dimension, Direction, Alignment, AlignmentLike, GapLike, Anchor, AutoPoint } from '../types';

import { use, yeet, memo, gather, useFiber } from '@use-gpu/live';
import { getFlexMinMax, fitFlex } from '../lib/flex';
import { makeBoxLayout, makeBoxPicker, memoFit } from '../lib/util';
import { useInspectable } from '../../hooks/useInspectable'
import { useProp } from '../../traits/useProp';
import { BoxTrait, ElementTrait } from '../types';
import { useBoxTrait, useElementTrait } from '../traits';
import { evaluateDimension, parseAlignmentXY, parseAnchor, parseDirectionX, parseGapXY, parseMargin } from '../parse';
import { Element } from '../element/element';

const NO_MARGIN = [0, 0, 0, 0] as Margin;

export type FlexProps =
  Partial<BoxTrait> &
  Partial<ElementTrait> &
{
  direction?: Direction,

  gap?: GapLike,
  align?: AlignmentLike,
  anchor?: Anchor,

  wrap?: boolean,
  snap?: boolean,
  children?: LiveElement<any>,
};

export const Flex: LiveComponent<FlexProps> = memo((props: FlexProps) => {
  const {
    wrap = false,
    snap = true,
    children,
  } = props;

  const { width, height, radius, border, stroke, fill, image } = useElementTrait(props);
  const { margin, grow, shrink, inline } = useBoxTrait(props);

  const direction = useProp(props.direction, parseDirectionX);
  const align     = useProp(props.align, parseAlignmentXY);
  const anchor    = useProp(props.anchor, parseAnchor);
  const gap       = useProp(props.gap, parseGapXY);

  const background = (stroke || fill || image) ? (
    use(Element, {radius, border, stroke, fill, image, absolute: true, under: true})
  ) : null;

  const {id} = useFiber();
  const inspect = useInspectable();

  const Resume = (els: LayoutElement[]) => {
    const w = width != null && width === +width ? width : null;
    const h = height != null && height === +height ? height : null;

    const fixed = [w, h] as [number | null, number | null];

    const sizing = getFlexMinMax(els, fixed, direction, gap, wrap, snap);

    let ratioX = undefined;
    let ratioY = undefined;
    if (typeof width  === 'string') ratioX = evaluateDimension(width,  1, false) ?? 1;
    if (typeof height === 'string') ratioY = evaluateDimension(height, 1, false) ?? 1;

    return yeet({
      sizing,
      margin,
      grow,
      shrink,
      inline,
      ratioX,
      ratioY,
      fit: memoFit((into: AutoPoint) => {
        const w = width  != null ? evaluateDimension(width, into[0], snap) : null;
        const h = height != null ? evaluateDimension(height, into[1], snap) : null;
        const fixed = [w, h] as [number | number, number | null];

        const {size, sizes, offsets, renders, pickers} = fitFlex(els, into, fixed, direction, gap, align[0], align[1], anchor, wrap, snap);

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

        return self;
      }),
    });
  };
  
  return children ? gather(children, Resume) : null;
}, 'Flex');
