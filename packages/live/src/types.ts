// Live function
export type Live<F extends Function> = (context: LiveContext<F>) => F;

// Mounting key
export type Key = string | number;

// Component with single props object
export type Component<P> = (props: P) => LiveElement<any>;
export type LiveComponent<P> = Live<Component<P>>;

// State hook callbacks
export type Initial<T> = (() => T) | T;
export type Reducer<T> = T | ((t: T) => T);
export type Setter<T> = (t: Reducer<T>) => void;
export type Resource = <T>() => (void | Task | [T, Task]);

// Deferred actions
export type Task = () => void;
export type Action = {
  context: LiveContext<any>,
  task: Task,
};
export type Dispatcher = (as: Action[]) => void;

// Live host interface
export type HostInterface = {
  schedule: (c: LiveContext<any>, t: Task) => void,
  track: (c: LiveContext<any>, t: Task) => void,
  dispose: (c: LiveContext<any>) => void,
  
  __stats: {mounts: number, unmounts: number, updates: number},
  __flush: () => void,
};

export type LiveContext<F extends Function> = {
  host?: HostInterface,
  call: CallContext<F>,

  mounts?: Mounts,
  depth: number,
  generation: number,

  state: any[],
  bound: F,
};

export type Mounts = Map<Key, LiveContext<any>>;

export type CallContext<F extends Function> = {
  f: Live<F>,
  args?: any[],
};

export type DeferredCall<F extends Function> = CallContext<F> & {
  key?: Key,
};

export type LiveElement<F extends Function> = null | DeferredCall<F> | DeferredCall<any>[];

