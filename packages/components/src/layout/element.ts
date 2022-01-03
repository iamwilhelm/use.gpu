import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { use, yeet, useFiber, useMemo } from '@use-gpu/live';
import { LayoutContext } from '../providers/layout-provider';
import { LayoutState, LayoutResult, Rectangle, Point } from './types';
import { normalizeMargin } from './lib/util';

import { Surface } from './surface';

export type ElementProps = {
  width: number,
  height: number,
  margin?: number | Rectangle,
  grow?: number,
  shrink?: number,

  children?: LiveElement<any>,
};

export const Element: LiveComponent<BlockProps> = (fiber) => (props) => {
  const {
    width = 100,
    height = 100,
    margin: m = 0,
    grow = 0,
    shrink = 0,
    children,
  } = props;

  const sizing = [width, height, width, height];
  const margin = normalizeMargin(m);

  return yeet({
    key: useFiber().id,
    margin,
    sizing,
    fit: (): Point => {
      const size = [width, height];
      const render = (layout: Rectangle): LiveElement<any> => (
        use(Surface, fiber.id)({
          layout,
          fill: true,
          stroke: true,
          fillColor: [Math.random(), Math.random(), Math.random(), 1],
          strokeColor: [Math.random(), Math.random(), Math.random(), 1],
        })
      );
      return {size, render};
    },
  });
};
