import {Initial, Live, Key, LiveContext, StateContext, CallContext, DeferredCall} from './types';

// Prepare to call a live function with optional given context
export const bind = <F extends Function>(f: Live<F>, context?: LiveContext<F>) => {
  const c = context ?? makeContext(f);
  const bound = f(c);
  return (...args: any[]) => {
    c.call.args = args;
    c.state.index = 0;

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

// Memoize a live function on all its arguments (shallow comparison)
export const memo = <F extends Function>(
  f: Live<F>
) => (
  context: LiveContext<F>
) => {
  const bound = f(context);
  return (...args: any[]) => {
    const value = useMemo(context)(() => bound(args), args);
    return value;
  };
};

// Allocate state value and a setter for it, initializing with the given value or function
export const useState = <F extends Function>(context: LiveContext<F>) => <T>(
  initialState: Initial<T>,
): [
  T,
  (t: T) => void
] => {
  const {state} = context;
  const {values, index: i} = state;
  state.index += 2;

  let value    = values[i];
  let setValue = values[i + 1];

  if (value === undefined) {
    value = (initialState instanceof Function) ? initialState() : initialState;
    setValue = (value: T) => values[i] = value;

    values[i] = value;
    values[i + 1] = setValue;
  }

  return [value as unknown as T, setValue];
}

// Memoize a value with given dependencies
export const useMemo = <F extends Function>(context: LiveContext<F>) => <T>(
  initialState: () => T,
  dependencies: any[],
): T => {
  const {state} = context;
  const {values, index: i} = state;
  state.index += 2;

  let value = values[i];
  let deps  = values[i + 1];

  if (!isSameDependencies(deps, dependencies)) {
    value = initialState();

    values[i] = value;
    values[i + 1] = dependencies;
  }

  return value as unknown as T;
}

// Memoize a function with given dependencies
export const useCallback = <F extends Function>(context: LiveContext<F>) => <T extends Function>(
  initialValue: T,
  dependencies: any[],
): T => {
  const {state} = context;
  const {values, index: i} = state;
  state.index += 2;

  let value = values[i];
  let deps  = values[i + 1];

  if (!isSameDependencies(deps, dependencies)) {
    value = initialValue;

    values[i] = value;
    values[i + 1] = dependencies;
  }

  return value as unknown as T;
}

// Make a context for a live function
export const makeContext = <F extends Function>(
  f: Live<F>,
  args?: any[]
): LiveContext<F> => {
  return {
    call:  makeCallContext(f, args),
    state: makeStateContext(),
  };
};

// Holds state for a context
export const makeStateContext = (): StateContext => ({
  index: 0,
  values: [],
});

// Hold call info for a context
export const makeCallContext = <F extends Function>(
  f: Live<F>,
  args?: any[],
): CallContext<F> => {
  return {f, args};
}

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
