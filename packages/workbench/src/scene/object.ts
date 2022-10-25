import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { ObjectTrait } from './types';
import { memo, provide } from '@use-gpu/live';
import { chainTo, sourceToModule, bindingToModule } from '@use-gpu/shader/wgsl';
import { mat4 } from 'gl-matrix';

import { TransformContext, DifferentialContext } from '../providers/transform-provider';
import { useShaderRef } from '../hooks/useShaderRef';
import { useBoundShader } from '../hooks/useBoundShader';
import { useCombinedTransform } from '../hooks/useCombinedTransform';

import { useMatrixContext, MatrixContext } from '../providers/matrix-provider';

import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';
import { getMatrixDifferential } from '@use-gpu/wgsl/transform/diff-matrix.wgsl';

const MATRIX_BINDINGS = bundleToAttributes(getCartesianPosition);
const NORMAL_BINDINGS = bundleToAttributes(getMatrixDifferential);

export type ObjectProps = Partial<ObjectTrait> & {
  _?: number,
};

export const Object: LiveComponent<ObjectProps> = (props: PropsWithChildren<ObjectProps>) => {
  const matrix = useMatrixContext();

  const matrixRef = useShaderRef(matrix);
  const boundPosition = useBoundShader(getCartesianPosition, MATRIX_BINDINGS, [matrixRef]);
  const boundDifferential = useBoundShader(getMatrixDifferential, NORMAL_BINDINGS, [matrixRef, normalMatrixRef]);

  const [transform, differential] = useCombinedTransform(boundPosition, boundDifferential);

  return 
  provide(TransformContext, transform,
    provide(DifferentialContext, differential,
      provide(RangeContext, g, children ?? [])
    )
  )
};
