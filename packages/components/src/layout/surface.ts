import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { use, yeet, useContext, useNoContext } from '@use-gpu/live';
import { LayoutContext } from '../providers/layout-provider';
import { LayerType } from '../layers/types';
import { Rectangle } from '../layout/types';

import { Rectangles } from '../layers';

export type SurfaceProps = {
  rectangle?: Rectangle,
  stroke?: boolean,
  fill?: boolean,
  strokeColor?: number[],
  fillColor?: number[],
  lineWidth?: number,
};

export const Surface: LiveComponent<SurfaceProps> = (props) => {
  const {
    stroke = false,
    fill = true,
    strokeColor = [1, 1, 1, 1],
    fillColor = [0, 0, 0, 1],
    lineWidth = 1,
  } = props;

  let layout;
  if (props.layout) {
    layout = props.layout;
    useNoContext(LayoutContext);
  }
  else {
    layout = useContext(LayoutContext);
  }

  let [left, top, right, bottom] = layout;

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

  const render = {};
  if (fill) {
    render.point = {
      positions,
      color: strokeColor,
      size: lineWidth * 2,
      count: 4,
    };
    render.rectangle = {
      rectangle: [left, top, right, bottom],
      color: fillColor,
      count: 1,
    };
  }
  if (stroke) {
    render.line = {
      positions,
      color: strokeColor,
      size: lineWidth,
      isLoop: true,
      count: 4,
    };
  }

  return yeet(render);
};
