import { LiveFiber, LiveFunction, FiberYeet, Key } from './types';

import { use, bind, DETACH, RECONCILE, MAP_REDUCE, YEET } from './live';
import { isSameDependencies } from './util';
import { formatNode } from './debug';

let DEBUG = true;
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

  const yeeted = parent?.yeeted ? {...parent.yeeted, parent} : null;

  let path = parent ? parent.path : ROOT_PATH;
  if (key != null) path = [...path, key];

  const self = {
    bound, f, args,
    host, depth, path,
    yeeted,
    state: null, pointer: 0, version: 1,
    mount: null, mounts: null, next: null, seen: null,
    type: null, rendered: null,
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

// Make fiber yeet state
export const makeYeetState = <A, B>(map?: (a: A) => B): FiberYeet => ({
  emit: map
    ? (fiber: LiveFiber<any>, t: T) => fiber.yeeted!.value = map(t)
    : (fiber: LiveFiber<any>, t: T) => fiber.yeeted!.value = t,
  value: undefined,
  reduced: undefined,
  parent: undefined,
});

// Render a fiber
export const renderFiber = <F extends Function>(fiber: LiveFiber<F>) => {
  const {f, bound, args, yeeted, rendered} = fiber;

  let out: LiveElement<any>;
  // Passthrough built-ins
  if ((f as any).isLiveBuiltin) out = fiber as any as DeferredCall<any>;
  // Render live function
  else out = bound.apply(null, args ?? EMPTY_ARRAY);

  // Handle call and call[]
  let call = out as DeferredCall<any> | null;
  const isArray = !!out && Array.isArray(out);
  const fiberType = isArray ? Array : call?.f;

  // If fiber type changed, remount everything
  if (fiber.type && fiberType !== fiber.type) disposeFiberMounts(fiber);
  fiber.type = fiberType;

  // Reconcile literal array
  if (isArray) {
    const calls = out as DeferredCall<any>[];
    reconcileFiberCalls(fiber, calls);
  }
  // Reconcile wrapped array
  else if (fiberType === RECONCILE) {
    const calls = call.args ?? EMPTY_ARRAY;
    reconcileFiberCalls(fiber, calls);
  }
  // Map reduce
  else if (fiberType === MAP_REDUCE) {
    const [calls, map, reduce, done] = call.args ?? EMPTY_ARRAY;
    mapReduceFiberCalls(fiber, calls, map, reduce, done);
  }
  // Yeet value upstream
  else if (fiberType === YEET) {
    if (!yeeted) throw new Error("Yeet without aggregator");
    yeeted.emit(fiber, call.arg);
  }
  // Mount normal node (may still be built-in)
  else {
    mountFiberCall(fiber, call);
  }

  return fiber;
}

// Mount one call on a fiber
export const mountFiberCall = <F extends Function>(
  fiber: LiveFiber<F>,
  call: DeferredCall<any> | null,
) => {
  const {rendered, mount} = fiber;
  if (rendered === call) return;

  const nextMount = updateMount(fiber, mount, call);
  if (nextMount !== false) {
    fiber.mount = nextMount;
    flushMount(nextMount, mount);
  }
}

// Mount a continuation on a fiber
export const mountFiberContinuation = <F extends Function>(
  fiber: LiveFiber<F>,
  call: DeferredCall<any> | null,
) => {
  const {next} = fiber;
  const nextMount = updateMount(fiber, next, call);
  if (nextMount !== false) {
    fiber.next = nextMount;
    flushMount(nextMount, next);
  }
}

// Reconcile multiple calls on a fiber
export const reconcileFiberCalls = <F extends Function>(
  fiber: LiveFiber<F>,
  calls: DeferredCall<any>[],
) => {
  let {rendered, mounts, seen} = fiber;
  if (rendered === calls) return;

  if (!mounts) mounts = fiber.mounts = new Map();
  if (!seen) seen = fiber.seen = new Set();

  let i = 0;
  for (let call of calls) {
    let key = call.key ?? i++;
    seen.add(key);

    // Array shorthand for nested reconciling
    if (Array.isArray(call)) call = reconcile(call as any, key);

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

// Map-reduce a fiber
export const mapReduceFiberCalls = <F extends Functions, R, T>(
  fiber: LiveFiber<F>,
  calls: DeferredCall<any>[],
  mapper?: (t: T) => R,
  reducer?: (a: R, b: R) => R,
  Done?: LiveFunction<any>,
) => {
  let {rendered, yeeted} = fiber;
  if (!yeeted || yeeted.parent) yeeted = fiber.yeeted = makeYeetState(mapper);

  reconcileFiberCalls(fiber, calls);

  const value = reduceFiberValues(fiber, reducer, true);
  mountFiberContinuation(fiber, use(Done)(value));
}

// Reduce yeeted values on a tree of fibers
export const reduceFiberValues = <F extends Function, R, T>(
  fiber: LiveFiber<F>,
  reducer?: (a: R, b: R) => R,
  self?: boolean = false,
) => {
  const {yeeted, mount, mounts} = fiber;
  if (!yeeted) throw new Error("Reduce without aggregator");

  if (!self) {
    if (fiber.next) return reduceFiberValues(fiber.next, reducer);
    if (yeeted.value !== undefined) return yeeted.value;
  }

  if (yeeted.reduced !== undefined) return yeeted.reduced;
  if (mounts) {
    if (mounts.size) {
      const ms = mounts.values();

      const [first] = ms;
      let value = reduceFiberValues(first, reducer);
      for (let m of ms) value = reducer(value, reduceFiberValues(m, reducer));

      return yeeted.reduced = value;
    }
  }
  else if (mount) return yeeted.reduced = reduceFiberValues(mount, reducer);
  return undefined;
}

// Detach a fiber by mounting a subcontext manually and delegating its execution
export const detachFiber = <F extends Function>(fiber: LiveFiber<F>) => {
  let {mount, args: [call, callback]} = fiber;

  if (!mount || (mount.f !== call.f)) mount = fiber.mount = makeSubFiber(fiber, call);
  mount.args = call.args;

  callback(mount);
}

// Dispose of a fiber's resources and all its mounted sub-fibers
export const disposeFiber = <F extends Function>(fiber: LiveFiber<F>) => {
  disposeFiberMounts(fiber);
  if (fiber.host) fiber.host.dispose(fiber);
}

// Dispose of a fiber's mounted sub-fibers
export const disposeFiberMounts = <F extends Function>(fiber: LiveFiber<F>) => {
  const {mount, mounts, next} = fiber;

  if (mount) disposeFiber(mount);
  if (mounts) for (const key of mounts.keys()) {
    const mount = mounts.get(key);
    if (mount) disposeFiber(mount);
  }
  if (next) disposeFiber(next);

  fiber.rendered = fiber.mount = fiber.mounts = fiber.next = null;
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
