import type { LiveFiber, FiberQueue } from './types';
import { compareFibers, isSubNode } from './util';
import { formatNodeName } from './debug';

type Q = {
  fiber: LiveFiber<any>
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

  const insert = (fiber: LiveFiber<any>) => {
    if (set.has(fiber)) return;
    set.add(fiber);
    
    if (!queue) {
      tail = queue = {fiber, next: null};
      return;
    }

    if (tail) {
      if (compareFibers(tail.fiber, fiber) <= 0) {
        tail = tail.next = {fiber, next: null};
        return;
      }
    }

    if (compareFibers(queue.fiber, fiber) >= 0) {
      queue = {fiber, next: queue};
      return;
    }

    if (!queue.next) return;

    let q = queue;
    if (hint && compareFibers(hint.fiber, fiber) <= 0) {
      q = hint;
    }

    while (q.next) {
      if (compareFibers(q.next.fiber, fiber) >= 0) {
        q.next = {fiber, next: q.next};
        hint = q;
        return;
      }
      q = q.next;
    }
  }

  const remove = (fiber: LiveFiber<any>) => {
    if (!queue) return;
    if (!set.has(fiber)) return;
    set.delete(fiber);

    let i = 0;
    if (queue.fiber === fiber) {
      if (hint === queue) hint = hint.next;

      queue = queue.next;
      if (!queue) tail = null;

      return;
    }

    let q = queue;
    while (q.next) {
      const qn = q.next;
      if (qn.fiber === fiber) {
        if (hint === qn) hint = hint.next;
        q.next = qn.next;
        if (!q.next) tail = q;
        return;
      }
      q = q.next;
    }
  }
  
  const rekey = (fiber: LiveFiber<any>) => {
    const list: LiveFiber<any> = [];

    const {path} = fiber;
    let q = queue;
    let qp = null;

    let skipped = 0;
    let popped = [];

    while (q) {
      if (compareFibers(fiber, q.fiber) >= 0) {
        hint = qp = q;
        q = q.next;
        skipped++;
        continue;
      }
      if (isSubNode(fiber, q.fiber)) {
        list.push(q.fiber);
        popped.push(formatNodeName(q.fiber) + q.fiber.id);
        if (qp) {
          qp.next = q.next;
          q = q.next;
        }
        else {
          pop();
          q = q.next;
        }
      }
      break;
    }

    if (list.length) {
      list.sort(compareFibers);
      list.forEach(insert);
    }
  };

  const all = () => {
    const out = [];
    let q = queue;
    while (q) {
      out.push(q.fiber);
      q = q.next;
    }
    return out;
  }

  const peek = (): LiveFiber<any> | null => {
    if (!queue) return null;
    return queue.fiber;
  }

  const pop = (): LiveFiber<any> | null => {
    if (!queue) return null;

    let q = queue;
    queue = q.next;

    if (!queue) hint = tail = null;
    else if (hint === q) hint = hint.next;

    set.delete(q.fiber);

    return q.fiber;
  }

  if (init) for (let i of init) insert(i);

  return {insert, remove, rekey, all, peek, pop} as any;
}
