import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { AutoPoint, Point, Point4, Margin, LayoutElement } from '../types';

import { memo, use, gather, yeet, useFiber, useMemo, useOne } from '@use-gpu/live';
import { makeRefBinding } from '@use-gpu/core';
import { bindBundle, bindingToModule, bundleToAttribute } from '@use-gpu/shader/wgsl';
import { useInspectable } from '../../hooks/useInspectable'

import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';

import { fitAbsoluteBox } from '../lib/absolute';
import { getBlockMinMax } from '../lib/block';
import { makeBoxLayout, makeBoxPicker, memoFit } from '../lib/util';
import { Block } from './block';
import { mat4 } from 'gl-matrix';

const NO_FIXED: [null, null] = [null, null];
const NO_POINT4: Point4 = [0, 0, 0, 0];

const MATRIX_BINDING = bundleToAttribute(getCartesianPosition, 'getMatrix');

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
  const matrix = useOne(() => mat4.create());

  const scrollTo = (x: number, y: number) => {
    const dx = Math.max(0, sizeRef[2] - sizeRef[0]);
    const dy = Math.max(0, sizeRef[3] - sizeRef[1]);
    scrollRef[0] = Math.max(0, Math.min(dx, x));
    scrollRef[1] = Math.max(0, Math.min(dy, y));
    matrix[12] = -scrollRef[0];
    matrix[13] = -scrollRef[1];
  };

  const scrollBy = (dx: number, dy: number) => {
    scrollTo(scrollRef[0] + dx, scrollRef[1] + dy);
  };

  const transform = useOne(() => {
    const getMatrix = bindingToModule(makeRefBinding(MATRIX_BINDING, matrix));
    return bindBundle(getCartesianPosition, {getMatrix});
  });
  
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

        const resolved = direction === 'x' ? [null, into[1]] : [into[0], null]
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
        console.log({sizeRef, into})

        const [x, y] = scrollRef;
        const sx = into[0] != null ? Math.max(0, Math.min(size[0] - into[0], x)) : 0;
        const sy = into[1] != null ? Math.max(0, Math.min(size[1] - into[1], y)) : 0;

        scrollTo(sx, sy);

        const self = {
          size,
          render: makeBoxLayout(sizes, offsets, renders, transform),
          pick: makeBoxPicker(id, sizes, offsets, pickers, scrollRef, scrollBy),
        };

        return self;
      }),
    });
  };

  return children ? gather(use(Block, {direction, children}), Resume) : null;
}, 'Overflow');
