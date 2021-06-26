import {
  Initial, Setter, Reducer, Key, Task,
  LiveFunction, LiveFiber,
  DeferredCall, HostInterface,
} from './types';

import { bind } from './live';
import { makeFiber, makeSubFiber } from './fiber';
import { isSameDependencies } from './util';

export const NOP = () => {};
export const NO_DEPS = [] as any[];
export const NO_RESOURCE = {tag: null, value: null};
export const STATE_SLOTS = 2;

export const reserveState = (slots: number) => slots * STATE_SLOTS;
export const pushState = <F>(fiber: LiveFiber<F>) => {
  if (!fiber.state) fiber.state = [];

  const i = fiber.pointer;
  fiber.pointer += STATE_SLOTS;

  return i;
}

// Memoize a live function on all its arguments (shallow comparison per arg)
// Unlike <Memo> this does not create a new sub-fiber
export const memoArgs = <F extends Function>(
  f: LiveFunction<F>,
  name?: string,
) => {
  const g = (
    fiber: LiveFiber<F>,
  ) => {
    const bound = bind(f, fiber, reserveState(1));
    return (...args: any[]) => {
      const value = useMemo(fiber)(() => bound(args), args);
      return value;
    };
  };
  (g as any).displayName = name != null ? `Memo(${name})` : `Memo`;
  return g;
}

// Memoize a live function with 1 argument on its object props (shallow comparison per arg)
export const memoProps = <F extends Function>(
  f: LiveFunction<F>,
  name?: string,
) => {
  const g = (
    fiber: LiveFiber<F>,
  ) => {
    const bound = bind(f, fiber, reserveState(1));
    return (props: Record<string, any>) => {
      const args = [] as any[];
      for (let k in props) {
        args.push(k);
        args.push(props[k]);
      }

      const value = useMemo(fiber)(() => bound(props), args);
      return value;
    };
  };
  (g as any).displayName = name != null ? `Memo(${name})` : `Memo`;
  return g;
}

// Allocate state value and a setter for it, initializing with the given value or function
export const useState = <S, F extends Function = any>(fiber: LiveFiber<F>) => <T = S>(
  initialState: Initial<T>,
): [
  T,
  Setter<T>,
] => {
  const i = pushState(fiber);
  let {state, host} = fiber;

  let value    = state[i];
  let setValue = state[i + 1];

  if (value === undefined) {
    value = (initialState instanceof Function) ? initialState() : initialState;
    setValue = host
      ? (value: Reducer<T>) => host.schedule(fiber, () => {
          if (value instanceof Function) state[i] = value(state[i]);
          else state[i] = value;
        })
      : NOP;

    state[i] = value;
    state[i + 1] = setValue;
  }

  return [value as unknown as T, setValue];
}

// Memoize a value with given dependencies
export const useMemo = <S, F extends Function = any>(fiber: LiveFiber<F>) => <T = S>(
  initialState: () => T,
  dependencies: any[] = NO_DEPS,
): T => {
  const i = pushState(fiber);
  let {state, host} = fiber;

  let value = state[i];
  const deps = state[i + 1];

  if (!isSameDependencies(deps, dependencies)) {
    value = initialState();

    state[i] = value;
    state[i + 1] = dependencies;
  }

  return value as unknown as T;
}

// Memoize a value with one dependency
export const useOne = <S, F extends Function = any>(fiber: LiveFiber<F>) => <T = S>(
  initialState: () => T,
  dependency: any = null,
): T => {
  const i = pushState(fiber);
  let {state, host} = fiber;

  let value = state[i];
  const dep = state[i + 1];

  if (dep !== dependency) {
    value = initialState();

    state[i] = value;
    state[i + 1] = dependency;
  }

  return value as unknown as T;
}

// Memoize a function with given dependencies
export const useCallback = <F extends Function>(fiber: LiveFiber<F>) => <T extends Function>(
  initialValue: T,
  dependencies: any[] = NO_DEPS,
): T => {
  const i = pushState(fiber);
  let {state, host} = fiber;

  let value = state[i];
  const deps = state[i + 1];

  if (!isSameDependencies(deps, dependencies)) {
    value = initialValue;

    state[i] = value;
    state[i + 1] = dependencies;
  }

  return value as unknown as T;
}

// Bind immediately to a resource, with auto-cleanup on dep change or unmount
export const useResource = <F extends Function>(
  fiber: LiveFiber<F>,
) => <R>(
  callback: (dispose: (f: Function) => void) => R,
  dependencies: any[] = NO_DEPS,
): R => {
  const i = pushState(fiber);
  let {state, host} = fiber;

  let {tag} = state[i] || NO_RESOURCE;
  const deps = state[i + 1];

  if (!isSameDependencies(deps, dependencies)) {

    if (!tag) {
      tag = makeResourceTag();
      state[i] = {tag, value: null};

      if (host) host.track(fiber, tag);
    }
    else {
      tag(null);
    }

    state[i + 1] = dependencies;

    const value = callback(tag);
    state[i].value = value;
    return value;
  }

  // Assume if return type is used, it's T's
  return (undefined as unknown as R);
}

// Use a new fiber for forked rendering
export const useSubFiber = <F extends Function>(
  fiber: LiveFiber<F>,
) => <T extends Function>(
  node: DeferredCall<T>
): LiveFiber<T> => {
  const i = pushState(fiber);
  let {state, host} = fiber;

  let sub = state[i];

  if (!sub || sub.f !== node.f) {
    sub = makeSubFiber(fiber, node);

    state[i] = sub;
  }
  else {
    sub.args = node.args;
  }

  return ctx;
}

// Cleanup effect tracker
// Calls previous cleanup before accepting new one
export const makeResourceTag = () => {
  let cleanup = undefined as Task | undefined;

  return (f?: Task) => {
    if (cleanup) cleanup();
    cleanup = f;
  }
}
