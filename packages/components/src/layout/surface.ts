import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TextureSource } from '@use-gpu/core/types';

import { use, yeet, useContext, useNoContext } from '@use-gpu/live';
import { LayoutContext } from '../providers/layout-provider';
import { LayerType } from '../layers/types';
import { Rectangle } from '../layout/types';

import { Rectangles } from '../layers';

export type SurfaceProps = {
  layout?: Rectangle,
  layer?: number,

  backgroundColor?: Point4,
  backgroundImage?: TextureSource,
  backgroundFit?: Fit,
  backgroundRepeat?: Repeat,
  backgroundAlign?: Anchor | [Anchor, Anchor],

  borderColor?: Point4,
  borderSize?: number,
};

const WHITE = [1, 1, 1, 1];
const BLACK = [0, 0, 0, 1];
const TRANSPARENT = [0, 0, 0, 0];

export const Surface: LiveComponent<SurfaceProps> = (props) => {
  const {
    backgroundColor,
    backgroundImage,
    backgroundFit,
    backgroundRepeat,
    backgroundAlign,

    borderColor,
    borderSize = 0,
    layer = 1,
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

  const d = borderSize / 2;
  left += d;
  top += d;
  right -= d;
  bottom -= d;

  const z = layer / 0xFFFF;
  const positions = [
    left, top, z, 1,
    right, top, z, 1,
    right, bottom, z, 1,
    left, bottom, z, 1,
  ];

  const render = {};
  if (backgroundColor || backgroundImage) {
    render.rectangle = {
      rectangle: [left, top, right, bottom],
      color: backgroundColor ?? TRANSPARENT,
      z,
      count: 1,
    };
    if (backgroundImage) render.rectangle.texture = backgroundImage;
  }
  if (borderColor) {
    render.point = {
      positions,
      color: borderColor,
      size: borderSize * 2,
      count: 4,
    };
    render.line = {
      positions,
      color: borderColor,
      size: borderSize,
      isLoop: true,
      count: 4,
    };
  }

  return yeet(render);
};
