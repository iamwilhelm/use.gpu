import type { Lazy } from '@use-gpu/core';
import type { ShaderModule, ShaderSource } from '@use-gpu/shader';

import { useOne, useVersion } from '@use-gpu/live';
import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';
import { useTransformContext, useDifferentialContext } from '../providers/transform-provider';
import { getBoundShader } from '../hooks/useBoundShader';

import { getChainTransform } from '@use-gpu/wgsl/transform/chain.wgsl';
import { getChainDifferential } from '@use-gpu/wgsl/transform/diff-chain.wgsl';
import { getEpsilonDifferential } from '@use-gpu/wgsl/transform/diff-epsilon.wgsl';

const CHAIN_BINDINGS = bundleToAttributes(getChainDifferential);
const DIFF_CHAIN_BINDINGS = bundleToAttributes(getChainDifferential);
const DIFF_EPSILON_BINDINGS = bundleToAttributes(getEpsilonDifferential);

export const useCombinedTransform = (
  position?: ShaderModule | null,
  differential?: ShaderModule | null,
  epsilon?: ShaderSource | Lazy<number>,
) => {
  const transformCtx = useTransformContext();
  const differentialCtx = useDifferentialContext();

  const version = useVersion(transformCtx) + useVersion(differentialCtx) + useVersion(position) + useVersion(differential);

  return useOne(() => {
    if (position == null) return [transformCtx, differentialCtx];

    const combinedPos  = transformCtx ? chainTo(position, transformCtx) : position;
    const combinedDiff = epsilon
      ? getBoundShader(getEpsilonDifferential, DIFF_EPSILON_BINDINGS, [combinedPos, epsilon])
      : differentialCtx && differential
        ? getBoundShader(getChainDifferential, DIFF_CHAIN_BINDINGS, [position, differential, differentialCtx])
        : differentialCtx ?? differential;

    return [combinedPos, combinedDiff];
  }, version);
};
