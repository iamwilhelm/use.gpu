import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { use, yeet, useContext } from '@use-gpu/live';
import { LayoutContext } from '../providers/layout-provider';
import { LayerType } from '../layers/types';

import { Rectangles } from '../layers';

export type SurfaceProps = {
  stroke?: number[],
  fill?: number[],
  lineWidth?: number,
};

export const Surface: LiveComponent<SurfaceProps> = (fiber) => (props) => {
  const {
    stroke = [1, 1, 1, 1],
    fill = [0, 0, 0, 1],
    lineWidth = 1,
  } = props;

  const rectangle = useContext(LayoutContext);
  let [left, top, right, bottom] = rectangle;

  const d = lineWidth / 2;
  left += d;
  top += d;
  right -= d;
  bottom -= d;

  const positions = [
    left, top, 0.5, 1,
    right, top, 0.5, 1,
    right, bottom, 0.5, 1,
    left, bottom, 0.5, 1,
  ];

  return yeet({
    rectangle: {
      rectangle: [left, top, right, bottom],
      color: fill,
      count: 1,
    },
    line: {
      positions,
      color: stroke,
      size: lineWidth,
      isLoop: true,
      count: 4,
    },
  });
};
