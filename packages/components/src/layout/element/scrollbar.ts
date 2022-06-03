import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TextureSource, Point4, Rectangle } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { Direction, Overflow, Point, AutoPoint, UIAggregate } from '../types';
import { ColorLike } from '../../traits/types';

import { keyed, yeet, useFiber, useMemo } from '@use-gpu/live';
import { makeShaderBinding } from '@use-gpu/core';
import { evaluateDimension } from '../parse';
import { isHorizontal, memoFit } from '../lib/util';
import { useInspectHoverable } from '../../hooks/useInspectable';

import { BoxTrait, ElementTrait } from '../types';
import { useBoxTrait, useElementTrait } from '../traits';
import { INSPECT_STYLE } from '../lib/constants';

import { UIRectangle } from '../shape/ui-rectangle';
import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';
import { useBoundShader } from '../../hooks/useBoundShader';

import { getScrolledPosition } from '@use-gpu/wgsl/clip/scroll.wgsl';

const OFFSET_BINDINGS = bundleToAttributes(getScrolledPosition);

export type ScrollBarProps = {
  direction?: Direction,

  size?: number,
  track?: ColorLike,
  thumb?: ColorLike,

  overflow?: Overflow,
  scrollRef?: Point,
  sizeRef?: Point4,
  transform?: ShaderModule,

  children?: LiveElement<any>,
};

const NO_POINT: Point = [0, 0];

const NO_POINT4: Point4 = [0, 0, 0, 0];
const TRACK: Point4 = [0, 0, 0, .5];
const THUMB: Point4 = [1, 1, 1, .5];

export const ScrollBar: LiveComponent<ScrollBarProps> = (props) => {
  const {
    direction = 'y',
    size = 10,
    track = TRACK,
    thumb = THUMB,
    
    overflow = 'scroll',
    scrollRef = NO_POINT,
    sizeRef = NO_POINT4,
    children,
  } = props;

  const {id} = useFiber();

  const isX = isHorizontal(direction);

  const hovered = useInspectHoverable();

  const shift = useMemo(() => isX
    ? () => [scrollRef[0] / sizeRef[2] * sizeRef[0], 0]
    : () => [0, scrollRef[1] / sizeRef[3] * sizeRef[1]],
    [scrollRef, sizeRef]
  );

  const thumbTransform = useBoundShader(getScrolledPosition, OFFSET_BINDINGS, [shift]);

  return yeet({
    sizing: NO_POINT4,
    margin: NO_POINT4,
    absolute: true,
    fit: memoFit((into: AutoPoint) => {

      let render = (layout: Rectangle, clip?: ShaderModule, transform?: ShaderModule): LiveElement<any> => {
        const [outerWidth, outerHeight, innerWidth, innerHeight] = sizeRef;

        const w = isX ? outerWidth : size;
        const h = isX ? size : outerHeight;

        const [l, t, r, b] = layout;        
        const ll = isX ? l : r - w;
        const tt = isX ? b - h : t;

        const f = Math.min(1, isX ? outerWidth / innerWidth : outerHeight / innerHeight);
        const rr = isX ? l + (r - l) * f : r;
        const bb = isX ? b : t + (b - t) * f;

        const trackBox = [ll, tt, r, b] as Rectangle;
        const thumbBox = [ll, tt, rr, bb] as Rectangle;

        const showTrack = overflow === 'scroll' || f < 1;
        const showThumb = showTrack && f < 1;

        const yeets: UIAggregate[] = [];
        if (showTrack) yeets.push({
          id: id.toString() + '-0',
          rectangle: trackBox,
          uv: [0, 0, 1, 1],
          fill:   track,
          radius: [size/2, size/2, size/2, size/2],

          clip,
          transform,
          count: 1,
        });
        if (showThumb) yeets.push({
          id: id.toString() + '-1',
          rectangle: thumbBox,
          uv: [0, 0, 1, 1],
          fill:   thumb,
          radius: [size/2, size/2, size/2, size/2],

          clip,
          transform: transform ? chainTo(transform, thumbTransform) : thumbTransform,
          count: 1,
        });
        return yeet(yeets);
      };

      return {
        size: into,
        render,
        /*
        pick: (x: number, y: number, l: number, t: number, r: number, b: number, scroll?: boolean) => {
          if (x < l || x > r || y < t || y > b) return null;
          return !scroll ? [id, [l, t, r, b]] : null;
        },
        */
      };
    }),
  });
};
