import {
  Initial, Setter, Reducer, Key, Task,
  LiveFunction, LiveFiber, LiveContext,
  DeferredCall, HostInterface, Hook,
} from './types';

import { bind, CURRENT_FIBER } from './live';
import { makeFiber, makeStaticContinuation, bustFiberCaches, scheduleYeetRoots } from './fiber';
import { isSameDependencies } from './util';
import { formatNode } from './debug';

export const NOP = () => {};
export const NO_DEPS = [] as any[];
export const NO_RESOURCE = {tag: null, value: null};
export const STATE_SLOTS = 3;

export const reserveState = (slots: number) => slots * STATE_SLOTS;
export const pushState = <F extends Function>(fiber: LiveFiber<F>, hookType: Hook) => {
  let {state, pointer} = fiber;
  if (!state) state = fiber.state = [];
  fiber.pointer += STATE_SLOTS;
  
  const marker = state![pointer];
  if (marker === undefined) state![pointer] = hookType;
  else if (marker !== hookType) throw new Error("Hooks were not called in the same order as last render.");

  return pointer + 1;
}
export const yoloState = <F extends Function>(fiber: LiveFiber<F>, hookType: Hook) => {
  let {state, pointer} = fiber;
  if (!state) return;

  let n = state.length;
  let j = pointer;
  while (j < n) {
    const type = state[j];
    const i = j + 1;
    switch (type) {
      case Hook.STATE:
      case Hook.MEMO:
      case Hook.ONE:
      case Hook.CALLBACK:
        useNoHook(type);
        break;
      case Hook.RESOURCE:
        useNoResource();
        break;
      case Hook.CONTEXT:
        useNoContext();
        break;
      case Hook.CONSUMER:
        useNoConsumer();
        break;
      case Hook.YOLO:
        useNoYolo();
        break;
    }
  }
}

export const useNoHook = (hookType: Hook) => () => {
  const fiber = useFiber();

  const i = pushState(fiber, hookType);
  const {state} = fiber;
  state![i] = null;
  state![i + 1] = null;
};

export const useFiber = () => {
  const fiber = CURRENT_FIBER;
  if (!fiber) throw new Error("Calling a hook outside a bound function");
  return fiber;
}

// Memoize a live function on all its arguments (shallow comparison per arg)
// Unlike <Memo> this does not create a new sub-fiber
export const memoArgs = <F extends Function>(
  f: LiveFunction<F>,
  name?: string,
) => {
  const g = ((
    fiber: LiveFiber<F>,
  ) => {
    const bound = bind(f, fiber, reserveState(1));
    fiber.version = 1;
    return (...args: any[]) => {
      args.push(fiber.version);

      const value = useMemo(() => {
        fiber.memo = 0;
        return bound(args);
      }, args);
      return value;
    };
  }) as any as LiveFunction<F>;
  (g as any).displayName = name != null ? `Memo(${name})` : `Memo`;
  return g;
}

// Memoize a live function with 1 argument on its object props (shallow comparison per arg)
export const memoProps = <F extends Function>(
  f: LiveFunction<F>,
  name?: string,
) => {
  const g = ((
    fiber: LiveFiber<F>,
  ) => {
    const bound = bind(f, fiber, reserveState(1));
    fiber.version = 1;
    return (props: Record<string, any>) => {
      const deps = [fiber.version] as any[];
      for (let k in props) {
        deps.push(k);
        deps.push(props[k]);
      }

      const value = useMemo(() => {
        fiber.memo = -1;
        return bound(props);
      }, deps);

      return value;
    };
  }) as any as LiveFunction<F>;
  (g as any).displayName = name != null ? `Memo(${name})` : `Memo`;
  return g;
}

// Shorthand
export const memo = memoProps;
export const resume = makeStaticContinuation;

// Allocate state value and a setter for it, initializing with the given value or function
export const useState = <T>(
  initialState: Initial<T>,
): [
  T,
  Setter<T>,
] => {
  const fiber = useFiber();

  const i = pushState(fiber, Hook.STATE);
  let {state, host, yeeted} = fiber;

  let value    = state![i];
  let setValue = state![i + 1];

  if (value === undefined) {
    value = (initialState instanceof Function) ? initialState() : initialState;
    setValue = host
      ? (value: Reducer<T>) => {
          host!.schedule(fiber, () => {
            if (value instanceof Function) state![i] = value(state![i]);
            else state![i] = value;
            bustFiberCaches(fiber);
            scheduleYeetRoots(fiber);
          });
        }
      : NOP;

    state![i] = value;
    state![i + 1] = setValue;
  }

  return [value as unknown as T, setValue];
}

// Memoize a value with given dependencies
export const useMemo = <T>(
  initialState: () => T,
  dependencies: any[] = NO_DEPS,
): T => {
  const fiber = useFiber();

  const i = pushState(fiber, Hook.MEMO);
  let {state, host} = fiber;

  let value = state![i];
  const deps = state![i + 1];

  if (!isSameDependencies(deps, dependencies)) {
    value = initialState();

    state![i] = value;
    state![i + 1] = dependencies;
  }

  return value as unknown as T;
}

// Memoize a value with one dependency
export const useOne = <T>(
  initialState: () => T,
  dependency: any = null,
): T => {
  const fiber = useFiber();

  const i = pushState(fiber, Hook.ONE);
  let {state, host} = fiber;

  let value = state![i];
  const dep = state![i + 1];

  if (dep !== dependency) {
    value = initialState();

    state![i] = value;
    state![i + 1] = dependency;
  }

  return value as unknown as T;
}

