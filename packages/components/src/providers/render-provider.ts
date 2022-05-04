import { UseRenderingContextGPU } from '@use-gpu/core/types';
import { makeContext } from '@use-gpu/live';

export const RenderContext = makeContext<UseRenderingContextGPU>(undefined, 'RenderContext');
