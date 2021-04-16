export type Key = string | number;

export type Live<F extends Function> = (context: LiveContext<F>) => F;
export type Initial<T> = (() => T) | T;
export type Reducer<T> = T | ((t: T) => T);
export type Setter<T> = (t: Reducer<T>) => void;

export type Component<P> = (props: P) => DeferredCall<any>;
export type LiveComponent<P> = Live<Component<P>>;

export type Task = () => void;
export type Action = {
  context: LiveContext<any>,
  task: Task,
};
export type Resource = () => (void | Task);

export type HostInterface = {
  schedule: (c: LiveContext<any>, t: Task) => void,
  track: (c: LiveContext<any>, t: Task) => void,
  dispose: (c: LiveContext<any>) => void,
  
  __stats: {mounts: number, unmounts: number, updates: number},
  __flush: () => void,
};

export type Mounts = Map<Key, LiveContext<any>>;

export type LiveContext<F extends Function> = {
  state: any[],
  bound: F,
  call: CallContext<F>,
  depth: number,
  generation: number,
  parent?: LiveContext<any>,
  mounts?: Mounts,
  host?: HostInterface,
};

export type DeferredResult<F extends Function> = DeferredCall<F> | DeferredCall<any>[];

export type DeferredCall<F extends Function> = CallContext<F> & {
  key?: Key,
};

export type CallContext<F extends Function> = {
  f: Live<F>,
  args?: any[],
};
