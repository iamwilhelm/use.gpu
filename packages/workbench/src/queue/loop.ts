import type { LiveComponent, LiveElement, LiveNode, LiveFiber, Task, PropsWithChildren, ArrowFunction } from '@use-gpu/live';
import { use, detach, provide, unquote, yeet, gather, useCallback, useOne, useResource, tagFunction, formatNodeName, incrementVersion } from '@use-gpu/live';

import { useRenderContext } from '../providers/render-provider';
import { FrameContext, usePerFrame } from '../providers/frame-provider';
import { TimeContext, TimeContextProps } from '../providers/time-provider';
import { LoopContext } from '../providers/loop-provider';
import { QueueReconciler } from '../reconcilers';

const {reconcile, quote, signal} = QueueReconciler;

export type LoopProps = {
  live?: boolean,
};

export type LoopRef = {
  time: {
    timestamp: number,
    delta: number,
    elapsed: number,
    start: number,
  },
  version: {
    frame: number,
    rendered: number,
  },
  loop: {
    request?: (fiber?: LiveFiber<any>) => TimeContextProps,
  },
  children?: LiveNode,

  run?: () => void,
  dispatch?: () => void,
};

/** Provides `useAnimationFrame` and clock to allow for controlled looping and animation. */
export const Loop: LiveComponent<LoopProps> = (props: PropsWithChildren<LoopProps>) => {
  const {live, children} = props;

  const ref: LoopRef = useOne(() => ({
    time: {
      start: 0,
      timestamp: -Infinity,
      elapsed: 0,
      delta: 0,
    },
    version: {
      frame: 0,
      rendered: 0,
    },
    loop: {
      request: () => ref.time,
    },
    children,
  }));

  ref.children = children;

  const requestSyncRender = useCallback(() => ref.version.frame = incrementVersion(ref.version.rendered));

  // Request animation frame wrapper
  // for looped component re-rendering.
  const request = useResource((dispose) => {
    const {time, version, loop} = ref;
    let running = live;
    let pending = false;
    let fibers: LiveFiber<any>[] = [];

    const render = (timestamp: number) => {
      requestSyncRender();
      pending = false;

      if (running) request();

      if (time.timestamp === -Infinity) time.start = timestamp;
      else time.delta = timestamp - time.timestamp;

      time.elapsed = timestamp - time.start;
      time.timestamp = timestamp;

      for (const fiber of fibers) fiber.host?.schedule(fiber);
      fibers.length = 0;

      const {run} = ref;
      if (run) run();

      if (!pending) time.timestamp = -Infinity;
    };

    const request = (fiber?: LiveFiber<any>) => {
      if (!pending) requestAnimationFrame(render);
      if (fiber && fibers.indexOf(fiber) < 0) fibers.push(fiber);
      pending = true;

      return ref.time;
    };
    dispose(() => running = false);

    return loop.request = request;
  }, [live]);

  useRenderContext();
  usePerFrame();
  request!();
  requestSyncRender();

  const Run = useCallback(tagFunction(() => {
    const {time, version, loop, children} = ref;

    const view = useOne(() => [
      signal(),
      provide(LoopContext, ref.loop, children),
    ], children);

    const t = {...time};
    return (
      provide(FrameContext, ref.version.frame,
        provide(TimeContext, t, view)
      )
    );
  }, 'Run'));

  // Intercept unscheduled renders
  // and ensure steady rendering
  // when children change.
  const Resume = (ts: ArrowFunction[]) => {
    const {version} = ref;

    const dispatch = () => {
      const children: LiveElement = [];
      for (const task of ts) {
        const c = task();
        if (c) children.push(c);
      }

      const render = children.length ? children : null;
      return render;
    };

    let pending = false;
    return useOne(() => [
      signal(),
      quote(yeet(() => {
        // In animation frame or after self-render - sync
        if (version.frame > version.rendered) {
          version.rendered = version.frame;
          return dispatch();
        }
        // Outside animation frame - async
        else if (!pending) {
          pending = true;
          const {rendered} = version;
          requestAnimationFrame(() => {
            pending = false;
            // If no loop frame requested since, dispatch
            if (rendered === version.rendered) dispatch();
          });
        }
      })),
    ], ts);
  };

  return (
    reconcile(
      quote(
        gather(
          unquote(
            detach(use(Run), (render: Task) => ref.run = render)
          ),
          Resume,
        )
      )
    )
  );
}
