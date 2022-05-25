import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { AutoPoint, Dimension, LayoutElement } from '../types';

import { use, memo, gather, yeet, useFiber } from '@use-gpu/live';
import { fitAbsoluteBox } from '../lib/absolute';
import { makeBoxLayout, makeBoxPicker, memoFit } from '../lib/util';
import { useInspectable } from '../../hooks/useInspectable';

import { ElementTrait } from '../types';
import { useElementTrait } from '../traits';
import { Element } from '../element/element';

const NO_POINT4 = [0, 0, 0, 0];

export type AbsoluteProps = Partial<ElementTrait> &
{
  left?: Dimension,
  top?: Dimension,
  right?: Dimension,
  bottom?: Dimension,

  under?: boolean,
  snap?: boolean,
  children?: LiveElement<any>,
};

export const Absolute: LiveComponent<AbsoluteProps> = memo((props: AbsoluteProps) => {
  const {
    left: l,
    top: t,
    right: r,
    bottom: b,
    under = false,
    snap = true,
    children,
  } = props;

  const { width, height, radius, border, stroke, fill, image } = useElementTrait(props);

  const background = (stroke || fill || image) ? (
    use(Element, {radius, border, stroke, fill, image, absolute: true, under: true})
  ) : null;

  const {id} = useFiber();
  const inspect = useInspectable();

  const Resume = (els: LayoutElement[]) => {
    return yeet({
      sizing: NO_POINT4,
      margin: NO_POINT4,
      absolute: true,
      under,
      fit: memoFit((into: AutoPoint) => {
        const {size, sizes, offsets, renders, pickers} = fitAbsoluteBox(els, into, l, t, r, b, width, height, snap);

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
      }),
    });
  };

  const c = background ? (children ? [background, children] : background) : children;
  return gather(c, Resume);
}, 'Absolute');
