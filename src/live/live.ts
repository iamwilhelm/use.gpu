import {
  Initial, Reducer, Key,
  Live, LiveContext, CallContext,
  DeferredCall, HostInterface,
} from './types';

const NOP = () => {};
const STATE_SLOTS = 2;

// Prepare to call a live function with optional given context
export const bind = <F extends Function>(f: Live<F>, context?: LiveContext<F>) => {
  const c = context ?? makeContext(f, null);
  const bound = f(c);
  return (...args: any[]) => {
    c.call.args = args;
    return bound(...args);
  }
};

// Defer a call to a live function
export const defer = <F extends Function>(
  f: Live<F>,
  key?: Key,
) => (
  ...args: any[]
): DeferredCall<F> => ({f, args, key});

// Memoize a live function on all its arguments (shallow comparison per arg)
export const memo = <F extends Function>(
  f: Live<F>
) => (
  context: LiveContext<F>
) => {
  const bound = f(context);
  return (...args: any[]) => {
    const value = useMemo(context, 0)(() => bound(args), args);
    return value;
  };
};

// Allocate state value and a setter for it, initializing with the given value or function
export const useState = <F extends Function>(context: LiveContext<F>, index: number) => <T>(
  initialState: Initial<T>,
): [
  T,
  (t: T) => void
] => {
  const {state, host} = context;
  const i = index * STATE_SLOTS;

  let value    = state[i];
  let setValue = state[i + 1];

  if (value === undefined) {
    value = (initialState instanceof Function) ? initialState() : initialState;
    setValue = host
      ? (value: Reducer<T>) => host.schedule(context, () => {
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
export const useMemo = <F extends Function>(context: LiveContext<F>, index: number) => <T>(
  initialState: () => T,
  dependencies: any[],
): T => {
  const {state} = context;
  const i = index * STATE_SLOTS;

  let value = state[i];
  let deps  = state[i + 1];

  if (!isSameDependencies(deps, dependencies)) {
    value = initialState();

    state[i] = value;
    state[i + 1] = dependencies;
  }

  return value as unknown as T;
}

// Memoize a function with given dependencies
export const useCallback = <F extends Function>(context: LiveContext<F>, index: number) => <T extends Function>(
  initialValue: T,
  dependencies: any[],
): T => {
  const {state} = context;
  const i = index * STATE_SLOTS;

  let value = state[i];
  let deps  = state[i + 1];

  if (!isSameDependencies(deps, dependencies)) {
    value = initialValue;

    state[i] = value;
    state[i + 1] = dependencies;
  }

  return value as unknown as T;
}

// Memoize a function with given dependencies
export const useHook = <F extends Function>(
  context: LiveContext<F>,
  index: number
) => <H extends Function>(
  hook: Live<H>,
): T => {
  const {state, host} = context;
  const i = index * STATE_SLOTS;

  let bound = state[i];
  let ctx = state[i + 1];

  if (!bound) {
    ctx = makeContext(f, host, context);
    bound = hook(c);

    state[i] = bound;
    state[i + 1] = ctx;
  }

  return bound;
}

// Make a context for a live function
export const makeContext = <F extends Function, H>(
  f: Live<F>,
  host?: HostInterface,
  parent?: LiveContext<any>,
  args?: any[]
): LiveContext<F> => {
  const call = makeCallContext(f, args);
  const state = [] as any[];
  const depth = parent ? parent.depth + 1 : 0;
  return {state, call, depth, parent, host};
};

// Hold call info for a context
export const makeCallContext = <F extends Function>(
  f: Live<F>,
  args?: any[],
): CallContext<F> => ({f, args});

// Compares dependency arrays
export const isSameDependencies = <T>(
  prev: any[] | undefined,
  next: any[],
) => {
  let valid = true;
  if (prev === undefined) valid = false;
  else {
    const n = prev.length;
    if (n !== next.length) valid = false;
    else for (let i = 0; i < n; ++i) if (prev[i] !== next[i]) {
      valid = false;
      break;
    }
  }
  return valid;
}
