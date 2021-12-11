import { TypedArray, UniformType, UniformAttribute, EmitterExpression, Emitter, Accessor, AccessorSpec } from './types';
import { UNIFORM_SIZES, UNIFORM_ARRAY_TYPES, UNIFORM_DIMS } from './constants';

type NumberArray = TypedArray | number[];

export const makeDataArray = (type: UniformType, length: number) => {
  const ctor = UNIFORM_ARRAY_TYPES[type];
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

export const makeDataAccessor = (format: UniformType, accessor: AccessorSpec) => {
  if (typeof accessor === 'object' && 
      accessor.length === +accessor.length) {
    length = Math.floor(accessor.length / UNIFORM_DIMS[format]);
    return {raw: accessor as any[], length};
  }
  else if (typeof accessor === 'string') {
    const k = accessor;
    return {fn: (o: any) => o[k] as any};
  }
  else if (typeof accessor === 'function') {
    return {fn: accessor as Accessor};
  }
  else throw new Error(`Invalid accessor ${accessor}`);
}

export const emitIntoNumberArray = (expr: EmitterExpression, to: NumberArray, dims: number) => {
  const emit = makeDataEmitter(to, dims);
  const n = to.length / dims;
  let i = 0;
  for (let i = 0; i < n; ++i) expr(emit, i, n);
}

export const copyNumberArray = (from: NumberArray, to: NumberArray) => {
  const n = Math.min(from.length, to.length);
  for (let i = 0; i < n; ++i) to[i] = from[i];
}

export const copyNumberArrays = (from: NumberArray[], to: NumberArray) => {
  let pos = 0;
  const n = from.length;
  for (let i = 0; i < n; ++i) {
    const src = from[i];
    const l = src.length;
    copyNumberArrayRange(src, to, 0, pos, l);
    pos += l;
  }
}

export const copyNestedNumberArray = (from: NumberArray[], to: NumberArray, dims: number) =>
  copyNestedNumberArrayRange(from, to, 0, 0, from.length, dims);

export const copyNumberArrayRange = (
  from: NumberArray, to: NumberArray,
  fromIndex: number, toIndex: number, length: number,
) => {
  const n = length;
  for (let i = 0; i < n; ++i) to[i + toIndex] = from[i + fromIndex];
}

export const copyNestedNumberArrayRange = (
  from: any[], to: NumberArray,
  fromIndex: number, toIndex: number, length: number,
  dims: number,
) => {
  const n = length;
  let j = toIndex;
  if (dims === 1) {
    for (let i = 0; i < n; ++i) {
      to[i] = from[i + fromIndex];
    }
  }
  else if (dims === 2) {
    for (let i = 0; i < n; ++i) {
      [to[j++], to[j++]] = from[i + fromIndex];
    }
  }
  else if (dims === 3) {
    for (let i = 0; i < n; ++i) {
      [to[j++], to[j++], to[j++]] = from[i + fromIndex];
    }
  }
  else if (dims === 4) {
    for (let i = 0; i < n; ++i) {
      [to[j++], to[j++], to[j++], to[j++]] = from[i + fromIndex];
    }
  }
  else {
    for (let i = 0; i < n; ++i) {
      const v = from[i + fromIndex];
      for (let k = 0; k < v.length; ++k) to[j++] = v[k];
    }
  }
}

export const copyNumberArrayChunked = (from: NumberArray, to: NumberArray, dims: number, chunks: number[]) => {
  let pos = 0;
  const c = chunks.length;
  const n = from.length / dims;

  if (dims === 1) {
    for (let i = 0; i < n; ++i) {
      const c = chunks[i];
      const read = i * dims;
      for (let j = 0; j < c; ++j) {
        to[pos++] = from[read];
      }
    }
  }
  else if (dims === 2) {
    for (let i = 0; i < n; ++i) {
      const c = chunks[i];
      const read = i * dims;
      for (let j = 0; j < c; ++j) {
        to[pos++] = from[read];
        to[pos++] = from[read + 1];
      }
    }
  }
  else if (dims === 3) {
    for (let i = 0; i < n; ++i) {
      const c = chunks[i];
      const read = i * dims;
      for (let j = 0; j < c; ++j) {
        to[pos++] = from[read];
        to[pos++] = from[read + 1];
        to[pos++] = from[read + 2];
      }
    }
  }
  else if (dims === 2) {
    for (let i = 0; i < n; ++i) {
      const c = chunks[i];
      const read = i * dims;
      for (let j = 0; j < c; ++j) {
        to[pos++] = from[read];
        to[pos++] = from[read + 1];
        to[pos++] = from[read + 2];
        to[pos++] = from[read + 3];
      }
    }
  }
  else {
    for (let i = 0; i < n; ++i) {
      const c = chunks[i];
      const read = i * dims;
      for (let j = 0; j < c; ++j) {
        for (let k = 0; k < dims; ++k) {
          to[pos++] = from[read + k];
        }
      }
    }
  }
}

export const copyChunksToSegments = (to: NumberArray, chunks: number[]) => {
  let pos = 0;
  for (const c of chunks) {
    if (!c) continue;
    if (c === 1) to[pos++] = 0;
    else {
      to[pos++] = 1;
      for (let i = 2; i < c; ++i) to[pos++] = 3;
      to[pos++] = 2;
    }
  }
  while (pos < to.length) to[pos++] = 0;
}

export const copyDataArray = (from: any[], to: NumberArray, dims: number, accessor: Accessor) => {
  const n = Math.min(from.length, Math.floor(to.length / dims));
  let j = 0;
  if (dims === 1) {
    for (let i = 0; i < n; ++i) {
      to[i] = accessor(from[i]);
    }
  }
  else if (dims === 2) {
    for (let i = 0; i < n; ++i) {
      [to[j++], to[j++]] = accessor(from[i]);
    }
  }
  else if (dims === 3) {
    for (let i = 0; i < n; ++i) {
      [to[j++], to[j++], to[j++]] = accessor(from[i]);
    }
  }
  else if (dims === 4) {
    for (let i = 0; i < n; ++i) {
      [to[j++], to[j++], to[j++], to[j++]] = accessor(from[i]);
    }
  }
  else {
    for (let i = 0; i < n; ++i) {
      const v = accessor(from[i]);
      for (let k = 0; k < v.length; ++k) to[j++] = v[k];
    }
  }
}

export const copyDataArrays = (from: any[], to: NumberArray, dims: number, accessor: Accessor) => {
  let pos = 0;
  const n = from.length;
  for (let i = 0; i < n; ++i) {
    const src = accessor(from[i]);
    const l = src.length;
    const el = src[0];
    if (el != null) {
      if (typeof el === 'number') copyNumberArrayRange(src, to, 0, pos, l * dims);
      else if (typeof el[0] === 'number') copyNestedNumberArrayRange(src, to, 0, pos, l, dims);
    }
    pos += l * dims;
  }
}

export const copyDataArrayChunked = (from: any[], to: NumberArray, dims: number, chunks: number[], accessor: Accessor) => {
  const n = from.length;
  let j = 0;
  if (dims === 1) {
    for (let i = 0; i < n; ++i) {
      const c = chunks[i];
      const v = accessor(from[i]);
      for (let k = 0; k < c; ++k) {
        to[j++] = v;
      }
    }
  }
  else if (dims === 2) {
    for (let i = 0; i < n; ++i) {
      const c = chunks[i];
      const v = accessor(from[i]);
      for (let k = 0; k < c; ++k) {
        [to[j++], to[j++]] = v;
      }
    }
  }
  else if (dims === 3) {
    for (let i = 0; i < n; ++i) {
      const c = chunks[i];
      const v = accessor(from[i]);
      for (let k = 0; k < c; ++k) {
        [to[j++], to[j++], to[j++]] = v;
      }
    }
  }
  else if (dims === 4) {
    for (let i = 0; i < n; ++i) {
      const c = chunks[i];
      const v = accessor(from[i]);
      for (let k = 0; k < c; ++k) {
        [to[j++], to[j++], to[j++], to[j++]] = v;
      }
    }
  }
  else {
    let j = 0;
    for (let i = 0; i < n; ++i) {
      const c = chunks[i];
      const v = accessor(from[i]);
      for (let k = 0; k < c; ++k) {
        for (let l = 0; l < v.length; ++l) to[j++] = v[l];
      }
    }
  }
}
