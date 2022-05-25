import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TextureSource, Point4, Rectangle } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { Dimension, Margin, MarginLike, Fit, Repeat, Anchor, AutoPoint } from '../types';

import { keyed, yeet, useFiber, useMemo } from '@use-gpu/live';
import { evaluateDimension, parseMargin } from '../parse';
import { ImageTrait } from '../types';

import { UIRectangle } from '../shape/ui-rectangle';

export type ElementProps = {
  width?: Dimension,
  height?: Dimension,
  margin?: MarginLike,

  radius?: MarginLike,
  border?: MarginLike,
  stroke?: Point4,
  fill?: Point4,

  image?: Partial<ImageTrait>,

  grow?: number,
  shrink?: number,
  snap?: boolean,
  absolute?: boolean,
  under?: boolean,

  children?: LiveElement<any>,
};

const TRANSPARENT: Point4 = [0, 0, 0, 0];

export const Element: LiveComponent<ElementProps> = (props) => {
  const {
    width,
    height,
    // -- unpacked below
    // margin
    // radius
    // border

    image,

    stroke = TRANSPARENT,
    fill = TRANSPARENT,

    grow = 0,
    shrink = 0,
    snap = false,
    absolute = false,
    under = false,

    children,
  } = props;

  const w = typeof width === 'number' ? width : 0;
  const h = typeof height === 'number' ? height : 0;

  const {id} = useFiber();
  const sizing = [w, h, w, h];

  const margin = parseMargin(props.margin ?? 0);
  const radius = parseMargin(props.radius ?? 0);
  const border = parseMargin(props.border ?? 0);

  return yeet({
    sizing,
    margin,
    grow,
    shrink,
    absolute,
    under,
    fit: (into: AutoPoint) => {
      const w = width != null ? evaluateDimension(width, into[0] || 0, snap) : into[0] || 0;
      const h = height != null ? evaluateDimension(height, into[1] || 0, snap) : into[1] || 0;
      const size = [w ?? 0, h ?? 0];

      const render = (layout: Rectangle, clip?: ShaderModule, transform?: ShaderModule): LiveElement<any> => (
        keyed(UIRectangle, id, {
          id,
          layout,

          stroke,
          fill,
          border,
          radius,

          image,
          clip,
          transform,
        })
      );
      return {
        size,
        render,
        pick: (x: number, y: number, l: number, t: number, scroll?: boolean) => {
          return !scroll ? [id, [l, t, l + size[0], t + size[1]]] : null;
        },
      };
    },
  });
};
