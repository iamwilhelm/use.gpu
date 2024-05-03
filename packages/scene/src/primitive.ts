import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { DataBounds } from '@use-gpu/core';

import { memo, provide, useCallback, useOne } from '@use-gpu/live';
import { MatrixContext, TransformContext, QueueReconciler, useMatrixContext, useCombinedMatrixTransform } from '@use-gpu/workbench';

import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';
import { getMatrixDifferential } from '@use-gpu/wgsl/transform/diff-matrix.wgsl';

const {signal} = QueueReconciler;

export type PrimitiveProps = {
  _?: number,
};

export const Primitive: LiveComponent<PrimitiveProps> = memo((props: PropsWithChildren<PrimitiveProps>) => {
  const {children} = props;

  const [context] = useCombinedMatrixTransform();

  return [
    signal(),
    provide(TransformContext, context, children)
  ];
}, 'Primitive');
