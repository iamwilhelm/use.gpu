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

import { setCurrentFiber } from './current';

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
): LiveFiber<F> => {
  const bound = null as any;
  const depth = parent ? parent.depth + 1 : 0;

  const id = ++ID;

  const yeeted = parent?.yeeted ? {...parent.yeeted, id, parent: parent.yeeted, up: null} : null;
  const quote = parent?.quote ?? null;
  const unquote = parent?.unquote ?? null;
  const context = parent?.context ?? NO_CONTEXT;

  let path = parent ? parent.path : ROOT_PATH;
  if (key != null) path = [...path, key];

  const self = {
    bound, f, args,
    host, depth, path,
    yeeted, quote, unquote, context,
    state: null, pointer: 0, version: null, memo: null, runs: 0,
    mount: null, mounts: null, next: null, seen: null, order: null,
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
): LiveFiber<F> => {
  const {host} = parent;
  const fiber = makeFiber(
    node.f,
    host,
    parent,
    node.args ?? (node.arg !== undefined ? [node.arg] : undefined),
    by,
    key,
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
  // which will be overwritten.
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
  up: fiber.yeeted ?? undefined,
});

// Make fiber quote state
export const makeQuoteState = <F extends ArrowFunction, A, B, C>(
  root: LiveFiber<F>,
  fiber: LiveFiber<F>,
  nextFiber: LiveFiber<F>,
): FiberQuote<any> => ({
  root,
  from: fiber,
  to: nextFiber,
});

// Make fiber context state
export const makeContextState = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  parent: FiberContext,
  context: LiveContext<any>,
  value: any,
): FiberContext => {
  const values = new Map(parent.values);
  const roots = new Map(parent.roots);
  roots.set(context, fiber);
  values.set(context, { current: value, memo: null, displayName: context.displayName });
  
  return {values, roots};
};

// Render a fiber
export const renderFiber = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
) => {
  const {f, host} = fiber;
  host?.unvisit(fiber);

  // These built-ins that are explicitly mounted as sub-fibers,
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
    // Enter/exit to clear yeet state
    bound();
  }
  // Render live function
  else element = bound.apply(null, args ?? EMPTY_ARRAY);
  if (typeof element === 'string') throw new Error(`Component may not return a string (${element})`);

  // Early exit if memoized and same result
  if (fiber.memo != null) {
    const canExitEarly = !fiber.next;
    if (fiber.version !== fiber.memo) {
      fiber.memo = fiber.version;
      bustFiberDeps(fiber);
      pingFiber(fiber);
    }
    else if (canExitEarly) return;
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

/** React element interop
    @hidden */
export const reactInterop = (element: any, fiber?: LiveFiber<any>) => {
  let call = element as DeferredCall<any> | DeferredCall<any>[] | null;
  if (element && ('props' in element)) {
    let {type, key} = element; 
    const props = {...element.props, key};
    if (typeof type === 'symbol') type = FRAGMENT;

    call = createElement(type, props);
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

// Reconcile one call on a fiber as part of an incremental mapped set
export const reconcileFiberCall = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  call: DeferredCall<any> | null | undefined,
  key: Key,
  fenced?: boolean,
  path?: Key[],
  depth?: number,
) => {
  let {mount, mounts, order, seen} = fiber;
  if (mount) disposeFiberMounts(fiber);

  if (!mounts) mounts = fiber.mounts = new Map();
  if (!order)  order  = fiber.order  = [];
  if (!seen)   seen   = fiber.seen   = new Set();

  call = reactInterop(call, fiber) as DeferredCall<any> | null;
  if (Array.isArray(call)) call = {f: FRAGMENT, args: call} as any;

  {
    const mount = mounts.get(key);
    const nextMount = updateMount(fiber, mount, call as any, key);

    if (nextMount !== false) {
      if (nextMount) {
        if (path != null) nextMount.path = path;
        if (depth != null) nextMount.depth = depth;

        if (nextMount !== mount) {
          const i = order!.findIndex((key) => compareFibers(mounts!.get(key)!, nextMount) > 0);
          if (i === -1) order!.push(key);
          else order!.splice(i, 0, key);

          mounts.set(key, nextMount);
        }
      }
      else {
        if (nextMount !== mount) {
          mounts!.delete(key);
          order!.splice(order!.indexOf(key), 1);
        }
      }

      flushMount(nextMount, mount, fenced);
    }
  }
}

// Mount a continuation on a fiber
export const mountFiberContinuation = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  call: DeferredCall<any> | null,
  key?: Key,
) => {
  const {next} = fiber;

  const nextMount = updateMount(fiber, next, call, key);
  if (nextMount !== false) {
    fiber.next = nextMount;
    flushMount(nextMount, next, true);
  }
}

// Reconcile multiple calls on a fiber
export const reconcileFiberCalls = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  calls: LiveElement[],
  fenced?: boolean,
) => {
  let {mount, mounts, order, seen} = fiber;
  if (mount) disposeFiberMounts(fiber);

  if (!mounts) mounts = fiber.mounts = new Map();
  if (!order)  order  = fiber.order  = [];
  if (!seen)   seen   = fiber.seen   = new Set();

  if (!Array.isArray(calls)) calls = [calls];

  seen.clear();

  order.length = 0;
  let i = 0;
  for (let call of calls) {
    call = reactInterop(call, fiber);

    let key = (call as any)?.key ?? i;
    if (seen.has(key)) throw new Error(`Duplicate key ${key} while reconciling ` + formatNode(fiber));
    seen.add(key);
    order[i++] = key;

    // Array shorthand for nested reconciling
    if (Array.isArray(call)) call = {f: FRAGMENT, args: call} as any;

    const mount = mounts.get(key);
    const nextMount = updateMount(fiber, mount, call as any, key);
    if (nextMount !== false) {
      if (nextMount) mounts.set(key, nextMount);
      else mounts.delete(key);
      flushMount(nextMount, mount, fenced);
    }
  }

  for (let key of mounts.keys()) if (!seen.has(key)) {
    const mount = mounts.get(key);
    updateMount(fiber, mount, null);
    mounts.delete(key);
    flushMount(null, mount, fenced);
  }

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

  mountFiberContinuation(fiber, use(fiber.next.f, Next), 1);
}

