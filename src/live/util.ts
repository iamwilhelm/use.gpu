import { LiveContext, Task, Action, Dispatcher } from './types';

export const makeActionScheduler = () => {
  const queue = [] as Action[];

  let timer = null as any;
  let onUpdate = null as any;

  const bind = (f: Dispatcher) => onUpdate = f;

  const schedule = (context: LiveContext<any>, task: Task) => {
    queue.push({context, task});
    if (!timer) timer = setTimeout(flush, 0);
  };

  const flush = () => {
    timer = null;
    queue.sort((a: Action, b: Action) => a.context.depth - b.context.depth);
    for (let {task} of queue) task();
    if (onUpdate) {
      const q = queue.slice();
      queue.length = 0;

      onUpdate(q);
    }
  };

  return {bind, schedule, flush};
}

export const makeDisposalTracker = () => {
  const disposal = new WeakMap<LiveContext<any>, Task[]>();

  const track = (context: LiveContext<any>, t: Task) => {
    let list = disposal.get(context);
    if (!list) disposal.set(context, list = []);
    list.push(t);
  }

  const dispose = (context: LiveContext<any>) => {
    let tasks = disposal.get(context);
    if (tasks) {
      disposal.delete(context);
      for (let task of tasks) task();
    }
  }

  return {track, dispose};
}

export const makePaintRequester = () => {
  let pending = false;
  let queue: Task[] = [];

  const flush = () => {
    let q = queue.slice();
    queue.length = 0;
    pending = false;

    for (let t of q) t();
  }

  return (t: Task) => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(flush);
    }
    queue.push(t);
  }
}
