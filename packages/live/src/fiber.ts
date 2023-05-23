import type {
  HostInterface, LiveFiber, LiveFunction, LiveContext, LiveElement,
  FiberYeet, FiberQuote, FiberGather, FiberContext, ContextValues, ContextRoots,
  OnFiber, DeferredCall, DeferredCallInterop, Key, ArrowFunction,
} from './types';

import { use, fragment, morph, DEBUG as DEBUG_BUILTIN, DETACH, FRAGMENT, MAP_REDUCE, GATHER, MULTI_GATHER, FENCE, YEET, MORPH, PROVIDE, CAPTURE, SUSPEND, RECONCILE, QUOTE, UNQUOTE, SIGNAL, EMPTY_FRAGMENT } from './builtin';
import { discardState, useOne } from './hooks';
import { renderFibers } from './tree';
import { isSameDependencies, incrementVersion, tagFunction, compareFibers } from './util';
import { formatNode, formatNodeName, LOGGING } from './debug';
import { createElement } from './jsx';

import { setCurrentFiber, setCurrentFiberBy } from './current';

let ID = 0;

const NO_FIBER = () => () => {};
const NOP = () => {};
const EMPTY_ARRAY = [] as any[];
const ROOT_PATH = [0] as Key[];
const NO_CONTEXT = {
  values: new Map() as ContextValues,
  roots: new Map() as ContextRoots,
};

// Prepare to call a live function with optional given persistent fiber
export const bind = <F extends ArrowFunction>(f: LiveFunction<F>, fiber?: LiveFiber<F> | null, base: number = 0) => {
  fiber = fiber ?? makeFiber(f, null);

  const length = getArgCount(f);
  if (length === 0) {
    return () => {
      enterFiber(fiber!, base);
      const value = f();
      exitFiber(fiber!);
      return value;
    }
  }
  if (length === 1) {
    return (arg: any) => {
      enterFiber(fiber!, base);
      const value = f(arg);
      exitFiber(fiber!);
      return value;
    }
  }
  return (...args: any[]) => {
    enterFiber(fiber!, base);
    const value = f.apply(null, args);
    exitFiber(fiber!);
    return value;
  }
};

// Enter/exit a fiber call
let enter = 0; let exit = 0;
export const enterFiber = <F extends ArrowFunction>(fiber: LiveFiber<F>, base: number) => {
  setCurrentFiber(fiber);

  // Reset state pointer
  fiber.pointer = base;
}

export const exitFiber = <F extends ArrowFunction>(fiber: LiveFiber<F>) => {
  discardState(fiber);
  setCurrentFiber(null);
}

// Make a fiber for a live function
export const makeFiber = <F extends ArrowFunction>(
  f: LiveFunction<F>,
  host?: HostInterface | null,
  parent?: LiveFiber<any> | null,
  args?: any[],
  by: number = parent?.id ?? 0,
  key?: Key,
  keyed?: boolean,
): LiveFiber<F> => {
  const bound = null as any;
  const depth = parent ? parent.depth + 1 : 0;

  const id = ++ID;

  const yeeted  = parent?.yeeted ? {...parent.yeeted, id, parent: parent.yeeted, value: undefined, reduced: undefined, scope: null} : null;
  const quote   = parent?.quote?.scope ? {...parent.quote, scope: null} : parent?.quote ?? null;
  const unquote = parent?.unquote ?? null;
  const context = parent?.context ?? NO_CONTEXT;

  let path = parent ? parent.path : ROOT_PATH;
  let keys = parent ? parent.keys : null;
  if (keyed && parent) {
    keys = [...(keys ?? EMPTY_ARRAY), path.length, parent.lookup];
  }
  if (key != null) path = [...path, key];

  const self = {
    f, args, bound, host,
    depth, path, keys,
    yeeted, quote, unquote, context,
    state: null, pointer: 0, version: null, memo: null, runs: 0,
    mount: null, mounts: null, next: null, order: null, lookup: null,
    type: null, id, by,
  } as LiveFiber<F>;

  self.bound = bind(f, self) as any as F;

  return self;
};

// Prepare a new sub fiber for continued rendering
export const makeSubFiber = <F extends ArrowFunction>(
  parent: LiveFiber<any>,
  node: DeferredCall<F>,
  by: number = node.by ?? parent.id,
  key?: Key,
  keyed?: boolean,
): LiveFiber<F> => {
  const {host} = parent;
  const fiber = makeFiber(
    node.f,
    host,
    parent,
    node.args ?? (node.arg !== undefined ? [node.arg] : undefined),
    by,
    key,
    keyed,
  ) as LiveFiber<F>;
  return fiber;
}

