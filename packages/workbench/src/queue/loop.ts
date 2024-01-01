import type { LiveComponent, LiveElement, LiveNode, LiveFiber, Task, PropsWithChildren, ArrowFunction } from '@use-gpu/live';
import { use, detach, provide, unquote, yeet, gather, useCallback, useOne, useResource, useState, tagFunction, formatNodeName, incrementVersion } from '@use-gpu/live';

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
      pending: false,
      queued: false,
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
    let mounted = true;
    let fibers: LiveFiber<any>[] = [];

    const render = (timestamp: number) => {
      requestSyncRender();
      ref.version.pending = false;

      if (live && mounted) request();
      if (!mounted) return;

      if (time.timestamp === -Infinity) time.start = timestamp;
      else time.delta = timestamp - time.timestamp;

      time.elapsed = timestamp - time.start;
      time.timestamp = timestamp;

      for (const fiber of fibers) fiber.host?.schedule(fiber);
      fibers.length = 0;

      const {run} = ref;
      if (run) run();

      // If stopped, reset start time
      if (!ref.version.pending) time.timestamp = -Infinity;
    };

    const request = (fiber?: LiveFiber<any>) => {
      if (!ref.version.pending) requestAnimationFrame(render);
      if (fiber && fibers.indexOf(fiber) < 0) fibers.push(fiber);
      ref.version.pending = true;

      return ref.time;
    };
    dispose(() => mounted = false);

    return loop.request = request;
  }, [live]);

  useRenderContext();
  usePerFrame();
  request!();

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
    const [dispatches, setDispatches] = useState(0);
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

    // In animation frame or after self-render - sync
    if (version.frame != version.rendered) {
      version.rendered = version.frame;
    }
    // Outside animation frame - async
    else if (!version.pending && !version.queued) {
      ref.version.queued = true;

      const {rendered} = version;
      requestAnimationFrame(() => {
        // If no loop frame requested since, dispatch
        if (rendered === version.rendered) setDispatches(d => d + 1);
      });
    }

    return useOne(() => {
      ref.version.queued = false;
      return [
        signal(), // extra signal so that yeet can be memoized
        quote(yeet(ts)),
      ];
    }, version.rendered + dispatches);
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
