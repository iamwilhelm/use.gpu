import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { UniformType } from '@use-gpu/core/types';
import { AutoPoint, Rectangle, Point, Point4, Margin, LayoutElement } from '../types';

import { memo, use, gather, yeet, useFiber, useMemo, useOne } from '@use-gpu/live';
import { makeRefBinding } from '@use-gpu/core';
import { bindBundle, bindingToModule, bundleToAttribute, castTo, chainTo } from '@use-gpu/shader/wgsl';
import { useInspectable } from '../../hooks/useInspectable';
import { useBoundShader } from '../../hooks/useBoundShader';
import { useBoundSource } from '../../hooks/useBoundSource';

import { getScrolledPosition } from '@use-gpu/wgsl/clip/scroll.wgsl';
import { getShiftedRectangle } from '@use-gpu/wgsl/clip/layout.wgsl';

import { fitAbsoluteBox } from '../lib/absolute';
import { getBlockMinMax } from '../lib/block';
import { makeBoxLayout, makeBoxPicker, memoFit } from '../lib/util';
import { Block } from './block';
import { mat4 } from 'gl-matrix';

const NO_FIXED: [null, null] = [null, null];
const NO_POINT4: Point4 = [0, 0, 0, 0];

const OFFSET_BINDING = bundleToAttribute(getScrolledPosition, 'getOffset');
const CLIP_BINDING = {name: 'getClip', format: 'vec4<f32>' as UniformType};

export type OverflowProps = {
  x?: 'visible' | 'scroll' | 'hidden' | 'auto',
  y?: 'visible' | 'scroll' | 'hidden' | 'auto',
  
  initialX?: number,
  initialY?: number,
  
  direction?: 'x' | 'y',
  children?: LiveElement<any>,
};

export const Overflow: LiveComponent<OverflowProps> = memo((props: OverflowProps) => {
  const {
    x = 'auto',
    y = 'auto',
    initialX = 0,
    initialY = 0,
    direction = 'y',
    children,
  } = props;

  const scrollRef = useMemo(() => [initialX, initialY] as [number, number], [initialX, initialY]);
  const sizeRef = useOne(() => [0, 0, 0, 0]);
  const offsetRef = useOne(() => [-initialX, -initialY]);
  const clipRef = useOne(() => [0, 0, 0, 0]);
  const boxRef = useOne(() => ({current: [0, 0]}));

  const scrollTo = (x: number, y: number) => {
    const [outerWidth, outerHeight, innerWidth, innerHeight] = sizeRef;
    
    const dx = Math.max(0, innerWidth - outerWidth);
    const dy = Math.max(0, innerHeight - outerHeight);
    const sx = scrollRef[0] = Math.max(0, Math.min(dx, x));
    const sy = scrollRef[1] = Math.max(0, Math.min(dy, y));
    offsetRef[0] = -sx;
    offsetRef[1] = -sy;
    clipRef[0] = sx;
    clipRef[1] = sy;
    clipRef[2] = sx + outerWidth;
    clipRef[3] = sy + outerHeight;
  };

  const scrollBy = (dx: number, dy: number) => {
    scrollTo(scrollRef[0] + dx, scrollRef[1] + dy);
  };

  const c = useBoundSource(CLIP_BINDING, clipRef);
  const b = useBoundSource(OFFSET_BINDING, boxRef);

  const shift = useBoundShader(getShiftedRectangle, [OFFSET_BINDING], [b]);
  const transform = useBoundShader(getScrolledPosition, [OFFSET_BINDING], [offsetRef]);
  const inverse = useBoundShader(getScrolledPosition, [OFFSET_BINDING], [scrollRef]);

  const clip = useOne(() => chainTo(c, shift));

  const {id} = useFiber();
  const inspect = useInspectable();

  const Resume = (els: LayoutElement[]) => {
    const sizing = getBlockMinMax(els, NO_FIXED, direction);
    const [{margin, fit}] = els;
    const [ml, mt, mr, mb] = margin;

    return yeet({
      sizing,
      margin: NO_POINT4,
      absolute: true,
      fit: memoFit((into: AutoPoint) => {

        const resolved: AutoPoint = direction === 'x' ? [null, into[1]] : [into[0], null];
        const {render, pick, size} = fit(resolved);

        const sizes = [size];
        const offsets = [[ml, mt]] as Point[];
        const renders = [render];
        const pickers = [pick];
        const scrollers = [scroll];

        inspect({
          layout: {
            into,
            size,
            sizes,
            offsets,
          },
        });

        sizeRef[0] = into[0] ?? 0;
        sizeRef[1] = into[1] ?? 0;
        sizeRef[2] = size[0] + ml + mr;
        sizeRef[3] = size[1] + mt + mb;

        const [x, y] = scrollRef;
        scrollTo(x, y);

        const self = {
          size,
          render: (
            box: Rectangle,
            parentClip?: ShaderModule,
            parentTransform?: ShaderModule,
          ) => {
            boxRef.current = box;
            return makeBoxLayout(sizes, offsets, renders, clip, transform, inverse)(box, parentClip, parentTransform);
          },
          pick: makeBoxPicker(id, sizes, offsets, pickers, scrollRef, scrollBy),
        };

        return self;
      }),
    });
  };

  return children ? gather(use(Block, {direction, children}), Resume) : null;
}, 'Overflow');
