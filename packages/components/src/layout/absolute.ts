import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { memo, gather, resume, yeet, useOne } from '@use-gpu/live';
import { fitAbsoluteBox } from './lib/absolute';
import { makeBoxLayout } from './lib/util';

const NO_POINT4 = [0, 0, 0, 0];

export type AbsoluteProps = {
  left?: string | number | null,
  top?: string | number | null,
  right?: string | number | null,
  bottom?: string | number | null,
  width?: string | number | null,
  height?: string | number | null,

  snap?: boolean,
  children?: LiveElement<any>,
};

export const Absolute: LiveComponent<AbsoluteProps> = memo((fiber) => (props) => {
  const {
    left: l,
    top: t,
    right: r,
    bottom: b,
    width: w,
    height: h,
    snap = true,

    render,
    children,
  } = props;

  const Resume = useOne(() =>
    makeResume(l, t, r, b, w, h),
    [l, t, r, b, w, h]
  );

  return gather(children ?? (render ? render() : null), Resume);
}, 'Absolute');

const makeResume = (
  l?: string | number | null,
  t?: string | number | null,
  r?: string | number | null,
  b?: string | number | null,
  w?: string | number | null,
  h?: string | number | null,
  snap?: boolean,
) =>
  resume((fiber: LiveFiber<any>) => (els: LayoutElement[]) => {
    return yeet({
      key: fiber.id,
      sizing: NO_POINT4,
      margin: NO_POINT4,
      absolute: true,
      fit: (into: Point) => {
        const {size, sizes, offsets, renders} = fitAbsoluteBox(els, into, l, t, r, b, w, h, snap);
        return {
          size,
          render: makeBoxLayout(sizes, offsets, renders),
        };
      }
    });
  }, 'Absolute');

