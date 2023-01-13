import type { Lazy, DataBounds } from '@use-gpu/core';
import type { ShaderModule, ShaderSource } from '@use-gpu/shader';

import { useMemo } from '@use-gpu/live';
import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';
import { useTransformContext } from '../providers/transform-provider';
import { getBoundShader } from '../hooks/useBoundShader';

import { getChainDifferential } from '@use-gpu/wgsl/transform/diff-chain.wgsl';
import { getEpsilonDifferential } from '@use-gpu/wgsl/transform/diff-epsilon.wgsl';

const DIFF_CHAIN_BINDINGS = bundleToAttributes(getChainDifferential);
const DIFF_EPSILON_BINDINGS = bundleToAttributes(getEpsilonDifferential);

export const useCombinedTransform = (
  transform?: ShaderModule | null,
  differential?: ShaderModule | null,
  bounds?: ((bounds: DataBounds) => DataBounds) | null,
  epsilon?: ShaderSource | Lazy<number> | null,
) => {
  const {
    transform: transformCtx,
    differential: differentialCtx,
    bounds: boundsCtx,
  } = useTransformContext();

  return useMemo(() => {
    if (transform == null) return {transform: transformCtx, differential: differentialCtx, bounds: boundsCtx};

    const combinedPos  = transformCtx ? chainTo(transform, transformCtx) : transform;
    const combinedDiff = epsilon
      ? getBoundShader(getEpsilonDifferential, DIFF_EPSILON_BINDINGS, [combinedPos, epsilon])
      : differentialCtx && differential
        ? getBoundShader(getChainDifferential, DIFF_CHAIN_BINDINGS, [transform, differential, differentialCtx])
        : differentialCtx ?? differential;
    const combinedBounds = boundsCtx ? (bounds ? (b: DataBounds) => boundsCtx(bounds(b)) : null) : bounds;

    return {
      transform: combinedPos,
      differential: combinedDiff,
      bounds: combinedBounds,
    };
  }, [transformCtx, differentialCtx, boundsCtx, transform, differential, bounds, epsilon]);
};