const Reconcile = () => {};

// Mount quoted calls on a fiber's continuation
export const mountFiberReconciler = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  calls: LiveElement | LiveElement[],
) => {
  if (!fiber.quote) {
    fiber.next = makeNextFiber(fiber, Reconcile, 'Reconcile');
    fiber.quote = makeQuoteState(fiber, fiber, fiber.next);
    fiber.next.unquote = fiber.quote;
  }

  calls = reactInterop(calls, fiber) as any;

  if (Array.isArray(calls)) reconcileFiberCalls(fiber, calls);
  else mountFiberCall(fiber, calls as any);
}

// Mount quoted calls on a fiber's continuation
export const mountFiberQuote = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  calls: LiveElement | LiveElement[],
) => {
  if (!fiber.quote) throw new Error("Can't quote outside of reconciler in " + formatNode(fiber));

  const key = fiber.id;
  const call = Array.isArray(calls) ? fragment(calls) : calls ?? EMPTY_FRAGMENT;
  const {quote: {root, to}} = fiber;

  reconcileFiberCall(to, call as any, key, true, fiber.path, fiber.depth + 1);

  const mount = to.mounts!.get(key)!;
  if (mount.unquote?.from !== fiber) {
    const quote = makeQuoteState(root, fiber, mount);
    mount.unquote = quote;
  }
}

// Mount unquoted calls on a fiber's origin
export const mountFiberUnquote = <F extends ArrowFunction>(
  fiber: LiveFiber<F>,
  calls: LiveElement | LiveElement[],
) => {
  if (!fiber.unquote) throw new Error("Can't unquote outside of quote in " + formatNode(fiber));
  
  const {id, unquote} = fiber;
  const {root, from} = unquote;

  const key = fiber.id;
  const call = Array.isArray(calls) ? fragment(calls) : calls ?? EMPTY_FRAGMENT;

  reconcileFiberCall(from, call as any, key, true, fiber.path, fiber.depth + 1);

  const mount = from.mounts!.get(key)!;
  if (mount.quote?.to !== fiber) {
    const unquote = makeQuoteState(root, mount, fiber);
    mount.quote = unquote;
  }
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

  const ref = useOne(() => ({current: fallback}));
  const value = gather(fiber, true);
  const nextValue = (value === SUSPEND)
    ? ref.current as any
    : ref.current = (value as R);

  return Next(nextValue);
}