// Make a named continuation for a fiber
export const makeNextFiber = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  Next: LiveFunction<any>,
  prefix: string = 'Next',
  reyeet?: boolean,
  name?: string,
): LiveFiber<any> => {

  const n = formatNodeName(fiber);
  name = name ?? (n.match(/^[A-Za-z]+\(/) ? n.slice(n.indexOf('(') + 1, -1) : n);
  if (name === prefix) name = '…';
  Next.displayName = `${prefix}(${name})`;

  const nextFiber = makeSubFiber(fiber, use(Next), fiber.id, 1);

  // Adopt existing yeet context
  // which will be overwritten on the original fiber.
  if (reyeet && fiber.yeeted) {
    nextFiber.yeeted = fiber.yeeted;
    nextFiber.yeeted.id = nextFiber.id;
  }

  return nextFiber;
}

// Make fiber yeet state
export const makeYeetState = <F extends ArrowFunction, A, B, C>(
  fiber: LiveFiber<F>,
  nextFiber: LiveFiber<F>,
  gather: (f: LiveFiber<F>, self?: boolean) => C,
  map?: (a: A) => B,
): FiberYeet<any, C> => ({
  id: fiber.id,
  emit: map
    ? (fiber: LiveFiber<any>, v: A) => fiber.yeeted!.reduced = map(fiber.yeeted!.value = v)
    : (fiber: LiveFiber<any>, v: B) => fiber.yeeted!.value = fiber.yeeted!.reduced = v,
  gather,
  value: undefined,
  reduced: undefined,
  parent: undefined,
  root: nextFiber,
  scope: fiber.yeeted ?? undefined,
});

// Make fiber quote state
export const makeQuoteState = <F extends ArrowFunction>(
  root: number,
  from: LiveFiber<F>,
  to: LiveFiber<F>,
): FiberQuote<any> => ({
  root,
  from: from.id,
  to,
});

// Make fiber context state
export const makeContextState = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  parent: FiberContext,
  root: LiveFiber<F> | number,
  context: LiveContext<any>,
  value: any,
): FiberContext => {
  const values = new Map(parent.values);
  const roots = new Map(parent.roots);
  roots.set(context, root);
  values.set(context, { current: value, memo: null, displayName: context.displayName });

  return {values, roots};
};

// Render a fiber
export const renderFiber = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
) => {
  const {f, host} = fiber;
  host?.unvisit(fiber);

  // These built-ins are explicitly mounted as sub-fibers,
  // so as to not collide with the parent state.
  if      ((f as any) === PROVIDE) return provideFiber(fiber);
  else if ((f as any) === CAPTURE) return captureFiber(fiber);
  else if ((f as any) === DETACH)  return detachFiber(fiber);

  const LOG = LOGGING.fiber;
  LOG && console.log('Rendering', formatNode(fiber));

  const {bound, args, yeeted} = fiber;
  let element: LiveElement;

  // Disposed fiber, ignore
  if (!bound) return;

  // Passthrough built-ins as rendered result
  if ((f as any).isLiveBuiltin) {
    // Fiber is shape-compatible
    element = fiber as any as LiveElement;
    // Enter/exit to clear state
    bound();
  }
  // Render live function
  else element = bound.apply(null, args ?? EMPTY_ARRAY);
  if (typeof element === 'string') throw new Error(`Component may not return a string (${element})`);

  // Early exit if memoized and same result
  if (fiber.version != null) {
    if (fiber.version !== fiber.memo) {
      fiber.memo = fiber.version;
      bustFiberDeps(fiber);
      pingFiber(fiber);
    }
    else return;
  }
  else {
    bustFiberDeps(fiber);
    pingFiber(fiber);
  }

  // Apply rendered result
  return element ?? null;
}

// Ping a fiber in dev tool
export const pingFiber = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  active: boolean = true,
) => {
  // Notify host / dev tool of update
  const {host} = fiber;
  if (active) pingFiberCount(fiber);
  if (host?.__ping) host.__ping(fiber, active);
}

const BY_MAP = new WeakMap<any, number>;

/** React element interop
    @hidden */
export const reactInterop = (element: any, fiber?: LiveFiber<any>) => {
  let call = element as DeferredCall<any> | DeferredCall<any>[] | null;
  if (element && ('props' in element)) {
    let {type, key} = element;
    const by = BY_MAP.get(element) ?? fiber?.id;
    const props = {...element.props, key};
    if (typeof type === 'symbol') type = FRAGMENT;

    if (by != null) {
      const {children} = props;
      if (children) {
        if (Array.isArray(children)) children.forEach((c: any) => c ? BY_MAP.set(c, by) : null);
        else if ('props' in children) BY_MAP.set(props.children, by);
      }

      setCurrentFiberBy(by);
      call = createElement(type, props);
      setCurrentFiberBy(null);
    }
    else {
      call = createElement(type, props);
    }
  }
  return call ?? null;
};

