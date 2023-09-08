import type { LiveComponent, LiveElement, LiveNode, LiveFiber, Task, PropsWithChildren, ArrowFunction } from '@use-gpu/live';
import { use, signal, detach, provide, reconcile, quote, unquote, yeet, gather, useCallback, useOne, useResource, tagFunction, formatNodeName } from '@use-gpu/live';

import { FrameContext, usePerFrame } from '../providers/frame-provider';
import { TimeContext } from '../providers/time-provider';
import { LoopContext } from '../providers/loop-provider';

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
    request?: (fiber?: LiveFiber<any>) => void,
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
      request: () => {},
    },
    children,
  }));

  ref.children = children;

  // Request animation frame wrapper
  // for looped component re-rendering.
  const request = useResource((dispose) => {
    const {time, version, loop} = ref;
    let running = live;
    let pending = false;
    let fibers: LiveFiber<any>[] = [];

    const render = (timestamp: number) => {
      version.frame++;
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
    };
    dispose(() => running = false);

    return loop.request = request;
  }, [live]);

  usePerFrame();
  request!();

  // Intercept asynchronous renders
  // and requote towards <Queue>
  const Resume = (ts: ArrowFunction[]) => {
    const {version} = ref;

    const next = useOne(() => [
      signal(),
      quote(yeet(ts)),
    ], ts);

    let pending = false;
    return detach(next, (dispatch: Task) => {
      // In animation frame - sync
      if (version.frame > version.rendered) {
        version.rendered = version.frame;
        dispatch();
      }
      // Outside animation frame - async
      else if (!pending) {
        pending = true;
        let {rendered} = version;
        requestAnimationFrame(() => {
          pending = false;
          // If no loop frame requested since, dispatch
          if (rendered === version.rendered) dispatch();
        });
      }
    });
  };

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
