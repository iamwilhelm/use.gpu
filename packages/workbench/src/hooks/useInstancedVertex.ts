import type { Lazy } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';
import { resolve } from '@use-gpu/core';
import { useMemo, useNoMemo, useCallback, useNoCallback } from '@use-gpu/live';
import { useShaderRef, useNoShaderRef } from '../hooks/useShaderRef';
import { useBoundShader, useNoBoundShader, getBoundShader } from '../hooks/useBoundShader';

import { getInstancedIndex } from '@use-gpu/wgsl/instance/instanced-index.wgsl';
import { getInstancedVertex } from '@use-gpu/wgsl/instance/vertex/instanced.wgsl';

const INSTANCES = {HAS_INSTANCES: true};
const NO_INSTANCES = {HAS_INSTANCES: false};

/** Instanced draw, repeated) or random access */
export const useInstancedVertex = (
  getVertex: ShaderSource,
  instance?: Lazy<number>,
  instances?: ShaderSource,
  elementCount?: Lazy<number>,
): [ShaderSource, Lazy<number>, Record<string, boolean>] => {

  if (!(instance != null || instances)) {
    useNoInstancedVertex();
    return [getVertex, elementCount, NO_INSTANCES];
  }

  const instanceSize = !!instances ? useNoShaderRef() : useShaderRef(elementCount);

  return useMemo(() => {

    const mappedIndex = instanceSize
      ? getBoundShader(getInstancedIndex, [instanceSize])
      : null;

    const boundInstance = getBoundShader(getInstancedVertex, [getVertex, instances, mappedIndex]);

    const totalCount = () => {
      const l = resolve(elementCount) || 0;
      return !instances ? l * (instance || 0) : l;
    };

    return [boundInstance, totalCount, INSTANCES];

  }, [instance, instances, elementCount, instanceSize]);
}

export const useNoInstancedVertex = () => {
  useNoShaderRef();
  useNoMemo();
};
