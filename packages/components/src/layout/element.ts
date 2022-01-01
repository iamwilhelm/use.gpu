import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { use, yeet, useMemo } from '@use-gpu/live';
import { LayoutState, LayoutContext } from '../providers/layout-provider';
import { parseDimension } from './util';

import { Surface } from './surface';

export type ElementProps = {
  width: number,
  height: number,

  children?: LiveElement<any>,
};

export const Element: LiveComponent<BlockProps> = (fiber) => (props) => {
  const {
    width = 100,
    height = 100,
    children,
  } = props;

  return yeet((layout: LayoutState) => {
    const [left, top] = layout;
    const right = left + width;
    const bottom = top + height;

    return {
      key: fiber.id,
      box: [left, top, right, bottom],
      element: use(Surface)({
        fill: [Math.random(), Math.random(), Math.random(), 1],
        stroke: [Math.random(), Math.random(), Math.random(), 1],
      }),
    };
  });
};
