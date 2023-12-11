import type { Emit, TypedArrayConstructor, VectorLike, VectorLikes } from '@use-gpu/core';
import { isTypedArray, emitIntoNumberArray } from '@use-gpu/core';

export const toScalarArray = (x: VectorLike, constructor: TypedArrayConstructor = Float32Array) => new constructor(x);

export const toVectorArray = (xs: VectorLikes, dims: number, w: number = 0, constructor: TypedArrayConstructor = Float32Array) => {
  const n = xs.length;
  if (!n) return new constructor(0);

  const scalar = typeof xs[0] === 'number';
  if (scalar && dims === 1) {
    return new constructor(xs as any as number[]);
  }
  else if (scalar) {
    throw new Error("Data point is a scalar when vector is expected");
  }

  if (isTypedArray(xs)) return xs;

  const d = (xs[0] as any)?.length || 0;
  if (!d) throw new Error("Data point cannot be empty array or vector");
  if (d > 4) throw new Error("Data point cannot be larger than 4D");

  const vs = xs as any as number[][];

  const to = new constructor(n * dims);
  if (dims === 1) {
    emitIntoNumberArray((emit: Emit, i: number) => {
      const [a] = vs[i];
      emit(a);
    }, to, dims);
  }
  else if (dims === 2) {
    if (d === 1) {
      emitIntoNumberArray((emit: Emit, i: number) => {
        const [a] = vs[i];
        emit(a, 0);
      }, to, dims);
    }
    else {
      emitIntoNumberArray((emit: Emit, i: number) => {
        const [a, b] = vs[i];
        emit(a, b);
      }, to, dims);
    }
  }
  else if (dims === 3) {
    if (d === 1) {
      emitIntoNumberArray((emit: Emit, i: number) => {
        const [a] = vs[i];
        emit(a, 0, 0);
      }, to, dims);
    }
    else if (d === 2) {
      emitIntoNumberArray((emit: Emit, i: number) => {
        const [a, b] = vs[i];
        emit(a, b, 0);
      }, to, dims);
    }
    else {
      emitIntoNumberArray((emit: Emit, i: number) => {
        const [a, b, c] = vs[i];
        emit(a, b, c);
      }, to, dims);
    }
  }
  else if (dims === 4) {
    if (d === 1) {
      emitIntoNumberArray((emit: Emit, i: number) => {
        const [a] = vs[i];
        emit(a, 0, 0, w);
      }, to, dims);
    }
    else if (d === 2) {
      emitIntoNumberArray((emit: Emit, i: number) => {
        const [a, b] = vs[i];
        emit(a, b, 0, w);
      }, to, dims);
    }
    else if (d === 3) {
      emitIntoNumberArray((emit: Emit, i: number) => {
        const [a, b, c] = vs[i];
        emit(a, b, c, w);
      }, to, dims);
    }
    else {
      emitIntoNumberArray((emit: Emit, i: number) => {
        const [a, b, c, d] = vs[i];
        emit(a, b, c, d);
      }, to, dims);
    }
  }
  else {
    throw new Error(`Unsupported dims ${dims}`);
  }
};
