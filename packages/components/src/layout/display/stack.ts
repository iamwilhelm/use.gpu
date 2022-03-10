import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { LayoutElement, Point, Dimension, Margin } from '../types';

import { memo, gather, resume, yeet, useFiber, useOne } from '@use-gpu/live';
import { getStackMinMax, getStackMargin, fitStack } from '../lib/stack';
import { normalizeMargin, makeBoxLayout, parseDimension } from '../lib/util';

export type StackProps = {
  direction?: 'x' | 'y',

  width?: Dimension,
  height?: Dimension,

  grow?: number,
  shrink?: number,
  margin?: number | Margin,
  padding?: number | Margin,
  snap?: boolean,

  element?: LiveElement<any>,
  children?: LiveElement<any>,
};

export const Stack: LiveComponent<StackProps> = memo((props: StackProps) => {
  const {
    direction = 'y',
    width,
    height,
    grow = 0,
    shrink = 0,
    snap = true,
    margin: m = 0,
    padding: p = 0,
    children,
  } = props;

  const margin = normalizeMargin(m);
  const padding = normalizeMargin(p);

  const Resume = useOne(() =>
    makeResume(direction, width, height, grow, shrink, snap, margin, padding),
    [direction, width, height, grow, shrink, snap, margin, padding]
  );

  return children ? gather(children, Resume) : null;
}, 'Stack');

const makeResume = (
  direction: 'x' | 'y',
  width: Dimension | undefined,
  height: Dimension | undefined,
  grow: number,
  shrink: number,
  snap: boolean,
  stackMargin: Margin,
  padding: Margin,
) =>
  resume((els: LayoutElement[]) => {
    const w = width != null ? parseDimension(width, 0, snap) : 0;
    const h = height != null ? parseDimension(height, 0, snap) : 0;

    const size = [w, h];
    const fixed = [
      width != null ? w : null,
      height != null ? h : null,
    ] as [number | number, number | null];

    const sizing = getStackMinMax(els, direction);
    const margin = getStackMargin(els, stackMargin, padding, direction);
    
    const key = useFiber().id;

    return yeet({
      sizing,
      margin,
      grow,
      shrink,
      fit: (into: Point) => {
        const {size, sizes, offsets, renders} = fitStack(els, into, fixed, padding, direction);
        return {
          size,
          render: makeBoxLayout(sizes, offsets, renders),
        };
      }
    });
  });
