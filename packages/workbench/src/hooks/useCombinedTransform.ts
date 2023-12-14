import type { Lazy, DataBounds } from '@use-gpu/core';
import type { ShaderModule, ShaderSource } from '@use-gpu/shader';
import type { TransformContextProps } from '../providers/transform-provider';

import { useMemo } from '@use-gpu/live';
import { chainTo, getBundleKey } from '@use-gpu/shader/wgsl';
import { useTransformContext, TransformBounds } from '../providers/transform-provider';
import { getBoundShader } from '../hooks/useBoundShader';
import { useCombinedMatrix, useMatrixBounds, useNoMatrixBounds, useMatrixTransform, useNoMatrixTransform } from './useMatrixTransform';

import { getChainDifferential } from '@use-gpu/wgsl/transform/diff-chain.wgsl';
import { getEpsilonDifferential } from '@use-gpu/wgsl/transform/diff-epsilon.wgsl';

export const useCombinedTransform = (
  transform?: TransformContextProps | ShaderModule | null,
  differential?: ShaderModule | null,
  bounds?: TransformBounds | null,
) => {
  const parent = useTransformContext();

  return useMemo(() => {
    if (!transform) return parent;

    let key;
    if ('transform' in transform) ({key, transform, differential, bounds} = transform);

    const t = transform as ShaderModule;
    if (!key) key = getBundleKey(t) ^ (differential ? getBundleKey(differential) : 0);

    return chainTransform({key, transform: t, differential, bounds}, parent);
  }, [parent, transform, differential, bounds]);
};

export const useCombinedEpsilonTransform = (
  transform: ShaderModule | null,
  epsilon?: ShaderSource | Lazy<number> = 1e-3,
) => {
  const parent = useTransformContext();

  return useMemo(() => {
    if (!transform) return parent;

    const t = transform as ShaderModule;
    const k = getBundleKey(t);

    const chained = chainTransform({key: k, transform}, parent);
    const differential = getBoundShader(getEpsilonDifferential, [chained.transform, epsilon]);

    const key = k ^ getBundleKey(differential);
    return {...chained, key, differential};
  }, [parent, transform, epsilon]);
};

export const useCombinedMatrixTransform = (
  matrix?: mat4 | null,
): [TransformContextProps, mat4] => {
  const combined = useCombinedMatrix(matrix);

  const bounds = useMatrixBounds(combined);
  const props = useMatrixTransform(combined, bounds);

  const parent = useTransformContext();

  const context = useMemo(() => {
    const chained = chainTransform(props, parent.matrix ?? parent);
    return {...chained, matrix: parent.matrix ?? {}};
  }, [props, parent]);

  return [context, combined];
};

export const chainTransform = (
  a: TransformContextProps | null,
  b: TransformContextProps | null,
): TransformContextProps => {
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

  const combinedDiff = differentialA && differentialB
      ? getBoundShader(getChainDifferential, [transformA, differentialA, differentialB])
      : null;

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
