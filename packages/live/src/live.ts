import {
  Initial, Setter, Reducer, Key, Task,
  LiveFunction, LiveFiber, LiveElement,
  DeferredCall, HostInterface,
} from './types';

import { makeFiber } from './fiber';

export const DETACH     = () => () => {};
export const RECONCILE  = () => () => {};
export const MAP_REDUCE = () => () => {};
export const YEET       = () => () => {};

(DETACH     as any).isLiveBuiltin = true;
(RECONCILE  as any).isLiveBuiltin = true;
(MAP_REDUCE as any).isLiveBuiltin = true;
(YEET       as any).isLiveBuiltin = true;

// Prepare to call a live function with optional given persistent fiber
export const bind = <F extends Function>(f: LiveFunction<F>, fiber?: LiveFiber<F> | null, base?: number = 0) => {
  fiber = fiber ?? makeFiber(f, null);

  const bound = f(fiber);
  if (bound.length === 0) {
    return () => {
      fiber.pointer = base;
      const {yeeted} = fiber;
      if (yeeted) yeeted.reduced = yeeted.value = undefined;
      return bound();
    }
  }
  if (bound.length === 1) {
    return (arg: any) => {
      fiber.pointer = base;
      const {yeeted} = fiber;
      if (yeeted) yeeted.reduced = yeeted.value = undefined;
      return bound(arg);
    }
  }
  return (...args: any[]) => {
    fiber.pointer = base;
    const {yeeted} = fiber;
    if (yeeted) yeeted.reduced = yeeted.value = undefined;
    return bound.apply(null, args);
  }
};

// use a call to a live function
export const use = <F extends Function>(
  f: LiveFunction<F>,
  key?: Key,
) => (
  ...args: any[]
): DeferredCall<F> => ({f, args, key});

// Detach the rendering of a subtree
export const detach = <F extends Function>(
  call: DeferredCall<F>,
  callback: (fiber: LiveFiber<F>) => void,
  key?: Key,
): DeferredCall<() => void> => ({f: DETACH, args: [call, callback], key});

// Reconcile an array of calls
export const reconcile = <F extends Function>(
  calls: LiveElement<any>,
  key?: Key,
): DeferredCall<() => void> => {
  if (Array.isArray(calls)) return ({f: RECONCILE, args: calls, key});
  return ({f: RECONCILE, arg: [calls], key});
}

// Reduce a subtree
export const mapReduce = <R, T>(
  calls: LiveElement<any>,
  map?: (t: T) => R,
  reduce?: (a: R, b: R) => R,
  done?: (r: R) => void,
  key?: Key,
): DeferredCall<() => void> => ({f: MAP_REDUCE, args: [calls, map, reduce, done], key});

// Yeet value(s) upstream
export const yeet = <T>(
  value: T,
  key?: Key,
): DeferredCall<() => void> => ({f: YEET, arg: value, key});

// Hold call info for a fiber
export const makeFunctionCall = <F extends Function>(
  f: LiveFunction<F>,
  args?: any[],
): FunctionCall<F> => ({f, args});
