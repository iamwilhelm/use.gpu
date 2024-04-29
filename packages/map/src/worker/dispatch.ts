import { wrap } from 'comlink';
import { seq } from '@use-gpu/core';

export const getConcurrency = () => (
  Math.max(1, Math.min(navigator.hardwareConcurrency * 0.8, navigator.hardwareConcurrency - 2))
);

export const makeDispatch = (make: () => any, n: number = 4) => {
  const workers = seq(n | 0).map(make);
  const comlinks = workers.map((worker) => wrap(worker));

  const order = comlinks;
  const queue = [];
  const enqueue = setTimeout;

  let terminated = false;
  const terminate = () => {
    for (const worker of workers) {
      worker.terminate();
    }
    queue.length = 0;
    terminated = true;
  };

  const call = (method: string, args: any[]) => {
    if (terminated) throw new Error("Calling terminated worker");

    const promise = new Promise(resolve => {
      queue.push({method, args, resolve});
    });

    enqueue(pop);
    return promise;
  };

  const pop = async () => {
    if (!queue.length || terminated) return;

    const worker = order.shift();
    if (!worker) return;

    const call = queue.shift();
    if (terminated) {
      order.push(worker);
      call.resolve(null);

      enqueue(pop);
      return;
    }

    const result = await worker[call.method](...call.args);
    if (terminated) return;

    order.push(worker);
    call.resolve(result);

    enqueue(pop);
  };

  const self = new Proxy({}, {
    get: (target, s) => {
      if (s === 'terminate') return terminate;
      return (...args: any[]) => call(s, args);
    },
  });

  return self;
};
