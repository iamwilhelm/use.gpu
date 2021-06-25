import { LiveFiber, Task, Action, Dispatcher } from './types';

export const makeActionScheduler = () => {
  const queue = [] as Action[];

  let timer = null as any;
  let onUpdate = null as any;

  const bind = (f: Dispatcher) => onUpdate = f;

  const schedule = (fiber: LiveFiber<any>, task: Task) => {
    queue.push({fiber, task});
    if (!timer) timer = setTimeout(flush, 0);
  };

  const flush = () => {
    timer = null;
    queue.sort((a: Action, b: Action) => a.fiber.depth - b.fiber.depth);
    for (const {task} of queue) task();
    if (onUpdate) {
      const q = queue.slice();
      queue.length = 0;

      onUpdate(q);
    }
  };

  return {bind, schedule, flush};
}

export const makeDisposalTracker = () => {
  const disposal = new WeakMap<LiveFiber<any>, Task[]>();

  const track = (fiber: LiveFiber<any>, t: Task) => {
    let list = disposal.get(fiber);
    if (!list) disposal.set(fiber, list = []);
    list.push(t);
  }

  const dispose = (fiber: LiveFiber<any>) => {
    const tasks = disposal.get(fiber);
    if (tasks) {
      disposal.delete(fiber);
      for (const task of tasks) task();
    }
  }

  return {track, dispose};
}

export const makePaintRequester = (raf: any = requestAnimationFrame) => {
  let pending = false;
  const queue: Task[] = [];

  const flush = () => {
    const q = queue.slice();
    queue.length = 0;
    pending = false;

    for (const t of q) t();
  }

  return (t: Task) => {
    if (!pending) {
      pending = true;
      raf(flush);
    }
    queue.push(t);
  }
}
