import type { VirtualDraw } from '../pass/types';
import type { UseGPURenderContext } from '@use-gpu/core';
import type { LiveComponent } from '@use-gpu/live';

import { makeContext, useContext, useNoContext } from '@use-gpu/live';

export type PassContextProps = {
  buffers: Record<string, UseGPURenderContext[]>,
  context: Record<string, any>,
  layout?: GPUBindGroupLayout,
  bind?: (...args: any[]) => (passEncoder: GPURenderPassEncoder) => void,
};

export type VirtualContextProps = (virtual: VirtualDraw, hovered: boolean) => null | LiveComponent | LiveComponent[];

export const PassContext = makeContext<PassContextProps>(undefined, 'PassContext');
export const VirtualContext = makeContext<VirtualContextProps>(undefined, 'VirtualContext');

export const usePassContext = () => useContext<PassContextProps>(PassContext);
export const useNoPassContext = () => useNoContext(PassContext);

export const useVirtualContext = () => useContext<VirtualContextProps>(VirtualContext);
export const useNoVirtualContext = () => useNoContext(VirtualContext);
