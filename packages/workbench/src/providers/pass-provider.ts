import type { VirtualDraw } from '../primitives/virtual2';
import type { UseGPURenderContext } from '@use-gpu/core';

import { makeContext, useContext, useNoContext } from '@use-gpu/live';

export type PassContextProps = {
  useVariants: (virtual: VirtualDraw) => null | LiveComponent | LiveComponent[],
  renderContexts: Record<string, UseGPURenderContext>,
  layout?: GPUBindGroupLayout,
  bind?: (...args: any[]) => (passEncoder: GPURenderPassEncoder) => void,
};

export const PassContext = makeContext<PassContextProps>(undefined, 'PassContext');

export const usePassContext = () => useContext<PassContextProps>(PassContext);
export const useNoPassContext = () => useNoContext(PassContext);