// Memoize a function with given dependencies
export const useCallback = <T extends Function>(
  initialValue: T,
  dependencies: any[] = NO_DEPS,
): T => {
  const fiber = useFiber();

  const i = pushState(fiber, Hook.CALLBACK);
  let {state, host} = fiber;

  let value = state![i];
  const deps = state![i + 1];

  if (!isSameDependencies(deps, dependencies)) {
    value = initialValue;

    state![i] = value;
    state![i + 1] = dependencies;
  }

  return value as unknown as T;
}

// Bind immediately to a resource, with auto-cleanup on dep change or unmount
export const useResource = <R>(
  callback: (dispose: (f: Function) => void) => R,
  dependencies: any[] = NO_DEPS,
): R => {
  const fiber = useFiber();

  const i = pushState(fiber, Hook.RESOURCE);
  let {state, host} = fiber;

  let {tag} = state![i] || NO_RESOURCE;
  const deps = state![i + 1];

  if (!isSameDependencies(deps, dependencies)) {

    if (!tag) {
      tag = makeResourceTag();
      state![i] = {tag, value: null};

      if (host) host.track(fiber, tag);
    }
    else {
      tag(null);
    }

    state![i + 1] = dependencies;

    const value = callback(tag);
    state![i].value = value;
    return value;
  }

  return state![i].value as R;
}

// Don't use a resource hook (clean up prior tag)
export const useNoResource = () => {
  const fiber = useFiber();

  const i = pushState(fiber, Hook.RESOURCE);
  let {state, host} = fiber;

  let {tag} = state![i] || NO_RESOURCE;
  if (tag) tag(null);

  state![i] = null;
  state![i + 1] = null;
}

// Grab a context from the fiber (optional mode)
export const useContext = <C>(
  context: LiveContext<C>,
) => {
  const fiber = useFiber();

  const i = pushState(fiber, Hook.CONTEXT);
  const {state, host, context: {values, roots}} = fiber;
  const root = roots.get(context);
  if (!root) throw new Error(`Context '${context.displayName}' was used without being provided.`);

  if (host) {
    if (!state![i]) {
      state![i] = context;
      host.track(fiber, () => host.undepend(fiber, root));
    }

    host.depend(fiber, root);
  }

  return values.get(context).current ?? context.initialValue;
}

// Grab an optional context from the fiber
export const useOptionalContext = <C>(
  context: LiveContext<C>,
) => {
  const fiber = useFiber();

  const {host, context: {values, roots}} = fiber;
  const root = roots.get(context);
  if (!root) return context.initialValue ?? null;

  if (host && host.depend(fiber, root)) {
    host.track(fiber, () => host.undepend(fiber, root));
  }

  return values.get(context).current ?? context.initialValue;
}

// Return a value to a consumer from the fiber
export const useConsumer = <C>(
  context: LiveContext<C>,
  value: any,
) => {
  const fiber = useFiber();

  const i = pushState(fiber, Hook.CONSUMER);
  const {state, host, context: {values, roots}} = fiber;
  const root = roots.get(context);
  if (!root || !root.next) throw new Error(`Consumer '${context.displayName}' was used without being consumed.`);

  const next= root.next;
  if (host) {
    if (!state![i]) {
      state![i] = context;
      host.track(fiber, () => {
        registry.delete(fiber);
        host.schedule(next, NOP);
        host.undepend(next, fiber);
      });

      host.depend(next, fiber);
    }
    host.schedule(next, NOP);
  }

  const registry = values.get(context).current;
  registry.set(fiber, value);
}

// Don't use a context from the fiber
export const useNoContext = <C>(
  context: LiveContext<C>,
) => {
  const fiber = useFiber();

  const i = pushState(fiber, Hook.CONTEXT);
  const {state, host, context: {values, roots}} = fiber;
  const root = roots.get(context)!;
  if (!context) throw new Error(`Context was not provided.`);

  if (state![i]) {
    if (host) host.undepend(fiber, root);
    state![i] = null;
  }
}

// Don't use a consumer from the fiber
export const useNoConsumer = <C>(
  context: LiveContext<C>,
) => {
  const fiber = useFiber();

  const i = pushState(fiber, Hook.CONSUMER);
  const {state, host, context: {values, roots}} = fiber;
  const root = roots.get(context)!;
  if (!context) throw new Error(`Consumer was not provided.`);

  const next = root.next;
  if (state![i] && next) {
    if (host) host.undepend(next, fiber);
    state![i] = null;
  }
}

export const useYolo = (
  callback: () => void,
) => {
  const fiber = useFiber();

  const i = pushState(fiber, Hook.YOLO);
  const {state, pointer} = fiber;

  let sub = state[i];
  if (!sub) sub = state[i] = [];

  fiber.state = sub;
  fiber.pointer = 0;
  callback();
  fiber.state = state;
  fiber.pointer = pointer;  
}

export const useNoYolo = () => {
  const fiber = useFiber();

  const i = pushState(fiber, Hook.YOLO);
  const {state, pointer} = fiber;

  let sub = state[i];
  if (sub) sub = null;
}

// Togglable hooks
export const useNoState = useNoHook(Hook.STATE);
export const useNoMemo = useNoHook(Hook.MEMO);
export const useNoOne = useNoHook(Hook.ONE);
export const useNoCallback = useNoHook(Hook.CALLBACK);

// Cleanup effect tracker
// Calls previous cleanup before accepting new one
export const makeResourceTag = () => {
  let cleanup = undefined as Task | undefined;

  return (f?: Task) => {
    if (cleanup) cleanup();
    cleanup = f;
  }
}
