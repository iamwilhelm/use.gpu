export type Key = string | number;

export type Live<F extends Function> = (context: LiveContext<F>) => F;
export type Initial<T> = (() => T) | T;
export type Reducer<T> = T | ((t: T) => T);
export type Setter<T> = (t: Reducer<T>) => void;

export type Component<P> = (props: P) => DeferredCall<any>;
export type LiveComponent<P> = Live<Component<P>>;

export type Task = () => void;

export type HostInterface = {
  schedule: (c: LiveContext<any>, t: Task) => void,
};

export type LiveContext<F extends Function> = {
  state: any[],
  index: number,

  call: CallContext<F>,
  depth: number,
  parent?: LiveContext<any>,
  host?: HostInterface,
};

export type DeferredCall<F extends Function> = CallContext<F> & {
  key?: Key,
};

export type CallContext<F extends Function> = {
  f: Live<F>,
  args?: any[],
};
