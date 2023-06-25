import type { LiveComponent, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { Rectangle } from '@use-gpu/core'; 

import { provide, useContext, useNoContext, useMemo } from '@use-gpu/live';
import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';
import {
  TransformContext, LayoutContext,
  useShaderRef, useBoundShader, useCombinedTransform,
} from '@use-gpu/workbench';

import { RangeContext } from '../providers/range-provider';

import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';
import { mat4, vec3 } from 'gl-matrix';

export type EmbeddedProps = {
  layout?: Rectangle,
  normalize?: boolean,
};

export const Embedded: LiveComponent<EmbeddedProps> = (props: PropsWithChildren<EmbeddedProps>) => {
  const {
    normalize,
    children,
  } = props;

  const layout = props.layout != null ? (useNoContext(LayoutContext), props.layout) : useContext(LayoutContext);

  const [range, matrix] = useMemo(() => {
    const [l, t, r, b] = layout;
    const w = r - l;
    const h = b - t;

    let range;
    let matrix;
    if (normalize) {
      const sx = 2/w;
      const sy = 2/h;
      range = [[-1, 1], [-1, 1], [-1, 1], [-1, 1]] as [number, number][];
      matrix = mat4.fromValues(
        sx, 0, 0, w/2,
        0, sy, 0, h/2,
        0,  0, 1, 0,
        0,  0, 0, 1,
      );
    }
    else {
      range = [[0, w], [0, h], [-1, 1], [-1, 1]] as [number, number][];
      matrix = mat4.create();
    }
    mat4.translate(matrix, matrix, vec3.fromValues(l, t, 0));

    return [range, matrix];
  }, [layout, normalize]);

  const ref = useShaderRef(matrix);
  const bound = useBoundShader(getCartesianPosition, [ref]);
  const context = useCombinedTransform(bound);

  return (
    provide(TransformContext, context,
      provide(RangeContext, range, children ?? [])
    )
  );
};
