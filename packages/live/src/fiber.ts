import { LiveFiber, LiveFunction, FiberYield, Key } from './types';

import { bind, reconcile, DETACH, RECONCILE, MAP_REDUCE, YIELD } from './live';
import { isSameDependencies } from './util';
import { formatNode } from './debug';

let DEBUG = false;
//setTimeout((() => DEBUG = false), 900);

const EMPTY_ARRAY = [] as any[];
const ROOT_PATH = [0] as Key[];

// Make a fiber for a live function
export const makeFiber = <F extends Function>(
  f: LiveFunction<F>,
  host?: HostInterface | null,
  parent?: LiveFiber<any> | null,
  args?: any[],
  key?: Key,
): LiveFiber<F> => {
  const bound = null;
  const depth = parent ? parent.depth + 1 : 0;
  const yielded = parent?.yielded ? {...parent.yielded} : null;

  let path = parent ? parent.path : ROOT_PATH;
  if (key != null) path = [...path, key];

  const self = {
    bound, f, args,
    host, depth, path,
    state: null, pointer: 0, yielded,
    mount: null, mounts: null, seen: null,
  } as any as LiveFiber<F>;

  self.bound = bind(f, self);

  return self;
};

// Prepare a new sub fiber for continued rendering
export const makeSubFiber = <F extends Function>(
  parent: LiveFiber<any>,
  node: DeferredCall<F>,
  key?: Key,
): LiveFiber<F> => {
  const {host} = parent;
  const fiber = makeFiber(node.f, host, parent, node.args);
  return fiber;
}

// Make yield state
export const makeYieldState = <A, B>(map?: (a: A) => B): FiberYield => ({
  value: undefined,
  emit: map
    ? (fiber: LiveFiber<any>, t: T) => fiber.yielded!.value = map(t)
    : (fiber: LiveFiber<any>, t: T) => fiber.yielded!.value = t
});

// Render a fiber
export const renderFiber = <F extends Function>(fiber: LiveFiber<F>) => {
  const {f, bound, args, yielded, rendered} = fiber;

  const isBuiltIn = ((f as any).isLiveBuiltin);
  const out = isBuiltIn
    ? (fiber as any as DeferredCall<any>)
    : bound.apply(null, args ?? EMPTY_ARRAY);

  let call = out as DeferredCall<any> | null;
  const fiberType = call?.f;
  const isArray = !!out && Array.isArray(out);

  if (isArray) {
    const calls = out as DeferredCall<any>[];
    if (rendered === calls) return fiber;
    fiber.rendered = calls;

    mountFiberCall(fiber, null);
    reconcileFiberCalls(fiber, calls);
  }
  else if (fiberType === RECONCILE) {
    const calls = call.args ?? EMPTY_ARRAY;
    if (rendered === calls) return fiber;
    fiber.rendered = calls;

    mountFiberCall(fiber, null);
    reconcileFiberCalls(fiber, calls);
  }
  else if (fiberType === MAP_REDUCE) {
    const [calls, map, reduce, done] = call.args ?? EMPTY_ARRAY;
    if (rendered === calls) return fiber;
    fiber.rendered = calls;

    mountFiberCall(fiber, null);
    mapReduceFiberCalls(fiber, calls, map, reduce, done);
  }
  else if (fiberType === YIELD) {
    mountFiberCall(fiber, null);

    if (!yielded) throw new Error("Yield without aggregator");
    yielded.emit(fiber, call.arg);
  }
  else {
    if (rendered === call) return fiber;
    fiber.rendered = call;

    mountFiberCall(fiber, call);
  }

  return fiber;
}

// Detach a fiber by mounting a subcontext manually and delegating its execution
export const detachFiber = <F extends Function>(fiber: LiveFiber<F>) => {
  let {mount, args: [call, callback]} = fiber;

  if (!mount || (mount.f !== call.f)) mount = fiber.mount = makeSubFiber(fiber, call);
  mount.args = call.args;

  callback(mount);
}

// Dispose of a fiber and all its mounted sub-fibers
export const disposeFiber = <F extends Function>(fiber: LiveFiber<F>) => {
  const {mount, mounts} = fiber;

  if (mount) disposeFiber(mount);
  if (mounts) for (const key of mounts.keys()) {
    const mount = mounts.get(key);
    if (mount) disposeFiber(mount);
  }
  fiber.mount = fiber.mounts = null;

  if (fiber.host) fiber.host.dispose(fiber);
}

