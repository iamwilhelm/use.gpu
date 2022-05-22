import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { Point, LayoutElement } from '../types';

import { memo, gather, yeet, useFiber } from '@use-gpu/live';
import { fitAbsoluteBox } from '../lib/absolute';
import { makeBoxLayout, makeBoxPicker, memoFit } from '../lib/util';
import { useInspectable } from '../../hooks/useInspectable'

const NO_POINT4 = [0, 0, 0, 0];

export type AbsoluteProps = {
  left?: string | number | null,
  top?: string | number | null,
  right?: string | number | null,
  bottom?: string | number | null,
  width?: string | number | null,
  height?: string | number | null,

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
    width: w,
    height: h,
    under = false,
    snap = true,
    children,
  } = props;

  const {id} = useFiber();
  const inspect = useInspectable();

  const Resume = (els: LayoutElement[]) => {
    return yeet({
      sizing: NO_POINT4,
      margin: NO_POINT4,
      absolute: true,
      under,
      fit: memoFit((into: Point) => {
        const {size, sizes, offsets, renders, pickers} = fitAbsoluteBox(els, into, l, t, r, b, w, h, snap);

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

  return children ? gather(children, Resume) : null;
}, 'Absolute');
