import { LiveComponent, LiveElement, PropsWithChildren } from '@use-gpu/live/types';

import { provide, useContext, useNoContext, useOne } from '@use-gpu/live';

import { Rectangle } from '@use-gpu/core/types'; 
import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';
import { TransformContext } from '../../providers/transform-provider';
import { LayoutContext } from '../../providers/layout-provider';
import { RangeContext } from '../../providers/range-provider';
import { useShaderRef } from '../../hooks/useShaderRef';
import { useBoundShader } from '../../hooks/useBoundShader';
import { useCombinedTransform } from '../../hooks/useCombinedTransform';

import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';
import { mat4, vec3 } from 'gl-matrix';

const MATRIX_BINDINGS = bundleToAttributes(getCartesianPosition);

export type EmbeddedProps = {
  layout?: Rectangle,
  _unused?: boolean,
};

export const Embedded: LiveComponent<EmbeddedProps> = (props: PropsWithChildren<EmbeddedProps>) => {
  const {
    children,
  } = props;

  const layout = props.layout != null ? (useNoContext(LayoutContext), props.layout) : useContext(LayoutContext);

  const [range, matrix] = useOne(() => {
    const [l, t, r, b] = layout;
    const w = r - l;
    const h = b - t;

    const range = [[0, w], [0, h], [-1, 1], [-1, 1]] as [number, number][];
    const matrix = mat4.create();
    mat4.translate(matrix, matrix, vec3.fromValues(l, t, 0));

    return [range, matrix];
  }, layout);

  const ref = useShaderRef(matrix);
  const bound = useBoundShader(getCartesianPosition, MATRIX_BINDINGS, [ref]);
  const transform = useCombinedTransform(bound);

  return (
    provide(TransformContext, transform,
      provide(RangeContext, range, children ?? [])
    )
  );
};