// Wrap a live function to act as a reconciled continuation on a fiber
export const makeFiberReconciliation = <F extends ArrowFunction, R>(
  fiber: LiveFiber<F>,
) => (
  calls?: LiveElement,
) => {
  return calls;
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

    let isFork = (fiber.f === CAPTURE || fiber.f === RECONCILE) && fiber.next;

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

  let isFork = (fiber.f === CAPTURE || fiber.f === RECONCILE) && fiber.next;

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

  let isFork = (fiber.f === CAPTURE || fiber.f === RECONCILE) && fiber.next;

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
      (!mount.quote || mount.quote.from !== mount) &&
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

  if (roots.get(context) !== fiber) {
    if (context.capture) throw new Error(`Cannot use capture ${context.displayName} as a context`);

    fiber.context = makeContextState(fiber, fiber.context, context, value);
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
    fiber.context = makeContextState(fiber, fiber.context, capture, registry);

    const Resume = makeFiberReduction(fiber, reduction);
    fiber.next = makeNextFiber(fiber, Resume, 'Resume');
    fiber.path = [...fiber.path, 0];
  }

  inlineFiberCall(fiber, calls);
  mountFiberContinuation(fiber, use(fiber.next.f, Next), 1);
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
      host.schedule(next, NOP);
      host.flush();
    }
  }, fiber.next);
}

// Dispose of a fiber's resources and all its mounted sub-fibers
export const disposeFiber = <F extends ArrowFunction>(fiber: LiveFiber<F>) => {
  disposeFiberState(fiber);

  fiber.bound = undefined;
  if (fiber.host) fiber.host.dispose(fiber);
}

// Dispose of a fiber's mounted sub-fibers
export const disposeFiberState = <F extends ArrowFunction>(fiber: LiveFiber<F>) => {
  const {id, next, quote, unquote, yeeted} = fiber;

  disposeFiberMounts(fiber);
  if (next) disposeFiber(next);

  if (fiber.type === QUOTE) {
    const {to} = quote!;
    reconcileFiberCall(to, null, id, true);
    pingFiber(to);
  }
  if (fiber.type === UNQUOTE) {
    const {from} = unquote!;
    reconcileFiberCall(from, null, id, true);    
    pingFiber(from);
  }

  if (yeeted) {
    bustFiberYeet(fiber, true);
    visitYeetRoot(fiber);
    if (yeeted.up) fiber.yeeted = yeeted.up;
  }

  fiber.next = null;
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
    const mount = makeSubFiber(parent, newMount!, newMount!.by ?? parent.id, key);
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
    // Slice into new stack if too deep, or if fenced
    const {host} = mount;
    if (host && (fenced || host?.slice(mount))) return host.visit(mount);

    const element = renderFiber(mount);
    if (element !== undefined) updateFiber(mount, element);
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

    LOG && console.log('Reduce', formatNode(fiber), '->', formatNode(root));
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
  if (host) for (let sub of host.traceDown(fiber)) {
    const LOG = LOGGING.fiber;
    LOG && console.log('Invalidating Node', formatNode(sub));

    host.visit(sub);
    bustFiberMemo(sub);
  }
}

// Track number of runs per fiber
export const pingFiberCount = <F extends ArrowFunction>(fiber: LiveFiber<F>) => {
  fiber.runs = incrementVersion(fiber.runs);
}

// Get argument count for a function, including optional arguments.
export const getArgCount = <F extends Function>(f: F) => {
  let s = Function.toString.call(f).split(/\)|=>/)[0];
  if (s == null) return 0;

  s = s.replace(/\s+/g, '').replace(/^\(/, '').replace(/,$/, '');
  if (s.length === 0) return 0;

  return s.split(',').length;
}
