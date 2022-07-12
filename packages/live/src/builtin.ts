import {
  Initial, Setter, Reducer, Key, Task,
  LiveFunction, LiveComponent, LiveFiber, LiveContext, LiveElement, LiveNode,
  FunctionCall, DeferredCall, HostInterface, ArrowFunction,
  ReactElementInterop,
} from './types';

import { compareFibers } from './util';
import { makeFiber, makeImperativeFunction } from './fiber';
import { getCurrentFiberID } from './current';

export const MORPH        = () => {};
export const DETACH       = () => {};
export const FRAGMENT     = () => {};
export const MAP_REDUCE   = () => {};
export const GATHER       = () => {};
export const MULTI_GATHER = () => {};
export const FENCE        = () => {};
export const YEET         = () => {};
export const PROVIDE      = () => {};
export const CONSUME      = () => {};
export const DEBUG        = () => {};
export const SUSPEND      = () => {};

(MORPH        as any).isLiveBuiltin = true;
(DETACH       as any).isLiveBuiltin = true;
(FRAGMENT     as any).isLiveBuiltin = true;
(MAP_REDUCE   as any).isLiveBuiltin = true;
(GATHER       as any).isLiveBuiltin = true;
(MULTI_GATHER as any).isLiveBuiltin = true;
(FENCE        as any).isLiveBuiltin = true;
(YEET         as any).isLiveBuiltin = true;
(PROVIDE      as any).isLiveBuiltin = true;
(CONSUME      as any).isLiveBuiltin = true;
(DEBUG        as any).isLiveBuiltin = true;
(SUSPEND      as any).isLiveBuiltin = true;

(FRAGMENT     as any).isLiveInline = true;

// Inline render ops
type UseArgs<F> = F extends ArrowFunction ? Parameters<F> : any[];

interface Use<F extends Function> {
  (f: LiveFunction<F>): DeferredCall<F>;
  (f: LiveFunction<F>, ...args: UseArgs<F>): DeferredCall<F>;
};

/** Use a call to a Live function */
export const use: Use<any> = <F extends Function>(
  f: LiveFunction<F>,
  ...args: UseArgs<F>
): DeferredCall<F> => ({f, args, key: undefined, by: getCurrentFiberID()} as any);

/** Use a keyed call to a Live function */
export const keyed = <F extends Function>(
  f: LiveFunction<F>,
  key?: Key,
  ...args: UseArgs<F>
): DeferredCall<F> => ({f, args, key, by: getCurrentFiberID()} as any);

/** Use a call to a Live Component with only a children prop */
export const wrap = <F extends Function>(
  f: LiveFunction<F>,
  children: any,
): DeferredCall<F> => ({f, args: [{children}], key: undefined, by: getCurrentFiberID()} as any);

/** Add arguments to an existing call or calls */
export const extend = (
  calls: LiveNode<any>,
  props: Record<string, any>,
): LiveElement<any> => {
  if (typeof calls === 'string') return null;
  if (typeof calls === 'function') return null;
  if (!calls) return calls;

  if (Array.isArray(calls)) return calls.map(call => extend(call, props)) as any;
  if ('props' in calls) {
    return extend(keyed(calls.type, calls.key, calls.props), props);
  }
  else if (calls.args?.length) {
    const [existing, ...rest] = calls.args;
    return ({...calls, args: [{...existing, ...props}, ...rest] });
  }
  if (!calls) return calls;
  return ({...calls, args: [props] } as any);
}

/** Morph a call to a Live function */
export const morph = (
  calls: LiveNode<any>,
  key?: Key,
): DeferredCall<() => void> => ({f: MORPH, args: calls as any, key, by: getCurrentFiberID()} as any);

/** Detach the rendering of a Live subtree */
export const detach = <F extends Function>(
  call: DeferredCall<F>,
  callback: (render: () => void, fiber: LiveFiber<F>) => void,
  key?: Key,
): DeferredCall<() => void> => ({f: DETACH, args: [call, callback], key, by: getCurrentFiberID()} as any);

/** Reconcile an array of Live calls */
export const fragment = (
  calls: LiveNode<any>,
  key?: Key,
): DeferredCall<() => void> => {
  if (Array.isArray(calls)) return calls as any;
  return [calls] as any;
}

/** Wrap a fragment in a debug node to mark it */
export const debug = (
  calls: LiveNode<any>,
  key?: Key,
): DeferredCall<() => void> => {
  if (Array.isArray(calls)) return ({f: DEBUG, args: calls, key, by: getCurrentFiberID()} as any);
  return ({f: DEBUG, args: [calls], key} as any);
}