// Update a fiber with rendered result
export const updateFiber = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  element: LiveElement | undefined | void,
) => {
  if (element === undefined) return;

  const {f, args, yeeted} = fiber;

  // Handle call and call[]
  element = reactInterop(element, fiber);
  let call = element as DeferredCall<any> | null;

  const isArray = !!element && Array.isArray(element);
  const fiberType = isArray ? Array : call?.f;

  // If morphing, do before noticing type change
  if (fiberType === MORPH) {
    let e = call!.args;
    e = reactInterop(e, fiber) as any;

    const c = e as any as DeferredCall<any>;
    const cs = e as any as DeferredCall<any>[];

    const isArray = !!e && Array.isArray(e);
    fiber.type = fiberType as any;

    if (isArray) reconcileFiberCalls(fiber, cs.map(call => morph(call as any)));
    else morphFiberCall(fiber, c);

    return fiber;
  }

  // If fiber type changed, remount everything
  if (fiber.type && fiber.type !== fiberType) disposeFiberState(fiber);
  fiber.type = fiberType as any;

  // Reconcile literal array
  if (isArray) {
    const calls = element as LiveElement[];
    reconcileFiberCalls(fiber, calls);
  }
  // Reconcile wrapped array fragment
  else if (fiberType === FRAGMENT || ((f as any) === DEBUG_BUILTIN)) {
    const calls = call!.args ?? EMPTY_ARRAY;
    reconcileFiberCalls(fiber, calls);
  }
  // Map reduce
  else if (fiberType === MAP_REDUCE) {
    const [calls, map, reduce, then, fallback] = call!.args ?? EMPTY_ARRAY;
    mapReduceFiberCalls(fiber, calls, map, reduce, then, fallback);
  }
  // Gather reduce
  else if (fiberType === GATHER) {
    const [calls, then, fallback] = call!.args ?? EMPTY_ARRAY;
    gatherFiberCalls(fiber, calls, then, fallback);
  }
  // Multi-gather reduce
  else if (fiberType === MULTI_GATHER) {
    const [calls, then, fallback] = call!.args ?? EMPTY_ARRAY;
    multiGatherFiberCalls(fiber, calls, then, fallback);
  }
  // Fence gathered reduction
  else if (fiberType === FENCE) {
    const [calls, then, fallback] = call!.args ?? EMPTY_ARRAY;
    fenceFiberCalls(fiber, calls, then, fallback);
  }
  // Reconcile to a separate subtree
  else if (fiberType === RECONCILE) {
    const calls = call!.args ?? EMPTY_ARRAY;
    mountFiberReconciler(fiber, calls);
  }
  // Signal quoted reduction directly
  else if (fiberType === SIGNAL) {
    if (fiber.quote) {
      const {quote: {to}} = fiber;
      bustFiberYeet(to, true);
      visitYeetRoot(to, true);
    }
  }
  // Enter quoted calls
  else if (fiberType === QUOTE) {
    const calls = call!.args ?? EMPTY_ARRAY;
    mountFiberQuote(fiber, calls);
  }
  // Escape from quoted calls
  else if (fiberType === UNQUOTE) {
    const calls = call!.args ?? EMPTY_ARRAY;
    mountFiberUnquote(fiber, calls);
  }
  // Yeet value upstream
  else if (fiberType === YEET) {
    if (!yeeted) throw new Error("Yeet without aggregator in " + formatNode(fiber));

    const value = call?.arg !== undefined ? call!.arg : call!.args?.[0];
    if (value === undefined || (fiber.yeeted!.value !== value)) {
      bustFiberYeet(fiber);
      visitYeetRoot(fiber);

      if (value !== undefined) yeeted.emit(fiber, value);
      else fiber.yeeted!.value = undefined;
    }
  }
  // Mount normal node (may still be built-in)
  else {
    mountFiberCall(fiber, call);
  }

  return fiber;
}

// Mount one call on a fiber
export const mountFiberCall = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  call?: DeferredCall<any> | null,
  fenced?: boolean,
) => {
  const {mount, mounts} = fiber;
  if (mounts) disposeFiberMounts(fiber);

  const nextMount = updateMount(fiber, mount, call);
  if (nextMount !== false) {
    fiber.mount = nextMount;
    flushMount(nextMount, mount, fenced);
  }
}

// Mount a continuation on a fiber
export const mountFiberContinuation = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  call: DeferredCall<any> | null,
  key: Key = 1,
) => {
  const {next} = fiber;

  const nextMount = updateMount(fiber, next, call, key);
  if (nextMount !== false) {
    fiber.next = nextMount;
    flushMount(nextMount, next, true);
  }
}

// Reconcile one call on a fiber as part of an incremental mapped set
export const reconcileFiberCall = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  call: DeferredCall<any> | null | undefined,
  key: Key,
  fenced?: boolean,
  path?: Key[],
  keys?: (number | Map<Key, number>)[],
  depth?: number,
) => {
  let {mounts, order, lookup} = fiber;
  if (!mounts || !order || !lookup) throw new Error('Cannot reconcile incrementally on uninitialized mounts');

  call = reactInterop(call, fiber) as DeferredCall<any> | null;
  if (Array.isArray(call)) call = {f: FRAGMENT, args: call} as any;

  {
    const mount = mounts.get(key);
    const nextMount = updateMount(fiber, mount, call as any, key);

    if (nextMount !== false) {
      if (nextMount) {
        if (path != null) nextMount.path = path;
        if (keys != null) nextMount.keys = keys;
        if (depth != null) nextMount.depth = depth;

        if (nextMount !== mount) {
          if (order.length) {
            order.length = 0;
            fiber.host?.visit(fiber.next!);
          }

          mounts.set(key, nextMount);
        }
      }
      else {
        if (nextMount !== mount) {
          mounts.delete(key);
          order.splice(order!.indexOf(key), 1);
        }
      }

      flushMount(nextMount, mount, fenced);
    }
  }
}

