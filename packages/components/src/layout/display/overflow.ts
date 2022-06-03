import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { UniformType, Rectangle, Point, Point4 } from '@use-gpu/core/types';
import { AutoPoint, Direction, Margin, OverflowMode, LayoutElement } from '../types';

import { memo, use, gather, yeet, extend, useFiber, useOne } from '@use-gpu/live';
import { makeShaderBinding } from '@use-gpu/core';
import { bindBundle, bindingToModule, bundleToAttribute, castTo, chainTo } from '@use-gpu/shader/wgsl';
import { useInspectable } from '../../hooks/useInspectable';
import { useProp } from '../../traits/useProp';

import { getScrolledPosition } from '@use-gpu/wgsl/clip/scroll.wgsl';
import { getShiftedRectangle } from '@use-gpu/wgsl/clip/layout.wgsl';

import { fitAbsoluteBox } from '../lib/absolute';
import { getBlockMinMax } from '../lib/block';
import { makeBoxLayout, makeBoxPicker, memoFit } from '../lib/util';
import { parseOverflow } from '../parse';
import { ScrollBar } from '../element/scrollbar';
import { Block } from './block';
import { mat4 } from 'gl-matrix';

const NO_FIXED: [null, null] = [null, null];
const NO_POINT4: Point4 = [0, 0, 0, 0];

const OFFSET_BINDING = bundleToAttribute(getScrolledPosition, 'getOffset');
const CLIP_BINDING = {name: 'getClip', format: 'vec4<f32>' as UniformType};

const SCROLLBAR = use(ScrollBar, {});

export type OverflowProps = {
  x?: OverflowMode,
  y?: OverflowMode,
  
  scrollX?: number,
  scrollY?: number,

  scrollBar?: LiveElement<any>,
  
  direction?: Direction,
  children?: LiveElement<any>,
};

export const Overflow: LiveComponent<OverflowProps> = memo((props: OverflowProps) => {
  const {
    scrollX = 0,
    scrollY = 0,
    scrollBar = SCROLLBAR,
    direction = 'y',
    children,
  } = props;
  
  const x = useProp(props.x, parseOverflow);
  const y = useProp(props.y, parseOverflow);

  const api = useOne(() => {
    const scrollRef = [0, 0] as Point;
    const offsetRef = [0, 0] as Point;
    const sizeRef = [0, 0, 0, 0] as Point4;
    const clipRef = [0, 0, 0, 0] as Point4;
    const boxRef = [0, 0] as Point;

    const scrollTo = (x?: number | null, y?: number | null) => {
      const [outerWidth, outerHeight, innerWidth, innerHeight] = sizeRef;

      if (x != null) {
        const max = Math.max(0, innerWidth - outerWidth);
        const pos = scrollRef[0] = Math.max(0, Math.min(max, x));
        offsetRef[0] = -pos;
        clipRef[0] = pos;
        clipRef[2] = pos + outerWidth;
      }

      if (y != null) {
        const max = Math.max(0, innerHeight - outerHeight);
        const pos = scrollRef[1] = Math.max(0, Math.min(max, y));
        offsetRef[1] = -pos;
        clipRef[1] = pos;
        clipRef[3] = pos + outerHeight;
      }
    };

    const scrollBy = (dx?: number | null, dy?: number | null) => {
      scrollTo(
        dx != null ? scrollRef[0] + dx : null,
        dy != null ? scrollRef[1] + dy : null,
      );
    };
    
    const fitTo = (layout: Rectangle) => {
      const [l, t, r, b] = layout;
      sizeRef[0] = r - l;
      sizeRef[1] = b - t;
      boxRef[0] = l;
      boxRef[1] = t;

      const [x, y] = scrollRef;
      scrollTo(x, y);
    };
    
    const sizeTo = (size: Point) => {
      sizeRef[2] = size[0];
      sizeRef[3] = size[1];
    };

    const c = bindingToModule(makeShaderBinding<ShaderModule>(CLIP_BINDING, clipRef));
    const b = bindingToModule(makeShaderBinding<ShaderModule>(OFFSET_BINDING, boxRef));
    const o = bindingToModule(makeShaderBinding<ShaderModule>(OFFSET_BINDING, offsetRef));
    const s = bindingToModule(makeShaderBinding<ShaderModule>(OFFSET_BINDING, scrollRef));

    const shift = bindBundle(getShiftedRectangle, {getOffset: b});
    const clip = chainTo(c, shift);

    const transform = bindBundle(getScrolledPosition, {getOffset: o});
    const inverse = bindBundle(getScrolledPosition, {getOffset: s});

    return {clip, transform, inverse, sizeRef, scrollRef, fitTo, sizeTo, scrollTo, scrollBy};
  });
  
  const {clip, transform, inverse, sizeRef, scrollRef, fitTo, sizeTo, scrollTo, scrollBy} = api;

  useOne(() => scrollTo(scrollX, null), scrollX);
  useOne(() => scrollTo(null, scrollY), scrollY);

  const {id} = useFiber();
  const inspect = useInspectable();

  const Resume = (els: LayoutElement[]) => {
    const sizing = getBlockMinMax(els, NO_FIXED, direction);
    const [{margin, fit}, ...scrollBars] = els;
    const [ml, mt, mr, mb] = margin;

    return yeet({
      sizing,
      margin: NO_POINT4,
      stretch: true,
      fit: memoFit((into: AutoPoint) => {

        const resolved: AutoPoint = direction === 'x' ? [null, into[1]] : [into[0], null];
        const {render, pick, size} = fit(resolved);

        const sizes   = [size];
        const offsets = [[ml, mt]] as Point[];
        const renders = [render];
        const pickers = [pick];

        for (const {fit} of scrollBars) {
          const {render, pick, size} = fit(into);
          sizes.push(size);
          offsets.push([0, 0]);
          renders.push(render);
          pickers.push(null);
        }

        inspect({
          layout: {
            into,
            size,
            sizes,
            offsets,
          },
        });

        sizeTo(size);

        return {
          size,
          render: (
            box: Rectangle,
            parentClip?: ShaderModule,
            parentTransform?: ShaderModule,
          ) => {
            fitTo(box);
            return [
              ...makeBoxLayout([sizes[0]], [offsets[0]], [renders[0]], clip, transform, inverse)(box, parentClip, parentTransform),
              ...makeBoxLayout(sizes.slice(1), offsets.slice(1), renders.slice(1))(box, parentClip, parentTransform),
            ];
          },
          pick: makeBoxPicker(id, sizes, offsets, pickers, scrollRef, scrollBy),
        };
      }),
    });
  };

  const scrollBarX = x === 'scroll' || x === 'auto' ? extend(scrollBar, { direction: 'x', overflow: x, scrollRef, sizeRef }) : null;
  const scrollBarY = y === 'scroll' || y === 'auto' ? extend(scrollBar, { direction: 'y', overflow: y, scrollRef, sizeRef }) : null;

  return children ? gather([
    use(Block, {contain: true, direction, children}),
    scrollBarX,
    scrollBarY,
  ], Resume) : null;
}, 'Overflow');
