import type { StorageTarget } from '@use-gpu/core';

import { makeContext, useContext, useNoContext } from '@use-gpu/live';

export type ComputeContextProps = StorageTarget;

export const ComputeContext = makeContext<ComputeContextProps>(undefined, 'ComputeContext');

export const useComputeContext = () => useContext<ComputeContextProps>(ComputeContext);
export const useNoComputeContext = () => useNoContext(ComputeContext);