// Reconcile multiple calls on a fiber
export const reconcileFiberCalls = (() => {
  const seen = new Set<Key>();

  return <F extends ArrowFunction>(
    fiber: LiveFiber<F>,
    calls: LiveElement[],
    fenced?: boolean,
  ) => {
    let {mount, mounts, order, lookup, runs, quote, unquote} = fiber;
    if (mount) disposeFiberMounts(fiber);

    if (!mounts) mounts = fiber.mounts = new Map();
    if (!order)  order  = fiber.order  = [];

    if (!Array.isArray(calls)) calls = [calls];

    seen.clear();
    const oo = [...order];

    // Get new key set and order
    let i = 0;
    let rekeyed = false;
    for (let call of calls) {
      if (call == null) continue;
      let callKey = (call as any)?.key;

      let key;
      if (callKey != null) {
        rekeyed = rekeyed || (order[i] !== callKey);
        key = callKey;
      }
      else {
        key = i;
      }
      if (seen.has(key)) throw new Error(`Duplicate key '${key}' while reconciling ` + formatNode(fiber));

      seen.add(key);
      order[i++] = key;
    }
    order.length = i;

    if (rekeyed) {
      // Keyed fibers maintain a key lookup
      if (!lookup) lookup = fiber.lookup = new Map();
      for (let i = 0, n = order.length; i < n; ++i) {
        const o = order[i];
        if (o != null) lookup!.set(o, i);
      }
    }

    // Unmount missing keys
    for (let key of mounts.keys()) if (!seen.has(key)) {
      const mount = mounts.get(key);
      mounts.delete(key);
      lookup?.delete(key);

      updateMount(fiber, mount, null);
      flushMount(null, mount, fenced);
    }

    // If rekeyed, reorder queue and invalidate quoted order
    if (rekeyed) {
      fiber.host?.reorder(fiber);
      bustFiberQuote(fiber);
    }

    // Mount new / updated keys
    for (let i = 0, j = 0, n = calls.length; i < n; ++i) {
      let call = calls[i];
      if (call == null) continue;

      const key = order[j++];
      let callKey = (call as any)?.key;
      call = reactInterop(call, fiber);

      // Array shorthand for nested reconciling
      if (Array.isArray(call)) call = {f: FRAGMENT, args: call} as any;

      const mount = mounts.get(key);
      const nextMount = updateMount(fiber, mount, call as any, key, callKey != null);
      if (nextMount !== false) {
        if (nextMount) mounts.set(key, nextMount);
        else mounts.delete(key);
        flushMount(nextMount, mount, fenced);
      }
    }
  }
})();

// Re-order child fibers by path, used across quotes to keep both tree shapes the same
export const reconcileFiberOrder = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
) => {
  const {order, mounts, lookup} = fiber;
  if (!order || !mounts) return;
  if (order.length === mounts.size) return;

  order.length = 0;
  for (const k of mounts.keys()) order.push(k);
  order.sort((a, b) => compareFibers(mounts.get(a)!, mounts.get(b)!));
  if (lookup) lookup.clear();

  for (let i = 0, n = order.length; i < n; ++i) {
    const o = order[i];
    if (lookup) lookup.set(o, i);
  }

  // If rekeyed, invalidate quoted order
  fiber.host?.reorder(fiber);
  bustFiberQuote(fiber);

  pingFiber(fiber);
}

// Generalized mounting of reduction-like continuations
export const mountFiberReduction = <F extends ArrowFunction, R, T>(
  fiber: LiveFiber<F>,
  calls: LiveElement[] | LiveElement,
  mapper: ((t: T) => R) | undefined,
  gather: FiberGather<R>,
  Next?: LiveFunction<any>,
  fallback?: R,
) => {
  if (!fiber.next) {
    const Resume = makeFiberReduction(fiber, gather, fallback);
    fiber.next = makeNextFiber(fiber, Resume, 'Resume', true);
    fiber.yeeted = makeYeetState(fiber, fiber.next, gather, mapper);
    fiber.path = [...fiber.path, 0];
  }

  calls = reactInterop(calls, fiber) as any;

  if (Array.isArray(calls)) reconcileFiberCalls(fiber, calls);
  else mountFiberCall(fiber, calls as any);

  mountFiberContinuation(fiber, use(fiber.next.f, Next));
}

// Mount quoted calls on a fiber's continuation
export const mountFiberReconciler = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  calls: LiveElement | LiveElement[],
) => {
  let {id, next} = fiber;

  if (!fiber.quote || fiber.quote.root !== fiber.id) {
    // Dummy fiber, never called
    next = fiber.next = makeNextFiber(fiber, () => { throw new Error(); }, 'Root');

    const {quote} = fiber;
    fiber.quote = makeQuoteState(id, fiber, next);
    fiber.quote.scope = quote!;
    fiber.fork = true;
  }

  calls = reactInterop(calls, fiber) as any;

  if (Array.isArray(calls)) reconcileFiberCalls(fiber, calls);
  else mountFiberCall(fiber, calls as any);

  const nextNext = next?.next;
  if (nextNext) flushMount(nextNext, nextNext, true);
}

// Mount quoted calls on a fiber's continuation
export const mountFiberQuote = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  calls: LiveElement | LiveElement[],
) => {
  if (!fiber.quote) throw new Error("Can't quote outside of reconciler in " + formatNode(fiber));

  const {id, quote, mounts, lookup, order} = fiber;
  let {root, to, to: {next}} = quote;

  if (!next) {
    next = to.next = makeFiberReconciliation(to);
    to.fork = true;
  }

  const call = Array.isArray(calls) ? fragment(calls) : calls ?? EMPTY_FRAGMENT;
  reconcileFiberCall(to, call as any, id, true, fiber.path, fiber.keys, fiber.depth + 1);

  const mount = to.mounts!.get(id);
  if (mount!.unquote?.to !== fiber) {
    mount!.unquote = makeQuoteState(root, to, fiber);
  }

  const nextNext = next?.next;
  flushMount(to.next, to.next, true);
}

