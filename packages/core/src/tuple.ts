import { TypedArray } from './types';

type Tuples = {
  get: (i: number, j: number) => number,
  iterate: (f: (...args: number[]) => void, start?: number, end?: number) => void;
}

export const makeTuples = <N extends number>(array: TypedArray | number[], dims: N): TupleStore<N> => {
  const n = array.length / dims;
  const t: number[] = [];

  const get = (i: number, j: number) => array[i * dims + j];

  const iterate = (f: (...args: number[]) => void, start: number = 0, end: number = n) => {
    while (start < 0) start += n;
    while (end < 0) end += n;
    
    const s = start * dims;
    const e = end * dims;

    if (dims === 1) {
      for (let i = s; i < e; ++i) {
        f(array[i], i);
      }
      return;
    }
    if (dims === 2) {
      for (let i = s; i < e; i += 2) {
        f(array[i], array[i + 1], i >> 1);
      }
      return;
    }
    if (dims === 3) {
      for (let i = s, j = start; i < e; i += 3) {
        f(array[i], array[i + 1], array[i + 2], j++);
      }
      return;
    }
    if (dims === 4) {
      for (let i = s; i < e; i += 4) {
        f(array[i], array[i + 1], array[i + 2], array[i + 3], i >> 2);
      }
      return;
    }

    for (let i = s, j = start; i < e; i += dims) {
      t.length = 0;
      for (let k = 0; k < dims; ++k) t.push(array[i + k]);
      t.push(j++);
      f(...t);
    }
  };

  return {get, iterate, dims};
};
