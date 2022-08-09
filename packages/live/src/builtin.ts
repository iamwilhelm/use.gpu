import type {
  Initial, Setter, Reducer, Key, Task,
  LiveFunction, LiveComponent, LiveFiber, LiveCapture, LiveContext, LiveElement, LiveMap, LiveNode,
  FunctionCall, DeferredCall, HostInterface, ArrowFunction,
  ReactElementInterop,
} from './types';

import { compareFibers } from './util';
import { makeFiber, makeImperativeFunction } from './fiber';
import { getCurrentFiberID } from './current';

/** @hidden */
export const MORPH        = () => {};
/** @hidden */
export const DETACH       = () => {};
/** @hidden */
export const FRAGMENT     = () => {};
/** @hidden */
export const MAP_REDUCE   = () => {};
/** @hidden */
export const GATHER       = () => {};
/** @hidden */
export const MULTI_GATHER = () => {};
/** @hidden */
export const FENCE        = () => {};
/** @hidden */
export const YEET         = () => {};
/** @hidden */
export const PROVIDE      = () => {};
/** @hidden */
export const CAPTURE      = () => {};
/** @hidden */
export const DEBUG        = () => {};
/** @hidden */
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
(CAPTURE      as any).isLiveBuiltin = true;
(DEBUG        as any).isLiveBuiltin = true;
(SUSPEND      as any).isLiveBuiltin = true;

(FRAGMENT     as any).isLiveInline = true;

// Inline render ops
type UseArgs<F> = F extends ArrowFunction ? Parameters<F> : any[];

interface Use<F extends ArrowFunction> {
  (f: LiveFunction<F>): DeferredCall<F>;
  (f: LiveFunction<F>, ...args: UseArgs<F>): DeferredCall<F>;
};

/** Use a call to a Live function, reconciled by numeric index. */
export const use: Use<any> = <F extends ArrowFunction>(
  f: LiveFunction<F>,
  ...args: UseArgs<F>
): DeferredCall<F> => ({f, args, key: undefined, by: getCurrentFiberID()} as any);

/** Use a keyed call to a Live function, reconciled by key. */
export const keyed = <F extends ArrowFunction>(
  f: LiveFunction<F>,
  key?: Key,
  ...args: UseArgs<F>
): DeferredCall<F> => ({f, args, key, by: getCurrentFiberID()} as any);

/** Use a call to a Live Component with only a children prop. */
export const wrap = <F extends ArrowFunction>(
  f: LiveFunction<F>,
  children: any,
): DeferredCall<F> => ({f, args: [{children}], key: undefined, by: getCurrentFiberID()} as any);

/** Add arguments to an existing call or calls. */
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

/** Morph a call to a Live function.

Morphing will change a component's type, without forcibly unmounting its children.

Children are still reconciled as usual, and only stay if re-rendered by the new parent.

The parent that is being morphed still loses all its own state.
*/
export const morph = (
  calls: LiveNode<any>,
  key?: Key,
): DeferredCall<() => void> => ({f: MORPH, args: calls as any, key, by: getCurrentFiberID()} as any);

/** Detach the rendering of a Live subtree.

The callback is invoked with a render function, which it can call repeatedly to render the detached fiber. */
export const detach = <F extends ArrowFunction>(
  call: DeferredCall<F>,
  callback: (render: () => void, fiber: LiveFiber<F>) => void,
  key?: Key,
): DeferredCall<() => void> => ({f: DETACH, args: [call, callback], key, by: getCurrentFiberID()} as any);

/** Holds an array of Live calls to reconcile. */
export const fragment = (
  calls: LiveNode<any>,
  key?: Key,
): DeferredCall<() => void> => {
  if (Array.isArray(calls)) return calls as any;
  return [calls] as any;
}

/** Wrap a fragment in a debug node to mark it. */
export const debug = (
  calls: LiveNode<any>,
  key?: Key,
): DeferredCall<() => void> => {
  if (Array.isArray(calls)) return ({f: DEBUG, args: calls, key, by: getCurrentFiberID()} as any);
  return ({f: DEBUG, args: [calls], key} as any);
}