// Mount unquoted calls on a fiber's origin
export const mountFiberUnquote = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  calls: LiveElement | LiveElement[],
) => {
  if (!fiber.unquote) throw new Error("Can't unquote outside of quote in " + formatNode(fiber));

  const {id, unquote, mounts, lookup, order} = fiber;
  let {root, to, to: {next}} = unquote;
  
  if (!next) {
    next = to.next = makeFiberReconciliation(to);
    to.fork = true;
  }

  const call = Array.isArray(calls) ? fragment(calls) : calls ?? EMPTY_FRAGMENT;
  reconcileFiberCall(to, call as any, id, true, fiber.path, fiber.keys, fiber.depth + 1);

  const mount = to.mounts!.get(id);
  if (mount!.quote?.to !== fiber) {
    mount!.quote = makeQuoteState(root, to, fiber);
  }

  const nextNext = next?.next;
  flushMount(to.next, to.next, true);
}

// Wrap a live function to act as a reduction continuation of a prior fiber
export const makeFiberReduction = <F extends ArrowFunction, R>(
  fiber: LiveFiber<F>,
  gather: FiberGather<R | typeof SUSPEND>,
  fallback?: R,
) => (
  Next?: LiveFunction<any>
) => {
  const {next} = fiber;
  if (!next) return null;
  if (!Next) return null;

  const LOG = LOGGING.fiber;
  LOG && console.log('Reducing', formatNode(fiber));

  const ref = useOne(() => ({current: fallback}));
  const value = gather(fiber, true);
  const nextValue = (value === SUSPEND)
    ? ref.current as any
    : ref.current = (value as R);

  return Next(nextValue);
}

// Make a reconciling tail for a fiber. Used to fix order in case of rekeying.
export const makeFiberReconciliation = <F extends ArrowFunction, R>(
  fiber: LiveFiber<F>,
  name: string = 'Reconcile',
) => {
  // Incrementally reconciled. Pre-initialize these.
  let {mounts, lookup, order} = fiber;
  if (!mounts) fiber.mounts = new Map();
  if (!lookup) fiber.lookup = new Map();
  if (!order)  fiber.order  = [];

  const Resume = () => {
    const {next} = fiber;
    reconcileFiberOrder(fiber);
  };
  return makeNextFiber(fiber, Resume, name);
}

// Tag a component as imperative, always re-rendered from above even if props/state didn't change
export const makeImperativeFunction = (
  component: LiveFunction<any>,
  displayName?: string,
): LiveFunction<any> => {
  (component as any).isImperativeFunction = true;
  tagFunction(component, displayName);
  return component;
}


const toArray = <T>(x: T | T[] | undefined): T[] => Array.isArray(x) ? x : x != null ? [x] : [];
const NO_ARRAY: any[] = [];
const NO_RECORD: Record<string, any> = {};


// Map-reduce a fiber
export const mapReduceFiberCalls = <F extends ArrowFunction, R, T>(
  fiber: LiveFiber<F>,
  calls: LiveElement,
  mapper: (t: T) => R,
  reducer: (a: R, b: R) => R,
  next?: LiveFunction<any>,
  fallback?: R | typeof SUSPEND,
) => {
  const gather = reduceFiberValues(reducer);
  return mountFiberReduction(fiber, calls, mapper, gather, next);
}

// Gather-reduce a fiber
export const gatherFiberCalls = <F extends ArrowFunction, R, T>(
  fiber: LiveFiber<F>,
  calls: LiveElement,
  next?: LiveFunction<any>,
  fallback: (T[] | typeof SUSPEND) = NO_ARRAY,
) => {
  return mountFiberReduction(fiber, calls, undefined, gatherFiberValues, next, fallback);
}

// Multi-gather-reduce a fiber
export const multiGatherFiberCalls = <F extends ArrowFunction, T>(
  fiber: LiveFiber<F>,
  calls: LiveElement,
  next?: LiveFunction<any>,
  fallback: (Record<string, T[]> | typeof SUSPEND) = NO_RECORD,
) => {
  return mountFiberReduction(fiber, calls, undefined, multiGatherFiberValues, next, fallback);
}

// Fence a fiber reduction
export const fenceFiberCalls = <F extends ArrowFunction, T>(
  fiber: LiveFiber<F>,
  calls: LiveElement,
  next?: LiveFunction<any>,
  fallback?: T | typeof SUSPEND,
) => {
  const {yeeted} = fiber;
  const gather = yeeted?.gather ?? NOP;
  return mountFiberReduction(fiber, calls, undefined, gather, next, fallback);
}

// Reduce yeeted values on a tree of fibers (values have already been mapped on emit)
export const reduceFiberValues = <R>(
  reducer: (a: R, b: R) => R,
) => {
  const reduce = <F extends ArrowFunction, T>(
    fiber: LiveFiber<F>,
    self: boolean = false,
  ): R | typeof SUSPEND | undefined => {
    const {yeeted, mount, mounts, order} = fiber;
    if (!yeeted) throw new Error("Reduce without aggregator");

    let isFork = fiber.fork;
    if (!self) {
      if (fiber.next && !isFork) return reduce(fiber.next);
    }

    if (yeeted.reduced !== undefined) return yeeted.reduced;
    if (mounts && order) {
      if (mounts.size) {
        const n = mounts.size;
        const first = mounts.get(order[0]);
        let value = reduce(first!);
        if (value === SUSPEND) return yeeted.reduced = SUSPEND;

        if (n > 1) for (let i = 1; i < n; ++i) {
          const m = mounts.get(order[i]);
          if (!m) continue;

          const v = reduce(m);
          if (v === SUSPEND) return yeeted.reduced = SUSPEND;
          value = reducer((value as R), (v as R)!);
        }

        let reduced = value as any;
        if (isFork) {
          let fork = reduce(fiber.next!);
          if (fork === SUSPEND) return yeeted.reduced = SUSPEND;

          reduced = (reduced && fork) ? reducer(reduced, fork as any) : (reduced ?? fork);
        }
        return yeeted.reduced = reduced;
      }
    }
    else if (mount) {
      let value = reduce(mount);
      if (value === SUSPEND) return yeeted.reduced = SUSPEND;

      let reduced = value as any;
      if (isFork) {
        let fork = reduce(fiber.next!);
        if (fork === SUSPEND) return yeeted.reduced = SUSPEND;

        reduced = reduced && fork ? reducer(reduced, fork as any) : (reduced ?? fork);
      }
      return yeeted.reduced = reduced;
    }
    else if (isFork) {
      return yeeted.reduced = reduce(fiber.next!);
    }
    return undefined;
  };

  return reduce;
}

