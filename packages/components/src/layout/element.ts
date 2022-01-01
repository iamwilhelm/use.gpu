import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { use, yeet, useMemo } from '@use-gpu/live';
import { LayoutContext } from '../providers/layout-provider';
import { LayoutState, LayoutResult, Rectangle, Point } from './types';

import { Surface } from './surface';

export type ElementProps = {
  width: number,
  height: number,
  flex?: number,

  children?: LiveElement<any>,
};

export const Element: LiveComponent<BlockProps> = (fiber) => (props) => {
  const {
    width = 100,
    height = 100,
    flex = 0,
    children,
  } = props;

  return yeet((layout: LayoutState): LayoutResult => {
    const [left, top] = layout;
    const right = left + width;
    const bottom = top + height;

    return {
      key: fiber.id,
      box: [left, top, right, bottom] as Rectangle,
      size: [width, height] as Point,
      flex,
      element: use(Surface)({
        fill: [Math.random(), Math.random(), Math.random(), 1],
        stroke: [Math.random(), Math.random(), Math.random(), 1],
      }),
    };
  });
};
