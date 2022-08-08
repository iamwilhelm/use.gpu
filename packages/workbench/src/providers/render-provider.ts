import type { UseRenderingContextGPU } from '@use-gpu/core';
import { makeContext, useContext, useNoContext } from '@use-gpu/live';

export const RenderContext = makeContext<UseRenderingContextGPU>(undefined, 'RenderContext');

export const useRenderContext = () => useContext(RenderContext);
export const useNoRenderContext = () => useNoContext(RenderContext);
