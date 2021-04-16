import {Action, Task, Mounts, LiveContext, DeferredCall} from './types';
import {bind, makeContext} from './live';
import {formatNode} from './debug';

const DEBUG = false;

type Dispatcher = (as: Action[]) => void;

export const prepareHostContext = (node: DeferredCall<T>) => {
  const {host, scheduler, tracker} = makeHost();
  const context = makeContext(node.f, host, null, node.args);
  context.generation = 1;

  return {context, host, scheduler, tracker};
}

export const render = <T>(node: DeferredCall<T>) => {
  DEBUG && console.log('Rendering Root', formatNode(node));

  const {context, host, scheduler} = prepareHostContext(node);

  const reenter = (as: Action[]) => {
    context.generation = (context.generation + 1) & 0xFFFFFFFF;
    renderContext(context);
  };

  scheduler.bind(reenter);

  return renderContext(context);
}

export const renderContext = <T>(context: LiveContext<T>) => {
  const out = context.bound(...context.call.args);
  const nodes = (out ? (!Array.isArray(out) ? [out] : out) : []) as DeferredCall<any>[];

  let {mounts} = context;
  if (!mounts && nodes.length) mounts = context.mounts = new Map();

  let index = 0;
  for (let node of nodes) {
    // Insert/update rendered nodes
    let key = node.key ?? index++;
    const prev = mounts.get(key) ?? null;
    updateNode(context, key, prev, node);
  }
  if (mounts) for (let key of mounts.keys()) {
    // Unmount unrendered nodes
    const prev = mounts.get(key);
    if (prev.generation !== context.generation) updateNode(context, key, prev, null);
  }

  return context;
}

export const disposeContext = <T>(context: LiveContext<T>) => {
  const {mounts} = context;
  if (mounts) for (let key of mounts.keys()) {
    const prev = mounts.get(key);
    disposeContext(prev);
  }
  context.host.dispose(context);
}

export const updateNode = <S, T>(
  context: LiveContext<S>,
  key: Key,
  prev: LiveContext<T> | null,
  node: DeferredCall<T> | null,
) => {
  const {mounts, host} = context;
  const from = prev?.call.f;
  const to = node?.f;

  const replace = from && to && from !== to;

  if ((!to && from) || replace) {
    DEBUG && console.log('Unmounting', formatNode(from.call));
    if (host) host.__stats.unmounts++;

    if (mounts) mounts.delete(key);
    disposeContext(prev);
  }

  if ((to && !from) || replace) {
    DEBUG && console.log('Mounting', formatNode(to.call));
    if (host) host.__stats.mounts++;

    const child = makeContext(node.f, context.host, context, node.args);
    if (mounts) mounts.set(key, child);
    renderContext(child);
  }

  if (from && to && !replace) {
    DEBUG && console.log('Updating', formatNode(to.call));
    if (host) host.__stats.updates++;

    prev.generation = context.generation;
    prev.call.args = node.args;

    renderContext(prev);
  }
}

export const makeHost = () => {
  const scheduler = makeScheduler();
  const tracker = makeTracker();
  const host = {
    schedule: scheduler.schedule,
    track: tracker.track,
    dispose: tracker.dispose,
    __stats: {mounts: 0, unmounts: 0, updates: 0},
    __flush: scheduler.flush,
  };
  return {host, scheduler, tracker};
}

export const makeScheduler = () => {
  const queue = [] as Action[];

  let timer = null as any;
  let onUpdate = null as any;

  const bind = (f: Dispatcher) => onUpdate = f;

  const schedule = (context: LiveContext<any>, task: Task) => {
    queue.push({context, task});
    if (!timer) timer = setTimeout(flush, 0);
  };

  const flush = () => {
    timer = null;
    queue.sort((a: Action, b: Action) => a.context.depth - b.context.depth);
    for (let {task} of queue) task();
    if (onUpdate) {
      const q = queue.slice();
      queue.length = 0;

      onUpdate(q);
    }
  };

  return {bind, schedule, flush};
}

export const makeTracker = () => {
  const disposal = new WeakMap<LiveContext<any>, Task[]>();

  const track = (context: LiveContext<any>, t: Task) => {
    let list = disposal.get(context);
    if (!list) disposal.set(context, list = []);
    list.push(t);
  }

  const dispose = (context: LiveContext<any>) => {
    let tasks = disposal.get(context);
    if (tasks) {
      disposal.delete(context);
      for (let task of tasks) task();
    }
  }

  return {track, dispose};
}