// Gather yeeted values on a tree of fibers
// (recursive flatMap with array wrapper at leafs)
export const gatherFiberValues = <F extends ArrowFunction, T>(
  fiber: LiveFiber<F>,
  self: boolean = false,
): T | T[] | typeof SUSPEND | undefined => {
  const {yeeted, mount, mounts, order} = fiber;
  if (!yeeted) throw new Error("Reduce without aggregator");

  let isFork = fiber.fork;
  if (!self) {
    if (fiber.next && !isFork) return gatherFiberValues(fiber.next);
  }

  if (yeeted.reduced !== undefined) return yeeted.reduced;
  if (mounts && order) {
    if (mounts.size) {
      const items = [] as T[];
      for (let k of order) {
        const m = mounts.get(k);
        if (!m) continue;

        const value = gatherFiberValues(m);
        if (value === SUSPEND) return yeeted.reduced = SUSPEND;

        if (Array.isArray(value)) {
          let n = value.length;
          for (let i = 0; i < n; ++i) items.push(value[i] as T);
        }
        else items.push(value as T);
      }

      if (isFork) {
        let fork = gatherFiberValues(fiber.next!);
        if (fork === SUSPEND) return yeeted.reduced = SUSPEND;

        if (fork) items.push(...toArray<T>(fork as any));
      }
      return yeeted.reduced = items;
    }
  }
  else if (mount) {
    const value = gatherFiberValues(mount);
    if (value === SUSPEND) return yeeted.reduced = SUSPEND;

    if (isFork) {
      let reduced = value ? toArray<T>(value as T | T[]).slice() : [];
      let fork = gatherFiberValues(fiber.next!);
      if (fork === SUSPEND) return yeeted.reduced = SUSPEND;

      reduced.push(...toArray<T>(fork as any));
      return yeeted.reduced = reduced;
    }

    if (self) return yeeted.reduced = toArray<T>(value as T | T[]);
    return yeeted.reduced = value as T | T[];
  }
  else if (isFork) {
    return yeeted.reduced = gatherFiberValues(fiber.next!);
  }
  return [];
}

// Multigather yeeted values on a tree of fibers
// (recursive key-wise flatMap with optional array wrapper at leafs)
export const multiGatherFiberValues = <F extends ArrowFunction, T>(
  fiber: LiveFiber<F>,
  self: boolean = false,
): Record<string, T | T[]> | typeof SUSPEND => {

  const {yeeted, mount, mounts, order} = fiber;
  if (!yeeted) throw new Error("Reduce without aggregator");

  let isFork = fiber.fork;
  if (!self) {
    if (fiber.next && !isFork) return multiGatherFiberValues(fiber.next) as any;
  }

  if (yeeted.reduced !== undefined) return yeeted.reduced;
  if (mounts && order) {
    if (mounts.size) {
      const out = {} as Record<string, T[]>;

      for (let k of order) {
        const m = mounts.get(k);
        if (!m) continue;

        const value = multiGatherFiberValues(m);
        if (value === SUSPEND) return yeeted.reduced = SUSPEND;

        multiGatherMergeInto(out, value as any);
      }

      if (isFork) {
        const fork = multiGatherFiberValues(fiber.next!);
        if (fork === SUSPEND) return yeeted.reduced = SUSPEND;

        multiGatherMergeInto(out, fork as any);
      }

      return yeeted.reduced = out;
    }
  }
  else if (mount) {
    let out = multiGatherFiberValues(mount);
    if (out === SUSPEND) return yeeted.reduced = SUSPEND;
    if (out != null && (self || isFork)) for (let k in (out as any)) (out as any)[k] = toArray((out as any)[k]);

    if (isFork) {
      out = {...out};
      const fork = multiGatherFiberValues(fiber.next!);
      if (fork === SUSPEND) return yeeted.reduced = SUSPEND;

      multiGatherMergeInto(out as any, fork as any);
    }

    return yeeted.reduced = out as any;
  }
  else if (isFork) {
    return multiGatherFiberValues(fiber.next!);
  }
  return {} as Record<string, T | T[]>;
}

const multiGatherMergeInto = <T>(a: Record<string, T[]>, b: Record<string, T | T[]>) => {
  for (let k in b as Record<string, T | T[]>) {
    const v = (b as Record<string, T | T[]>)[k];
    let list = a[k] as T[];
    if (!list) list = a[k] = [];

    if (Array.isArray(v)) {
      let n = v.length;
      for (let i = 0; i < n; ++i) list.push(v[i] as T);
    }
    else list.push(v as T);
  }
}