// Mount one call on a fiber
export const mountFiberCall = <F extends Function>(
  fiber: LiveFiber<F>,
  call: DeferredCall<any> | null,
) => {
  const {yielded, mount} = fiber;
  const nextMount = updateMount(fiber, mount, call);
  if (nextMount !== false) {
    fiber.mount = nextMount;
    flushMount(nextMount, mount);
  }
}

// Reconcile multiple calls on a fiber
export const reconcileFiberCalls = <F extends Function>(
  fiber: LiveFiber<F>,
  calls: DeferredCall<any>[],
) => {
  let {mounts, seen} = fiber;
  if (!mounts) mounts = fiber.mounts = new Map();
  if (!seen) seen = fiber.seen = new Set();

  let i = 0;
  for (let call of calls) {
    let key = call.key ?? i++;
    seen.add(key);

    const mount = mounts.get(key);
    const nextMount = updateMount(fiber, mount, call, key);
    if (nextMount !== false) {
      if (nextMount) mounts.set(key, nextMount);
      else mounts.delete(key);
      flushMount(nextMount, mount);
    }
  }

  for (let key of mounts.keys()) if (!seen.has(key)) {
    const mount = mounts.get(key);
    updateMount(fiber, mount, null);
    mounts.delete(key);
    flushMount(null, mount);
  }

  seen.clear();
}

// Reconcile and reduce multiple calls on a fiber
export const mapReduceFiberCalls = <F extends Function, R, T>(
  fiber: LiveFiber<F>,
  calls: DeferredCall<any>[],
  map?: (t: T) => R,
  reduce?: (a: R, b: R) => R,
  done?: (r: R) => void,
) => {
  let {yielded} = fiber;
  if (!yielded) yielded = fiber.yielded = makeYieldState(map);
  reconcileFiberCalls(fiber, calls);
  done(reduceFiberValues(fiber, reduce));
}

// Reduce yielded values on a tree of fibers
export const reduceFiberValues = <F extends Function, R, T>(
  fiber: LiveFiber<F>,
  reducer?: (a: R, b: R) => R,
) => {
  const {yielded, mount, mounts} = fiber;
  if (!yielded) throw new Error("Reduce without aggregator");

  if (yielded.value !== undefined) return yielded.value;
  if (mount) return yielded.value = reduceFiberValues(mount, reducer);
  if (mounts && mounts.size) {
    const ms = mounts.values();

    const [first] = ms;
    let value = reduceFiberValues(first, reducer);
    for (let m of ms) value = reducer(value, reduceFiberValues(m, reducer));

    return yielded.value = value;
  }
  return undefined;
}

// Update a fiber in-place and recurse
export const updateMount = <P extends Function>(
  parent: LiveFiber<P>,
  mount: LiveFiber<any> | null,
  next: DeferredCall<any> | null,
  key?: Key = null,
): LiveFiber<F> | null | false => {
  const {host} = parent;

  const from = mount?.f;
  const to = next?.f;

  const update  = from && to;
  const replace = update && from !== to;

  if ((!to && from) || replace) {
    DEBUG && console.log('Unmounting', key, formatNode(mount!));
    if (host) host.__stats.unmounts++;
    if (!replace) return null;
  }

  if ((to && !from) || replace) {
    DEBUG && console.log('Mounting', key, formatNode(next!));
    if (host) host.__stats.mounts++;
    return makeSubFiber(parent, next, key);
  }

  if (update) {
    DEBUG && console.log('Updating', key, formatNode(next!));
    if (host) host.__stats.updates++;

    if (mount.args === next.args) return false;
    if (isSameDependencies(mount.args, next.args)) return false;

    mount.args = next.args;
    return mount;
  }

  return false;
}

// Flush dependent updates after adding / updating / removing a mount
export const flushMount = <F extends Function>(mount: LiveFiber<F> | null, mounted: LiveFiber<any>) => {
  if (mounted && mounted !== mount) {
    disposeFiber(mounted);
  }
  if (mount) { 
    if (mount.f === DETACH) detachFiber(mount);
    else renderFiber(mount);
  }
}
