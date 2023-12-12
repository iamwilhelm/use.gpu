import type { Lazy, DataBounds } from '@use-gpu/core';
import type { ShaderModule, ShaderSource } from '@use-gpu/shader';
import type { TransformContextProps } from '../providers/transform-provider';

import { useMemo } from '@use-gpu/live';
import { chainTo, getBundleKey } from '@use-gpu/shader/wgsl';
import { useTransformContext } from '../providers/transform-provider';
import { getBoundShader } from '../hooks/useBoundShader';
import { useMatrixBounds, useNoMatrixBounds, useMatrixTransform, useNoMatrixTransform } from './useMatrixTransform';

import { getChainDifferential } from '@use-gpu/wgsl/transform/diff-chain.wgsl';
import { getEpsilonDifferential } from '@use-gpu/wgsl/transform/diff-epsilon.wgsl';

type TransformProps = Omit<TransformContextProps, 'matrix'>;

export const useCombinedTransform = (
  props?: TransformProps,
  epsilon?: ShaderSource | Lazy<number> | null | false,
) => {
  const context = useTransformContext();
  const {matrix, bounds} = context;

  const matrixBounds = matrix && bounds && props?.bounds ? useMatrixBounds(matrix) : useNoMatrixBounds();
  const matrixTransform = matrix ? useMatrixTransform(matrix, matrixBounds) : useNoMatrixTransform();

  return useMemo(() => {
    const matrixEpsilon = props?.transform && epsilon ? false : null;

    let xform = context;
    if (matrixTransform) xform = chainTransform(matrixTransform, xform, matrixEpsilon);
    if (props?.transform) xform = chainTransform(props, xform, epsilon);
    return xform;
  }, [context, props, matrixTransform]);
};

export const chainTransform = (
  a: TransformProps | null,
  b: TransformProps | null,
  epsilon?: ShaderSource | Lazy<number> | null | false,
): TransformProps => {
  if (a == null) return b;
  if (b == null) return a;

  const {
    transform: transformA,
    differential: differentialA,
    bounds: boundsA,
  } = a;

  const {
    transform: transformB,
    differential: differentialB,
    bounds: boundsB,
  } = b;

  if (transformA == null) return b;
  if (transformB == null) return a;

  const combinedPos  = chainTo(transformA, transformB);

  const combinedDiff = 
    epsilon === false ? null :
    epsilon
    ? getBoundShader(getEpsilonDifferential, [combinedPos, epsilon])
    : differentialA && differentialB
      ? getBoundShader(getChainDifferential, [transform, differentialA, differentialB])
      : differentialA ?? differentialB;

  const combinedBounds = boundsB && boundsA
    ? (b: DataBounds) => boundsB(boundsA(b))
    : null;

  return {
    key: getBundleKey(combinedPos),
    transform: combinedPos,
    differential: combinedDiff,
    bounds: combinedBounds,
  };
};