// Morph one call on a fiber
export const morphFiberCall = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  call?: DeferredCall<any> | null,
) => {
  const {mount} = fiber;

  if (call && mount && (mount.f !== call.f) && !(call.f.isLiveBuiltin)) {
    if (
      mount.context === fiber.context &&
      !mount.next &&
      (!mount.quote || mount.quote.to !== mount) &&
      (!mount.unquote || mount.unquote.to !== mount)
    ) {
      // Discard all fiber state
      enterFiber(mount, 0);
      exitFiber(mount);
      bustFiberYeet(mount, true);
      visitYeetRoot(mount, true);

      // Change type in place while keeping existing mounts
      mount.type = null;
      mount.f = call.f;
      mount.bound = bind(call.f, mount);
      mount.args = undefined;
      mount.memo = null;
      mount.version = -1;
    }
  }

  mountFiberCall(fiber, call);
}

// Inline a call to a fiber after a built-in
export const inlineFiberCall = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  element: LiveElement,
) => {
  if (typeof element === 'string') throw new Error("String is not a valid element");
  element = reactInterop(element, fiber) as any;

  const isArray = !!element && Array.isArray(element);
  const fiberType = isArray ? Array : (element as any)?.f;

  if (fiber.type && fiber.type !== fiberType) disposeFiberState(fiber);
  fiber.type = fiberType;

  if (isArray) reconcileFiberCalls(fiber, element as any);
  else {
    const call = element as DeferredCall<any>;
    if (call && (call.f as any)?.isLiveInline) updateFiber(fiber, call as any);
    else mountFiberCall(fiber, call as any);
  }
}

// Provide a value for a context on a fiber
export const provideFiber = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
) => {
  if (!fiber.args) return;
  let {context: {roots, values}, args: [context, value, calls]} = fiber;

  if (roots.get(context) !== fiber.id) {
    if (context.capture) throw new Error(`Cannot use capture ${context.displayName} as a context`);

    fiber.context = makeContextState(fiber, fiber.context, fiber.id, context, value);
    pingFiber(fiber);

    // Remember calls
    const ref = fiber.context.values.get(context);
    ref.memo = calls;
  }
  else {
    // Set new value if changed
    const ref = values.get(context);
    const lastValue = ref.current;
    if (value !== lastValue) {
      bustFiberDeps(fiber);
      pingFiber(fiber);

      ref.current = value;
    }
    // If memoized and mounts are identical, stop
    else {
      pingFiber(fiber, false);

      const lastCalls = ref.memo;
      if (lastCalls === calls) return;
      ref.memo = calls;
    }
  }

  inlineFiberCall(fiber, calls);
}

// Capture values from a co-context on a fiber
export const captureFiber = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
) => {
  if (!fiber.args) return;
  let {args: [capture, calls, Next]} = fiber;

  bustFiberDeps(fiber);
  pingFiber(fiber);

  if (!fiber.next) {
    if (capture.context) throw new Error(`Cannot use context ${capture.displayName} as a capture`);

    const registry = new Map<LiveFiber<any>, any>();
    const reduction = () => registry;

    const Resume = makeFiberReduction(fiber, reduction);
    fiber.next = makeNextFiber(fiber, Resume, 'Resume');

    fiber.context = makeContextState(fiber, fiber.context, fiber.next, capture, registry);
    fiber.path = [...fiber.path, 0];
    fiber.fork = true;
  }

  inlineFiberCall(fiber, calls);
  mountFiberContinuation(fiber, use(fiber.next.f, Next));
}

// Detach a fiber by mounting a subcontext manually and delegating the triggering of its execution
export const detachFiber = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
) => {
  if (!fiber.args) return;
  let {host, next, args: [call, callback]} = fiber;

  bustFiberDeps(fiber);
  pingFiber(fiber);

  if (!next || (next.f !== call.f)) {
    if (next) disposeFiber(next);
    next = fiber.next = makeSubFiber(fiber, call);
  }
  next.args = call.args;

  callback(() => {
    if (next && host) {
      host.schedule(next);
      host.flush();
    }
  }, fiber.next);
}

// Dispose of a fiber's resources and all its mounted sub-fibers
export const disposeFiber = <F extends ArrowFunction>(fiber: LiveFiber<F>) => {
  disposeFiberState(fiber);

  fiber.bound = undefined;
  if (fiber.host) fiber.host.dispose(fiber);
  pingFiber(fiber);
}

// Dispose of a fiber's mounted sub-fibers
export const disposeFiberState = <F extends ArrowFunction>(fiber: LiveFiber<F>) => {
  const {id, next, quote, unquote, yeeted} = fiber;

  if (fiber.type === QUOTE) {
    const {to} = quote!;
    reconcileFiberCall(to, null, id, true);
    pingFiber(to);
  }
  if (fiber.type === UNQUOTE) {
    const {to} = unquote!;
    reconcileFiberCall(to, null, id, true);
    pingFiber(to);
  }

  disposeFiberMounts(fiber);
  if (next) disposeFiber(next);
  fiber.next = null;
  fiber.fork = false;

  if (fiber.type === RECONCILE) {
    fiber.quote = fiber.quote!.scope ?? null;
  }

  if (yeeted) {
    bustFiberYeet(fiber, true);
    visitYeetRoot(fiber);
    if (yeeted.scope) fiber.yeeted = yeeted.scope;
  }
}

