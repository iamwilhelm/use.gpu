export type CallContext<F extends Function> = {
  f: Live<F>,
  args?: any[],
};

export type StateContext = {
  index: number,
  values: any[],
};

export type LiveContext<F extends Function> = {
  state: StateContext,
  call: CallContext<F>,
};

export type Live<F extends Function> = (context: LiveContext<F>) => F;

export type Initial<T> = (() => T) | T;