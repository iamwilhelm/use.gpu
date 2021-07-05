// Live function
export type LiveFunction<F extends Function> = (fiber: LiveFiber<F>) => F;

// Mounting key
export type Key = string | number;

// Component with single props object
export type Component<P> = (props: P) => LiveElement<any>;
export type LiveComponent<P> = LiveFunction<Component<P>>;

// State hook callbacks
export type Initial<T> = (() => T) | T;
export type Reducer<T> = T | ((t: T) => T);
export type Setter<T> = (t: Reducer<T>) => void;
export type Resource<T> = () => (void | Task | [T, Task]);

// Deferred actions
export type Task = () => void;
export type Action<F extends Function> = {
  fiber: LiveFiber<F>,
  task: Task,
};
export type Dispatcher = (as: Action<any>[]) => void;

export type LiveContext<T> = { initialValue?: T };

// Fiber context
export type LiveFiber<F extends Function> = FunctionCall<F> & {
  host?: HostInterface,
  path: Key[],
  depth: number,

  // Instance of F bound to self
  bound?: F,
  
  // State for user hooks
  state: any[],
  pointer: number,
  version: number,

  // Last snapshot
  type: Function,

  // Mounting state
  seen?: Set<Key>,
  mount?: LiveFiber<any>,
  mounts?: FiberMap,
  next?: LiveFiber<any>,

  // User-specified context
  context?: LiveContexts,

  // Yeeting state
  yeeted?: FiberYeet<any>,
};

export type FiberContext<T> = {
  map: LiveContexts,
  roots: LiveFiber<any>[],
  parent?: FiberContext<T>,
};

export type FiberYeet<T> = {
  emit: Setter<T>,
  value?: T,
  reduced?: T,
  parent?: FiberYeet<T>,
  roots: LiveFiber<any>[],
};

export type FiberMap = Map<Key, LiveContext<any>>;

// Deferred function calls
export type FunctionCall<F extends Function> = {
  f: LiveFunction<F>,
  args?: any[],
  arg?: any
};

export type DeferredCall<F extends Function> = FunctionCall<F> & {
  key?: Key,
};

export type LiveElement<F extends Function> = null | DeferredCall<F> | DeferredCall<any>[];

// Live host interface
export type HostInterface = {
  // Schedule a task on next flush
  schedule: (c: LiveContext<any>, t: Task) => void,

  // Track a future cleanup on a context
  track: (c: LiveContext<any>, t: Task) => void,

  // Dispose of a context by running all tracked cleanups
  dispose: (c: LiveContext<any>) => void,

  __stats: {mounts: number, unmounts: number, updates: number},
  __flush: () => void,
};

