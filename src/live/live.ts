import {Initial, Live, LiveContext, StateContext, CallContext} from './types';

export const live = <F extends Function>(f: Live<F>, context?: LiveContext<F>) => {
  const c = context ?? makeContext(f);
  const bound = f(c);
  return (...args: any[]) => {
    c.call.args = args;
    c.state.index = 0;

    return bound(...args);
  }
};

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

export const useMemo = <F extends Function>(context: LiveContext<F>) => <T>(
  initialState: Initial<T>,
  dependencies: any[],
): T => {
  const {state} = context;
  const {values, index: i} = state;
  state.index += 2;

  let value = values[i];
  let deps  = values[i + 1];

  if (!isSameDependencies(deps, dependencies)) {
    value = (initialState instanceof Function) ? initialState() : initialState;

    values[i] = value;
    values[i + 1] = dependencies;
  }

  return value as unknown as T;
}

export const useCallback = <F extends Function>(context: LiveContext<F>) => <T>(
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

export const makeContext = <F extends Function>(f: Live<F>, args?: any[]): LiveContext<F> => {
  return {
    call:  makeCallContext(f, args),
    state: makeStateContext(),
  };
};

export const makeStateContext = (): StateContext => ({
  index: 0,
  values: [],
});

export const makeCallContext = <F extends Function>(
  f: Live<F>,
  args?: any[],
): CallContext<F> => {
  return {f, args};
}

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
