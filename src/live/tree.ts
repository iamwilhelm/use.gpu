import { Key, Action, Task, Mounts, LiveContext, DeferredCall } from './types';
import { bind, makeContext } from './live';
import { formatNode } from './debug';
import { makeActionScheduler, makeDisposalTracker, makePaintRequester } from './util';

const DEBUG = false;

const NO_ARGS = [] as any[];

export const makeHost = () => {
  const scheduler = makeActionScheduler();
  const tracker = makeDisposalTracker();
  const host = {
    schedule: scheduler.schedule,
    track: tracker.track,
    dispose: tracker.dispose,
    __stats: {mounts: 0, unmounts: 0, updates: 0},
    __flush: scheduler.flush,
  };
  return {host, scheduler, tracker};
}

export const prepareHostContext = <F extends Function>(node: DeferredCall<F>) => {
  const {host, scheduler, tracker} = makeHost();
  const context = makeContext(node.f, host, null, node.args);
  return {context, host, scheduler, tracker};
}

export const prepareSubContext = <F extends Function>(parent: LiveContext<any>, node: DeferredCall<F>) => {
  const {host} = parent;
  const context = makeContext(node.f, host, parent, node.args);
  return context;
}

export const renderWithDispatch = <T>(
  dispatch: (t: Task) => T,
) => <F extends Function>(node: DeferredCall<F>) => {
  let generation = 1;

  DEBUG && console.log('Rendering Root', formatNode(node));

  const {context, host, scheduler} = prepareHostContext(node);

  const reenter = (as: Action[]) => {
    dispatch(() => {
      generation++;

      const ctxs = as.map(({context}) => context);
      ctxs.sort((a, b) => a.depth - b.depth);

      if (ctxs.length) {
        const [{depth: min}] = ctxs;
        const top = ctxs.filter(({depth}) => depth === min);
        const uniq = top.filter((c, i) => top.indexOf(c) === i);
        for (let ctx of uniq) {
          DEBUG && console.log('Updating Sub-Root', formatNode(ctx.call));
          if (host) host.__stats.updates++;
          renderContext(ctx, generation);
        }
      }
      else {
        DEBUG && console.log('Updating Root', formatNode(context.call));
        if (host) host.__stats.updates++;
        renderContext(context, generation);
      }
    });
  };

  scheduler.bind(reenter);

  if (host) host.__stats.mounts++;
  return dispatch(() => renderContext(context));
}

export const renderPaint = (() => {
  const onPaint = makePaintRequester();
  return <F extends Function>(node: DeferredCall<F>) => {
    return new Promise((resolve) => {
      onPaint(() => resolve(renderSync(node)));
    });
  };
})();

export const renderSync = renderWithDispatch<LiveContext<any>>((t: Task) => t() as any as LiveContext<any>);
export const renderAsync = renderWithDispatch<void>((t: Task) => { setTimeout(t, 0); });
export const render = renderPaint;

export const renderContext = <F extends Function>(context: LiveContext<F>, generation?: number) => {
  if (generation !== undefined) context.generation = generation;

  const out = context.bound(...(context.call.args ?? NO_ARGS));
  const nodes = (out ? (!Array.isArray(out) ? [out] : out) : []) as DeferredCall<any>[];

  let {mounts} = context;
  if (!mounts && nodes.length) mounts = context.mounts = new Map();

  if (mounts) {
    let index = 0;
    for (let node of nodes) {
      // Insert/update rendered nodes
      let key = node.key ?? index++;
      const prev = mounts.get(key) ?? null;
      updateNode(context, key, prev, node);
    }
    for (let key of mounts.keys()) {
      // Unmount unrendered nodes
      const prev = mounts.get(key);
      if (prev && (prev.generation !== context.generation)) updateNode(context, key, prev, null);
    }
  }

  return context;
}

export const disposeContext = <F extends Function>(context: LiveContext<F>) => {
  const {mounts} = context;
  if (mounts) for (let key of mounts.keys()) {
    const prev = mounts.get(key);
    if (prev) disposeContext(prev);
  }
  if (context.host) context.host.dispose(context);
}

export const updateNode = <P extends Function, F extends Function>(
  context: LiveContext<P>,
  key: Key,
  prev: LiveContext<F> | null,
  node: DeferredCall<F> | null,
) => {
  const {mounts, host} = context;
  const from = prev?.call.f;
  const to = node?.f;

  const replace = from && to && from !== to;

  if ((!to && from) || replace) if (prev) {
    DEBUG && console.log('Unmounting', key, formatNode(prev?.call));
    if (host) host.__stats.unmounts++;

    if (mounts) mounts.delete(key);
    disposeContext(prev);
  }

  if ((to && !from) || replace) if (node) {
    DEBUG && console.log('Mounting', key, formatNode(node));
    if (host) host.__stats.mounts++;

    const child = makeContext(node.f, context.host, context, node.args);
    if (mounts) mounts.set(key, child);
    renderContext(child);
  }

  if (from && to && !replace) if (prev && node) {
    DEBUG && console.log('Updating', key, formatNode(node));
    if (host) host.__stats.updates++;

    prev.generation = context.generation;
    prev.call.args = node?.args;

    renderContext(prev);
  }
}
