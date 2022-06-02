import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TextureSource, Point4, Rectangle } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { Dimension, Margin, MarginLike, Base, Fit, Repeat, Anchor, AutoPoint } from '../types';

import { keyed, yeet, useFiber, useMemo } from '@use-gpu/live';
import { evaluateDimension } from '../parse';
import { useInspectHoverable } from '../../hooks/useInspectable';

import { BoxTrait, ElementTrait } from '../types';
import { useBoxTrait, useElementTrait } from '../traits';
import { INSPECT_STYLE } from '../lib/constants';

import { UIRectangle } from '../shape/ui-rectangle';

export type ElementProps = Partial<BoxTrait> & Partial<ElementTrait> & {
  id?: number,
  snap?: boolean,
  absolute?: boolean,
  under?: boolean,

  children?: LiveElement<any>,
};

const TRANSPARENT: Point4 = [0, 0, 0, 0];

export const Element: LiveComponent<ElementProps> = (props) => {
  const {
    snap = false,
    absolute = false,
    under = false,

    children,
  } = props;

  const { width, height, radius, border, stroke, fill, image } = useElementTrait(props);
  const { margin, grow, shrink, inline } = useBoxTrait(props);

  const w = typeof width === 'number' ? width : 0;
  const h = typeof height === 'number' ? height : 0;

  const {id: fiberId} = useFiber();
  const id = props.id ?? fiberId;
  const sizing = [w, h, w, h];

  const hovered = useInspectHoverable();

  return yeet({
    sizing,
    margin,
    grow,
    shrink,
    absolute,
    under,
    inline,
    fit: (into: AutoPoint) => {
      const w = width != null ? evaluateDimension(width, into[0] || 0, snap) : into[0] || 0;
      const h = height != null ? evaluateDimension(height, into[1] || 0, snap) : into[1] || 0;
      const size = [w ?? 0, h ?? 0];

      let render = (layout: Rectangle, clip?: ShaderModule, transform?: ShaderModule): LiveElement<any> => (
        keyed(UIRectangle, id, {
          id,
          layout,

          stroke: hovered ? INSPECT_STYLE.parent.stroke : stroke ?? TRANSPARENT,
          fill:   hovered ? INSPECT_STYLE.parent.fill : fill ?? TRANSPARENT,
          border: hovered ? INSPECT_STYLE.parent.border : border,
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
