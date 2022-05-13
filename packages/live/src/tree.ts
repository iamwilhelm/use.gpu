import { Key, Action, Task, LiveFiber, LiveElement, LiveNode, LivePure, DeferredCall, DeferredCallInterop, FiberQueue, HostInterface, RenderCallbacks, RenderOptions, ArrowFunction, ReactElementInterop } from './types';

import { makeFiber, renderFiber, updateFiber, disposeFiberMounts, reactInterop } from './fiber';
import { makeActionScheduler, makeDependencyTracker, makeDisposalTracker, makePaintRequester } from './util';
import { makeFiberQueue } from './queue';
import { formatNode } from './debug';
import { use, morph } from './builtin';

const DEFAULT_RENDER_OPTIONS = {
  stackSliceDepth: 20,
};

let DEBUG = false;
let START = +new Date();
//setTimeout((() => DEBUG = false), 4000);

const NO_NODE = () => null;
const NO_ARGS = [] as any[];
const dedupe = <T>(list: T[]): T[] => Array.from(new Set<T>(list));

// Create new runtime host
export const makeHost = (
  options: RenderOptions = DEFAULT_RENDER_OPTIONS,
) => {
  const scheduler  = makeActionScheduler();
  const disposal   = makeDisposalTracker();
  const dependency = makeDependencyTracker();
  const queue      = makeFiberQueue();

  let DEPTH = 0;
  const {stackSliceDepth} = options;
  const depth = (depth: number) => DEPTH = depth;
  const slice = (f: LiveFiber<any>) => f.depth - DEPTH > stackSliceDepth;

  const host = {
    schedule: scheduler.schedule,
    flush: scheduler.flush,

    track: disposal.track,
    untrack: disposal.untrack,
    dispose: disposal.dispose,

    depend: dependency.depend,
    undepend: dependency.undepend,
    traceDown: dependency.traceDown,
    traceUp: dependency.traceUp,

    visit: queue.insert,
    unvisit: queue.remove,
    pop: queue.pop,
    peek: queue.peek,

    depth,
    slice,

    options,

    __ping: () => {},
    __stats: {mounts: 0, unmounts: 0, updates: 0, dispatch: 0},
  } as HostInterface;

  return {host, scheduler, disposal, dependency};
}

// Create top-most fiber with a new host
export const makeHostFiber = <F extends ArrowFunction>(
  node: DeferredCall<any>,
  renderOptions: RenderOptions = DEFAULT_RENDER_OPTIONS,
) => {
  const {host, scheduler, disposal, dependency} = makeHost(renderOptions);
  const fiber = makeFiber(node.f, host, null, node.args);
  return {fiber, host, scheduler, disposal, dependency};
}

// Resolve a LiveElement root to a call
export const resolveRootNode = (children: LiveNode<any>): DeferredCall<any> => {
  const c = reactInterop(children);
  if (Array.isArray(c)) return morph(use(() => c))!;
  if (typeof c === 'string') return use(NO_NODE);
  if (typeof c === 'function') return use(c);
  return c ?? use(NO_NODE);
}

// Rendering entry point
export const renderWithDispatch = <T>(
  dispatch: (t: Task) => T,
) => <F extends ArrowFunction>(
  calls: LiveNode<F>,
  fiber?: LiveFiber<any> | null,
  renderOptions: RenderOptions = DEFAULT_RENDER_OPTIONS,
) => {
  const node = resolveRootNode(calls);

  let host: HostInterface | null = null;
  if (!fiber) {
    DEBUG && console.log('Rendering Root', formatNode(node));

    // Make new root
    let scheduler: any;
    ({fiber, host, scheduler} = makeHostFiber(node, renderOptions));
    const reenter = (as: Action<any>[]) => {
      dispatch(() => {
        const fibers = dedupe(as.map(({fiber}) => fiber));

        DEBUG && console.log('----------------------------');
        DEBUG && console.log('Dispatch to Roots', fibers.map(formatNode), +new Date() - START, 'ms');

        if (fibers.length) renderFibers(host!, fibers);
      });
    };

    scheduler.bind(reenter);
    host.__stats.mounts++;
  }
  else if (fiber.host) {
    host = fiber.host;
    DEBUG && console.log('Updating Root', formatNode(node));

    // Update existing root
    if (fiber.f !== node.f) disposeFiberMounts(fiber);

    fiber.f = node.f;
    fiber.args = node.args;

    host.__stats.updates++;
  }

  if (host) {
    dispatch(() => renderFibers(host!, [fiber!])[0]);
  }

  return fiber;
}

// Render a list of updated fibers as one batch
export const renderFibers = (
  host: HostInterface,
  fibers: LiveFiber<any>[],
): LiveFiber<any>[] => {

  for (const f of fibers) host.visit(f);
  while (host.peek()) {
    const fiber = host.pop();
    if (!fiber) break;

    host.depth(fiber.depth);
    host.__stats.dispatch++;

    DEBUG && console.log('Next Sub-Root', formatNode(fiber));
    
    const element = renderFiber(fiber);
    updateFiber(fiber, element);
  }

  return fibers;
}

// Traverse over fiber and subfiber in render order
export const traverseFiber = (fiber: LiveFiber<any>, f: (f: LiveFiber<any>) => void) => {
  const {mount, mounts, next} = fiber;
  if (mount) traverseFiber(mount, f);
  if (mounts) for (const k of mounts.keys()) traverseFiber(mounts.get(k)!, f);
  if (next) traverseFiber(next, f);
}

const onPaint = makePaintRequester();

// Render sync/async/onPaint
export const renderSync = renderWithDispatch<LiveFiber<any>>((t: Task) => t() as any as LiveFiber<any>);
export const renderAsync = renderWithDispatch<void>((t: Task) => { setTimeout(t, 0); });
export const renderOnPaint = renderWithDispatch<void>((t: Task) => { onPaint(t); });

export const render = renderSync;
