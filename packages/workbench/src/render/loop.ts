import type { LiveComponent, LiveElement, LiveFiber, Task } from '@use-gpu/live';
import { use, quote, yeet, detach, provide, useCallback, useOne, useResource, tagFunction } from '@use-gpu/live';

import { FrameContext, usePerFrame } from '../providers/frame-provider';
import { TimeContext } from '../providers/time-provider';
import { LoopContext } from '../providers/loop-provider';

const NOP = () => {};

export type LoopProps = {
  children?: LiveElement,
};

export type LoopRef = {
  time: {
    timestamp: number,
    delta: number,
    elapsed: number,
    start: number,
  },
  frame: {
    current: number,
  },
  loop: {
    request?: (fiber?: LiveFiber<any>) => void,
  },
  children?: LiveElement,
  dispatch?: () => void,
};

export const Loop: LiveComponent<LoopProps> = (props) => {
  const {live, children} = props;

  const ref: LoopRef = useOne(() => ({
    time: {
      start: 0,
      timestamp: -Infinity,
      elapsed: 0,
      delta: 0,
      frame: 0,
    },
    loop: {
      request: () => {},
    },
    children,
  }));

  ref.children = children;

  const request = useResource((dispose) => {
    const {time, frame, loop} = ref;
    let running = live;
    let pending = false;
    let fibers: LiveFiber<any>[] = [];

    const render = (timestamp: number) => {
      time.frame++;
      pending = false;

      if (time.timestamp === -Infinity) time.start = timestamp;
      else time.delta = timestamp - time.timestamp;

      time.elapsed = timestamp - time.start;
      time.timestamp = timestamp;

      for (const fiber of fibers) fiber.host?.schedule(fiber, NOP);
      fibers.length = 0;

      const {dispatch} = ref;
      if (dispatch) dispatch();
      if (running) request();
    };

    const request = (fiber?: LiveFiber<any>) => {
      if (!pending) requestAnimationFrame(render);
      if (fiber && fibers.indexOf(fiber) < 0) fibers.push(fiber);
      pending = true;
    };
    dispose(() => running = false);

    return loop.request = request;
  }, [live]);

  request!();

  const Dispatch = useCallback(tagFunction(() => {
    const {time, loop, render, children} = ref;

    usePerFrame();

    const view = useOne(() => {
      const signal = quote(yeet());
      return Array.isArray(children) ? [signal, ...children] : [signal, children];
    }, children);

    const t = {...time};
    return (
      provide(FrameContext, time.frame,
        provide(TimeContext, t,
          provide(LoopContext, loop, view)
        )
      )
    );
  }, 'Dispatch'));

  return detach(use(Dispatch), (render: Task) => ref.dispatch = render);
}