/** Reduce values from a subtree, using the given `map(...)` and `reduce(...)`. */
export const mapReduce = <R, T>(
  calls?: LiveNode<any>,
  map?: (t: T) => R,
  reduce?: (a: R, b: R) => R,
  then?: LiveFunction<(r: R) => LiveElement<any>>,
  key?: Key,
): DeferredCall<() => void> => ({f: MAP_REDUCE, args: [calls, map, reduce, then], key, by: getCurrentFiberID()} as any);

/** Gather items from a subtree, into a flat array. */
export const gather = <T>(
  calls?: LiveNode<any>,
  then?: LiveFunction<(r: T[]) => LiveElement<any>>,
  key?: Key,
): DeferredCall<() => void> => ({f: GATHER, args: [calls, then], key, by: getCurrentFiberID()} as any);

/** Multi-gather items from a subtree, by object key. */
export const multiGather = <T>(
  calls?: LiveNode<any>,
  then?: LiveFunction<(r: Record<string, T[]>) => LiveElement<any>>,
  key?: Key,
): DeferredCall<() => void> => ({f: MULTI_GATHER, args: [calls, then], key, by: getCurrentFiberID()} as any);

/** Fence gathered items from a subtree. */
export const fence = <T>(
  calls?: LiveNode<any>,
  then?: LiveFunction<(r: T[]) => LiveElement<any>>,
  key?: Key,
): DeferredCall<() => void> => ({f: FENCE, args: [calls, then], key, by: getCurrentFiberID()} as any);

/** Yeet value(s) upstream. */
export const yeet = <T>(
  value?: T,
  key?: Key,
): DeferredCall<() => void> => ({f: YEET, arg: value, key, by: getCurrentFiberID()} as any);

/** Provide a value for a Live context. */
export const provide = <T, C>(
  context: LiveContext<C>,
  value: T,
  calls?: LiveNode<any>,
  key?: Key,
): DeferredCall<() => void> => ({f: PROVIDE, args: [context, value, calls], key, by: getCurrentFiberID()} as any);

/** Capture values from a Live context. */
export const capture = <T, C>(
  context: LiveCapture<C>,
  calls?: LiveNode<any>,
  then?: LiveFunction<(r: T) => void>,
  key?: Key,
): DeferredCall<() => void> => ({f: CAPTURE, args: [context, calls, then], key, by: getCurrentFiberID()} as any);

/** Component has side-effects, and will re-render even if props object is identical. */
export const imperative = makeImperativeFunction;

/** Yeet a suspend symbol. */
export const suspend = () => yeet(SUSPEND);

/** LOL. Look, _you_ go try to make JSX.Element polymorphic. */
export const into = (children: any): any => children;

export interface MakeContext<T> {
  <T>(initialValue: T, displayName?: string): LiveContext<T>;
  <T>(initialValue: undefined, displayName?: string): LiveContext<T>;
  <T>(initialValue: null, displayName?: string): LiveContext<T | null>;
};

/** Make Live context for holding shared value for child nodes (defaulted, required or optional). */
export const makeContext: MakeContext<unknown> = <T>(initialValue?: T | null, displayName?: string) => ({
  initialValue,
  displayName,
  context: true,
});

/** Make Live capture for holding shared value for child nodes (defaulted, required or optional). */
export const makeCapture = <T>(displayName?: string): LiveCapture<T> => ({
  displayName,
  capture: true,
});

/** Flatten a captured value map into an ordered array. */
export const captureFibers = <T>(map: Map<LiveFiber<any>, T>): [LiveFiber<any>, T][] => {
  const entries = Array.from(map.entries());
  entries.sort((a, b) => compareFibers(a[0], b[0]));
  return entries;
}

/** Flatten a captured value map into an ordered array. */
export const captureValues = <T>(
  map: LiveMap<T>,
): T[] => {
  const keys = Array.from(map.keys());
  keys.sort((a, b) => compareFibers(a, b));
  return keys.map(k => map.get(k)!);
}

/** Get last node of captured value map. */
export const captureLastFiber = <T>(
  map: LiveMap<T>,
): [LiveFiber<any>, T] | null => {
  const keys = Array.from(map.keys());
  keys.sort((a, b) => compareFibers(a, b));
  
  const key = keys[keys.length - 1];
  return key ? [key, map.get(key)!] : null;
}

/** Get last value yielded from captured value map. */
export const captureTail = <T>(
  map: LiveMap<T>
): T | null => captureLastFiber(map)?.[1] ?? null;
