import type { LiveFiber, FiberQueue } from './types';
import { compareFibers } from './util';

type Q = {
  f: LiveFiber<any>
  next: Q | null,
};

// Priority queue that maintains fibers in tree order.
// Allows for quick append at head or tail, or right after last insertion.
//
// The queue is typically short and almost always first-in-first-out.
export const makeFiberQueue = (init?: LiveFiber<any>[]): FiberQueue => {

  let queue: Q | null = null;
  let tail: Q | null = null;
  let hint: Q | null = null;

  const set = new Set<LiveFiber<any>>();

  const insert = (f: LiveFiber<any>) => {
    if (set.has(f)) return;
    set.add(f);

    if (!queue) {
      tail = queue = {f, next: null};
      return;
    }

    if (tail) {
      if (compareFibers(tail.f, f) < 0) {
        tail = tail.next = {f, next: null};
        return;
      }
    }

    if (compareFibers(queue.f, f) > 0) {
      queue = {f, next: queue};
      return;
    }

    if (!queue.next) return;

    let q = queue;
    if (hint && compareFibers(hint.f, f) < 0) {
      q = hint;
    }

    while (q.next) {
      if (compareFibers(q.next.f, f) > 0) {
        q.next = {f, next: q.next};
        hint = q;
        return;
      }
      q = q.next;
    }
  }

  const remove = (f: LiveFiber<any>) => {
    if (!queue) return;
    if (!set.has(f)) return;
    set.delete(f);

    let i = 0;
    if (queue.f === f) {
      if (hint === queue) hint = hint.next;

      queue = queue.next;
      if (!queue) tail = null;

      return;
    }

    let q = queue;
    while (q.next) {
      const qn = q.next;
      if (qn.f === f) {
        if (hint === qn) hint = hint.next;
        q.next = qn.next;
        if (!q.next) tail = q;
        return;
      }
      q = q.next;
    }
  }

  const all = () => {
    const out = [];
    let q = queue;
    while (q) {
      out.push(q.f);
      q = q.next;
    }
    return out;
  }

  const peek = (): LiveFiber<any> | null => {
    if (!queue) return null;
    return queue.f;
  }

  const pop = (): LiveFiber<any> | null => {
    if (!queue) return null;

    let q = queue;
    queue = q.next;

    if (!queue) hint = tail = null;
    else if (hint === q) hint = hint.next;

    set.delete(q.f);

    return q.f;
  }

  if (init) for (let i of init) insert(i);

  return {insert, remove, all, peek, pop} as any;
}
