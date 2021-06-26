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

// Fiber context
export type LiveFiber<F extends Function> = FunctionCall<F> & {
  host?: HostInterface,
  path: Key[],
  depth: number,

  // Instance of F bound to self
  bound: F,
  
  // State for user hooks
  state: any[],
  pointer: number,

  // Mounting state
  seen?: Set<Key>,
  mount?: LiveFiber<any>,
  mounts?: FiberMap,
  rendered?: any,

  // Yielding state
  yielded?: FiberYield<any>,
};

export type FiberYield<T> = {
  value: T,
  emit: Setter<T>,
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

