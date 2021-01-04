export type Key = string | number;

export type Live<F extends Function> = (context: LiveContext<F>) => F;
export type Initial<T> = (() => T) | T;

export type Component = (...args: any[]) => DeferredCall<any>;
export type LiveComponent = Live<Component>;

export type LiveContext<F extends Function> = {
  state: StateContext,
  call: CallContext<F>,
};

export type DeferredCall<F extends Function> = CallContext<F> & {
  key?: Key,
};

export type CallContext<F extends Function> = {
  f: Live<F>,
  args?: any[],
};

export type StateContext = {
  index: number,
  values: any[],
};
