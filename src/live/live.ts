import {Live, LiveContext} from './types';

export const makeContext = () => {
  let state = undefined as any;

  const getState   = () => state;
  const getStateAt = <T>(index: number) => state && (state[index] as T);
  const setStateAt = <T>(index: number, value: T) => {
    if (!state) state = [];
    state[index] = value;
  }

  return {getState, getStateAt, setStateAt};
};

export const live = <F>(f: Live<F>, context?: LiveContext) => (props: P) => {
  context = context ?? makeContext();
  const bound = f(context);
  return bound(props);
};
  