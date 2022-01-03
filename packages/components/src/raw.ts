import { LiveFiber, LiveFunction, LiveElement } from '@use-gpu/live/types';

export type RawFiber = (fiber: LiveFiber<any>) => LiveElement<any>;
export type LiveReturner = (fiber: RawFiber) => LiveElement<any>;

export const Raw: LiveFunction<LiveReturner> = (fiber) => (f: RawFiber) => f(fiber);
