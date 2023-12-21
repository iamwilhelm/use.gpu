import type { Lazy } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';
import { resolve } from '@use-gpu/core';
import { useOne, useNoOne, useCallback, useNoCallback } from '@use-gpu/live';
import { useShaderRef, useNoShaderRef } from '../hooks/useShaderRef';

const NO_TUPLE = [null, 0];

/** Instanced draw, repeated) or random access */
export const useInstanceCount = (
  instances: ShaderSource,
  geometryCount?: Lazy<number>,
  mappedInstances?: boolean,
): [
  Lazy<number> | null,
  Lazy<number>,
] => {
  if (!instances) {
    useNoInstanceCount();
    return [null, geometryCount];
  }

  const instanceSize = mappedInstances ? useShaderRef(geometryCount) : useNoShaderRef();
  const totalCount = useCallback(() => {
    const l = (instances as any)?.length || 0;
    return mappedInstances ? l : l * resolve(geometryCount);
  }, [instances, geometryCount, mappedInstances]);

  return [instanceSize, totalCount];
};

export const useNoInstanceCount = () => {
  useNoOne();
  useNoShaderRef();
  useNoCallback();
};

