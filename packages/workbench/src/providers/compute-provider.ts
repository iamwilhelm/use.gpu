import type { StorageSource } from '@use-gpu/core';

import { makeContext, useContext, useNoContext } from '@use-gpu/live';

export type ComputeContextProps = {
  width: number,
  height: number,
  depth: number,
  target: StorageSource,
  swapView: () => void,
};

export const ComputeContext = makeContext<ComputeContextProps>(undefined, 'ComputeContext');

export const useComputeContext = () => useContext<ComputeContextProps>(ComputeContext);
export const useNoComputeContext = () => useNoContext(ComputeContext);