// Dispose of a fiber's mounted sub-fibers
export const disposeFiberMounts = <F extends ArrowFunction>(fiber: LiveFiber<F>) => {
  const {mount, mounts} = fiber;

  if (mount) disposeFiber(mount);
  if (mounts) for (const key of mounts.keys()) {
    const mount = mounts.get(key);
    if (mount) disposeFiber(mount);
  }

  fiber.mount = fiber.mounts = null;
}

// Update a fiber in-place and recurse
export const updateMount = <P extends ArrowFunction>(
  parent: LiveFiber<P>,
  mount?: LiveFiber<any> | null,
  newMount?: DeferredCall<any> | null,
  key?: Key,
  keyed?: boolean,
): LiveFiber<any> | null | false => {
  const LOG = LOGGING.fiber;
  const {host} = parent;

  let from = mount?.f;
  let to = newMount?.f;

  if ((from === to) && (from === PROVIDE || from === CAPTURE)) {
    from = mount?.args?.[0] as any;
    to = newMount?.args?.[0] as any;
  }

  const update  = from && to;
  const replace = update && from !== to;

  if ((!to && from) || replace) {
    LOG && console.log('Unmounting', key, formatNode(mount!));
    if (host) host.__stats.unmounts++;
    if (!replace) return null;
  }

  if ((to && !from) || replace) {
    LOG && console.log('Mounting', key, formatNode(newMount!));
    if (host) host.__stats.mounts++;
    // Destroy yeet caches because trail of contexts downwards starts empty
    bustFiberYeet(parent, true);
    const mount = makeSubFiber(parent, newMount!, newMount!.by ?? parent.id, key, keyed);
    return mount;
  }

  if (update) {
    const aas = newMount?.args;
    const aa = newMount?.arg;
    const args = aas !== undefined ? aas : (aa !== undefined ? [aa] : undefined);

    if (mount!.args === args && !to?.isImperativeFunction && !(to === YEET && !args) && !(to === SIGNAL)) {
      LOG && console.log('Skipping', key, formatNode(newMount!));
      return false;
    }

    LOG && console.log('Updating', key, formatNode(newMount!));

    if (host) host.__stats.updates++;

    mount!.args = args;

    return mount!;
  }

  return false;
}

// Flush dependent updates after adding / updating / removing a mount
export const flushMount = <F extends ArrowFunction>(
  mount?: LiveFiber<F> | null,
  mounted?: LiveFiber<any> | null,
  fenced?: boolean,
) => {
  if (mounted && mounted !== mount) {
    disposeFiber(mounted);
  }
  if (mount) {
    const {host} = mount;

    // Slice into new stack if too deep, or if fenced
    if (host && (fenced || host?.slice(mount))) return host.visit(mount);

    const element = renderFiber(mount);
    updateFiber(mount, element);
  }
}

// Ensure a re-render of the associated yeet root
export const visitYeetRoot = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  force?: boolean,
) => {
  const {host, yeeted} = fiber;
  if (yeeted && (fiber.type === YEET || force)) {
    const LOG = LOGGING.fiber;
    const {root} = yeeted;

    LOG && console.log('Visit', formatNode(fiber), '->', formatNode(root));
    bustFiberMemo(root);
    if (host) host.visit(root);
  }
}

// Remove a cached yeeted value and all upstream reductions
export const bustFiberYeet = <F extends ArrowFunction>(fiber: LiveFiber<F>, force?: boolean) => {
  const {type, yeeted} = fiber;
  if (yeeted && (fiber.type === YEET || force)) {
    let yt = yeeted;
    yt.value = undefined;

    if (force) yt.reduced = undefined;
    while ((yt = yt.parent!) && (yt.reduced !== undefined)) {
      yt.reduced = undefined;
    }
  }
}

// Force a memoized fiber to update next render
export const bustFiberMemo = <F extends ArrowFunction>(fiber: LiveFiber<F>) => {
  if (fiber.version != null) fiber.version = incrementVersion(fiber.version);
}

// Ping a fiber when it's updated,
// propagating to long-range dependencies.
export const bustFiberDeps = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
) => {
  // Bust far caches
  const {host} = fiber;
  if (host) for (const sub of host.traceDown(fiber)) {
    const LOG = LOGGING.fiber;
    LOG && console.log('Invalidating Node', formatNode(sub));

    host.visit(sub);
    bustFiberMemo(sub);
  }
}

// Bust the order of quoted/unquoted yeets,
// in case of key re-ordering.
export const bustFiberQuote = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
) => {
  const {host, quote, unquote} = fiber;
  if (quote) {
    const {to, to: {next, order}} = quote;
    if (next && order?.length) {
      order.length = 0;
      host?.visit(next);
    }
  }
  if (unquote) {
    const {to, to: {next, order}} = unquote;
    if (next && order?.length) {
      order.length = 0;
      host?.visit(next);
    }
  }
}

// Track number of runs per fiber
export const pingFiberCount = <F extends ArrowFunction>(fiber: LiveFiber<F>) => {
  fiber.runs = incrementVersion(fiber.runs);
}

// Get argument count for a function, including optional arguments.
export const getArgCount = <F extends Function>(f: F) => {
  if ((f as any)?.argCount != null) return (f as any).argCount;

  let s = Function.toString.call(f).split(/\)|=>/)[0];
  if (s == null) return 0;

  s = s.replace(/\s+/g, '').replace(/^\(/, '').replace(/,$/, '');
  if (s.length === 0) return 0;

  return s.split(',').length;
}
