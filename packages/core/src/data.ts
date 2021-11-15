import { TypedArray } from './types';
import { UNIFORM_SIZES, UNIFORM_ARRAY_TYPE, UNIFORM_DIMS } from './constants';

type NumberArray = TypedArray | number[];

export const makeDataArray = (type: UniformType, length: number) => {
  const ctor = UNIFORM_ARRAY_TYPE[type];
  const dims = UNIFORM_DIMS[type];
  const array = new ctor(length * dims);
  return {array, dims};
};

export const makeDataEmitter = (to: NumberArray, dims: number): Emitter => {
  let i = 0;
  if (dims === 1) return (a: number) => { to[i++] = a; }
  if (dims === 2) return (a: number, b: number) => { to[i++] = a; to[i++] = b; }
  if (dims === 3) return (a: number, b: number, c: number) => { to[i++] = a; to[i++] = b; to[i++] = c; }
  if (dims === 4) return (a: number, b: number, c: number, d: number) => { to[i++] = a; to[i++] = b; to[i++] = c; to[i++] = d; }
  return (...args: number[]) => {
    const n = args.length;
    for (let j = 0; j < n; ++j) to[i++] = args[j];
  }
}

export const copyNumberArray = (from: NumberArray | number[], to: NumberArray) => {
  const n = Math.min(from.length, to.length);
  for (let i = 0; i < n; ++i) to[i] = from[i];
}

export const emitIntoNumberArray = (expr: Emitter, to: NumberArray, dims: number) => {
  const emit = makeDataEmitter(to, dims);
  const n = to.length / dims;
  let i = 0;
  for (let i = 0; i < n; ++i) expr(emit, i, n);
}
