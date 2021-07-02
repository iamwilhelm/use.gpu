import { LiveFiber, LiveFunction, LiveElement } from '@use-gpu/live/types';
import { GPUPresentationContext } from '@use-gpu/webgpu/types';

import { enterFiber, exitFiber } from '@use-gpu/live'; 

export type RawFiber = (fiber: LiveFiber<any>) => LiveElement<any>;
export type LiveReturner = (fiber: RawFiber) => LiveElement<any>;

export const Inline: LiveFunction<LiveReturner> = (fiber) => (f: RawFiber) => {
  enterFiber(fiber);
  f(fiber);
  exitFiber();
}
