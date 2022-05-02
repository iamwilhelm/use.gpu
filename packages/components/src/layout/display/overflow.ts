import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { Point, Point4, Margin, LayoutElement } from '../types';

import { memo, use, gather, yeet, useMemo, useOne } from '@use-gpu/live';
import { makeRefBinding } from '@use-gpu/core';
import { bindBundle, bindingToModule, bundleToAttribute } from '@use-gpu/shader/wgsl';

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

  const scrollRef = useMemo(() => [initialX, initialY], [initialX, initialY]);
  const sizeRef = useOne(() => [0, 0, 0, 0]);

  const matrix = useOne(() => mat4.create());

  const transform = useOne(() => {
    const getMatrix = bindingToModule(makeRefBinding(MATRIX_BINDING, matrix));
    return bindBundle(getCartesianPosition, {getMatrix});
  });

  const Resume = (els: LayoutElement[]) => {
    const sizing = getBlockMinMax(els, NO_FIXED, direction);
    const [{margin}] = els;
    const [ml, mt, mr, mb] = margin;

    return yeet({
      sizing,
      margin: NO_POINT4,
      absolute: true,
      fit: memoFit((into: Point) => {

        const [{fit}] = els;
        const {render, pick, size} = fit(into);

        const sizes = [size];
        const offsets = [[ml, mt]];
        const renders = [render];
        const pickers = [pick];

        sizeRef[0] = into[0];
        sizeRef[1] = into[1];
        sizeRef[2] = size[0];
        sizeRef[3] = size[1];

        const dx = Math.max(0, size[0] - into[0] + ml + mr);
        const dy = Math.max(0, size[1] - into[1] + mt + mb);
        scrollRef[0] = Math.min(scrollRef[0], dx);
        scrollRef[1] = Math.min(scrollRef[1], dy);
        matrix[12] = -scrollRef[0];
        matrix[13] = -scrollRef[1];

        return {
          size,
          render: makeBoxLayout(sizes, offsets, renders, transform),
          pick: makeBoxPicker(sizes, offsets, pickers),
        };
      }),
    });
  };

  return children ? gather(use(Block, {direction, children}), Resume) : null;
}, 'Overflow');
