import { Key, Action, Task, LiveFiber, DeferredCall } from './types';

import { makeFiber, makeSubFiber, renderFiber } from './fiber';
import { makeActionScheduler, makeDisposalTracker, makePaintRequester, isSubPath } from './util';
import { formatNode } from './debug';

let DEBUG = true;
//setTimeout((() => DEBUG = false), 900);

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

export const makeHostFiber = <F extends Function>(node: DeferredCall<F>) => {
  const {host, scheduler, tracker} = makeHost();
  const fiber = makeFiber(node.f, host, null, node.args);
  return {fiber, host, scheduler, tracker};
}

export const renderWithDispatch = <T>(
  dispatch: (t: Task) => T,
) => <F extends Function>(node: DeferredCall<F>) => {
  DEBUG && console.log('Rendering Root', formatNode(node));

  const {fiber, host, scheduler} = makeHostFiber(node);

  const reenter = (as: Action[]) => {
    dispatch(() => {
      const fibers = as.map(({fiber}) => fiber);

      if (fibers.length) {
        const roots = [] as LiveFiber<any>[];
        fibers.sort((a, b) => a.depth - b.depth);
        nextFiber: for (let f of fibers) {
          for (let r of roots) if (isSubPath(r.path, f.path)) continue nextFiber;
          roots.push(f);
        }

        for (const sub of roots) {
          DEBUG && console.log('Updating Sub-Root', formatNode(sub));
          if (host) host.__stats.updates++;
          renderFiber(sub);
        }
      }
      else {
        DEBUG && console.log('Updating Root', formatNode(fiber));
        if (host) host.__stats.updates++;
        renderFiber(fiber);
      }
    });
  };

  scheduler.bind(reenter);

  if (host) host.__stats.mounts++;
  return dispatch(() => renderFiber(fiber));
}

export const renderPaint = (() => {
  const onPaint = makePaintRequester();
  return <F extends Function>(node: DeferredCall<F>) => {
    return new Promise((resolve) => {
      onPaint(() => resolve(renderSync(node)));
    });
  };
})();

export const renderSync = renderWithDispatch<LiveFiber<any>>((t: Task) => t() as any as LiveFiber<any>);
export const renderAsync = renderWithDispatch<void>((t: Task) => { setTimeout(t, 0); });
export const render = renderPaint;