/** Reduce values from a subtree, using the given `map(...)` and `reduce(...)` */
export const mapReduce = <R, T>(
  calls?: LiveNode<any>,
  map?: (t: T) => R,
  reduce?: (a: R, b: R) => R,
  done?: LiveFunction<(r: R) => LiveElement<any>>,
  key?: Key,
): DeferredCall<() => void> => ({f: MAP_REDUCE, args: [calls, map, reduce, done], key, by: getCurrentFiberID()} as any);

/** Gather items from a subtree, into a flat array */
export const gather = <T>(
  calls?: LiveNode<any>,
  done?: LiveFunction<(r: T[]) => LiveElement<any>>,
  key?: Key,
): DeferredCall<() => void> => ({f: GATHER, args: [calls, done], key, by: getCurrentFiberID()} as any);

/** Multi-gather items from a subtree, by object key */
export const multiGather = <T>(
  calls?: LiveNode<any>,
  done?: LiveFunction<(r: Record<string, T[]>) => LiveElement<any>>,
  key?: Key,
): DeferredCall<() => void> => ({f: MULTI_GATHER, args: [calls, done], key, by: getCurrentFiberID()} as any);

/** Fence gathered items from a subtree */
export const fence = <T>(
  calls?: LiveNode<any>,
  done?: LiveFunction<(r: T[]) => LiveElement<any>>,
  key?: Key,
): DeferredCall<() => void> => ({f: FENCE, args: [calls, done], key, by: getCurrentFiberID()} as any);

/** Yeet value(s) upstream */
export const yeet = <T>(
  value?: T,
  key?: Key,
): DeferredCall<() => void> => ({f: YEET, arg: value, key, by: getCurrentFiberID()} as any);

/** Provide a value for a Live context */
export const provide = <T, C>(
  context: LiveContext<C>,
  value: T,
  calls?: LiveNode<any>,
  key?: Key,
): DeferredCall<() => void> => ({f: PROVIDE, args: [context, value, calls], key, by: getCurrentFiberID()} as any);

/** Consume values from a co-context */
export const consume = <T, C>(
  context: LiveContext<C>,
  calls?: LiveNode<any>,
  done?: LiveFunction<(r: T) => void>,
  key?: Key,
): DeferredCall<() => void> => ({f: CONSUME, args: [context, calls, done], key, by: getCurrentFiberID()} as any);

/** Component has side-effects */
export const imperative = makeImperativeFunction;

/** Yeet a suspend symbol */
export const suspend = () => yeet(SUSPEND);

export interface MakeContext<T> {
  <T>(i: T, d?: string): LiveContext<T>;
  <T>(i: undefined, d?: string): LiveContext<T>;
  <T>(i: null, d?: string): LiveContext<T | null>;
};

/** Make Live context for holding shared value for child nodes */
export const makeContext: MakeContext<unknown> = <T>(initialValue?: T | null, displayName?: string) => ({
  initialValue,
  displayName,
});
export const createContext = makeContext;

/** Flatten a consumed value registry into an ordered array. */
export const consumeFibers = <T>(registry: Map<LiveFiber<any>, T>): [LiveFiber<any>, T][] => {
  const entries = Array.from(registry.entries());
  entries.sort((a, b) => compareFibers(a[0], b[0]));
  return entries;
}

/** Flatten a consumed value registry into an ordered array. */
export const consumeValues = <T>(registry: Map<LiveFiber<any>, T>): T[] => {
  const keys = Array.from(registry.keys());
  keys.sort((a, b) => compareFibers(a, b));
  return keys.map(k => registry.get(k)!);
}

/** Get last node of consumed value registry */
export const consumeTail = <T>(
  registry: Map<LiveFiber<any>, T>,
): [LiveFiber<any>, T] => {
  const entries = consumeFibers(registry);
  return entries[entries.length - 1];
}

/** Get last value yielded from consumed value registry */
export const consumeTailValue = <T>(
  registry: Map<LiveFiber<any>, T>,
): T => consumeTail(registry)?.[1];

/** Iterate over consumed value registry in order. */
export const forFibers = <T>(
  registry: Map<LiveFiber<any>, T>,
  callback: (f: LiveFiber<any>, v: T) => void,
) => {
  for (const [f, v] of consumeFibers(registry)) callback(f, v);
}
