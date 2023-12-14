import type { TypedArray, VectorLike, UniformType, UniformAttribute, Emitter, Emit } from './types';
import { UNIFORM_ARRAY_TYPES, UNIFORM_ARRAY_DIMS, UNIFORM_ATTRIBUTE_SIZES } from './constants';

import { isTypedArray } from './buffer';
import { seq } from './tuple';

type NumberArray = VectorLike;

export const alignSizeTo2 = (n: number, s: number) => {
  let f = n % s;
  return f === 0 ? n : n + (s - f);
};

export const getUniformDims2 = (type: UniformType) => UNIFORM_ARRAY_DIMS[type];

export const makeDataArray2 = (type: UniformType, length: number) => {
  const ctor = UNIFORM_ARRAY_TYPES[type];
  const dims = UNIFORM_ARRAY_DIMS[type];

  const n = alignSizeTo2(length * Math.ceil(dims), 4);

  const array = new ctor(n);
  return {array, dims};
};

export const copyNumberArray2 = (
  from: number[] | TypedArray,
  to: TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
  toIndex: number = 0,
  length?: number,
) => {
  const n = length != null ? length * dims : from.length;

  let s = fromIndex * dims;
  let o = toIndex * dims;

  for (let i = 0; i < n; ++i) {
    to[o++] = from[s + i];
  }
};

export const offsetNumberArray2 = (
  from: number[] | TypedArray,
  to: TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
  toIndex: number = 0,
  length?: number,
  offset?: number,
) => {
  const n = length != null ? length * dims : from.length;

  let s = fromIndex * dims;
  let o = toIndex * dims;

  for (let i = 0; i < n; ++i) {
    to[o++] = from[s + i] + offset;
  }
};
  
export const unweldNumberArray2 = (
  from: number[] | TypedArray,
  to: TypedArray,
  indices: TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
  toIndex: number = 0,
  length?: number,
) => {
  const n = length != null ? length : indices.length;

  let s = fromIndex * dims;
  let o = toIndex * dims;

  if (dims === 1) {
    for (let i = 0; i < n; ++i) {
      to[o++] = from[indices[s + i]];
    }
  }
  else if (dims === 2) {
    for (let i = 0; i < n; ++i) {
      let b = indices[s + i] * 2;
      to[o    ] = from[b];
      to[o + 1] = from[b + 1];
      o += 2;
    }
  }
  else if (dims === 3) {
    for (let i = 0; i < n; ++i) {
      let b = indices[s + i] * 3;
      to[o    ] = from[b];
      to[o + 1] = from[b + 1];
      to[o + 2] = from[b + 2];
      o += 3;
    }
  }
  else if (dims === 4) {
    for (let i = 0; i < n; ++i) {
      let b = indices[s + i] * 4;
      to[o    ] = from[b];
      to[o + 1] = from[b + 1];
      to[o + 2] = from[b + 2];
      to[o + 3] = from[b + 3];
      o += 4;
    }
  }
  else {
    for (let i = 0; i < n; ++i) {
      let b = indices[s + i] * n;
      for (let k = 0; k < dims; ++k) {
        to[o + k] = from[b + k];
      }
      o += dims;
    }
  }
};
  
export const fillNumberArray2 = (
  from: NumberArray | number,
  to: NumberArray,
  dims: number = 1, 
  fromIndex: number = 0,
  toIndex: number = 0,
  count: number,
  offset: number = 0,
) => {
  let pos = toIndex * dims;
  const read = fromIndex * dims;

  const array = from as NumberArray;

  if (typeof from === 'number') {
    if (dims === 1) {
      for (let j = 0; j < count; ++j) {
        to[pos++] = from + offset;
      }
    }
    else {
      for (let j = 0; j < count; ++j) {
        to[pos++] = from + offset;
        for (let k = 0; k < skip; ++k) to[pos++] = 0;
      }
    }
  }
  else if (dims === 1) {
    for (let j = 0; j < count; ++j) {
      to[pos++] = array[read] + offset;
    }
  }
  else if (dims === 2) {
    for (let j = 0; j < count; ++j) {
      to[pos    ] = array[read] + offset;
      to[pos + 1] = array[read + 1] + offset;
      pos += 2;
    }
  }
  else if (dims === 3) {
    for (let j = 0; j < count; ++j) {
      to[pos    ] = array[read] + offset;
      to[pos + 1] = array[read + 1] + offset;
      to[pos + 2] = array[read + 2] + offset;
      pos += 3;
    }
  }
  else if (dims === 4) {
    for (let j = 0; j < count; ++j) {
      to[pos    ] = array[read] + offset;
      to[pos + 1] = array[read + 1] + offset;
      to[pos + 2] = array[read + 2] + offset;
      to[pos + 3] = array[read + 3] + offset;
      pos += 4;
    }
  }
  else {
    for (let j = 0; j < count; ++j) {
      for (let k = 0; k < dims; ++k) {
        to[pos + k] = array[read + k] + offset;
      }
      pos += k;
    }
  }
}

export const copyNestedNumberArray2 = (
  from: number[][] | TypedArray[],
  to: TypedArray,
  fromDims: number,
  toDims: number,
  fromIndex: number = 0,
  toIndex: number = 0,
  length: number,
  w: number = 0,
) => {
  const n = length ?? from.length;

  let s = fromIndex;
  let o = toIndex * toDims;

  if (toDims === 1) {
    for (let i = 0; i < n; ++i) {
      const [a] = from[s + i];
      to[o++] = a;
    }
  }
  else if (toDims === 2) {
    if (fromDims === 1) {
      for (let i = 0; i < n; ++i) {
        const [a] = from[s + i];
        to[o    ] = a;
        to[o + 1] = 0;
        o += 2;
      }
    }
    else {
      for (let i = 0; i < n; ++i) {
        const [a, b] = from[s + i];
        to[o    ] = a;
        to[o + 1] = b;
        o += 2;
      }
    }
  }
  else if (toDims === 3) {
    if (fromDims === 1) {
      for (let i = 0; i < n; ++i) {
        const [a] = from[s + i];
        to[o    ] = a;
        to[o + 1] = 0;
        to[o + 2] = 0;
        o += 3;
      }
    }
    else if (fromDims === 2) {
      for (let i = 0; i < n; ++i) {
        const [a, b] = from[s + i];
        to[o    ] = a;
        to[o + 1] = b;
        to[o + 2] = 0;
        o += 3;
      }
    }
    else {
      for (let i = 0; i < n; ++i) {
        const [a, b, c] = from[s + i];
        to[o    ] = a;
        to[o + 1] = b;
        to[o + 2] = c;
        o += 3;
      }
    }
  }
  else if (toDims === 4) {
    if (fromDims === 1) {
      for (let i = 0; i < n; ++i) {
        const [a] = from[s + i];
        to[o    ] = a;
        to[o + 1] = 0;
        to[o + 2] = 0;
        to[o + 3] = w;
        o += 4;
      }
    }
    else if (fromDims === 2) {
      for (let i = 0; i < n; ++i) {
        const [a, b] = from[s + i];
        to[o    ] = a;
        to[o + 1] = b;
        to[o + 2] = 0;
        to[o + 3] = w;
        o += 4;
      }
    }
    else if (fromDims === 3) {
      for (let i = 0; i < n; ++i) {
        const [a, b, c] = from[s + i];
        to[o    ] = a;
        to[o + 1] = b;
        to[o + 2] = c;
        to[o + 3] = w;
        o += 4;
      }
    }
    else {
      for (let i = 0; i < n; ++i) {
        const [a, b, c, d] = from[s + i];
        to[o    ] = a;
        to[o + 1] = b;
        to[o + 2] = c;
        to[o + 3] = d;
        o += 4;
      }
    }
  }
  else {
    throw new Error(`Unsupported output dimension: ${toDims}`);
  }
};

export const makeCopyEmitter2 = (
  from: number[] | TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
) => (
  to: TypedArray,
  toIndex: number = 0,
  length?: number,
  offset?: number,
) => copyNumberArray2(from, to, dims, fromIndex, toIndex, length);

export const makeFillEmitter2 = (
  from: NumberArray | number,
  dims: number = 1, 
  fromIndex: number = 0,
) => (
  to: NumberArray,
  toIndex: number = 0,
  count: number = 0,
  offset: number = 0,
) => fillNumberArray2(from, to, dims, fromIndex, toIndex, length);

export const makeUnweldEmitter2 = (
  from: number[] | TypedArray,
  indices: number[] | TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
) => (
  to: TypedArray,
  toIndex: number = 0,
  length?: number,
) => unweldNumberArray2(from, to, indices, dims, fromIndex, toIndex, length);

export const generateChunkSegments2 = (
  to: NumberArray,
  lookup: NumberArray | null | undefined,
  unweld: NumberArray | null | undefined,
  chunks: TypedArray | number[],
  loops: TypedArray | boolean[] | boolean = false,
  starts: TypedArray | boolean[] | boolean = false,
  ends: TypedArray | boolean[] | boolean = false,
) => {
  let pos = 0;
  let n = chunks.length;
  let o = 0;

  const hasLoop = !!loops;
  const hasStart = !!starts;
  const hasEnd = !!ends;

  for (let i = 0; i < n; ++i) {
    const c = chunks[i];
    const l = hasLoop && (loops === true || loops[i]);
    const s = hasStart && (starts === true || starts[i]);
    const e = hasEnd && (ends === true || ends[i]);

    const b = pos;

    if (l) to[pos++] = 0;
    if (c) {
      if (c === 1) to[pos++] = 0;
      else {
        if (l && !s && !e) {
          for (let i = 0; i < c; ++i) to[pos++] = 3;
          if (l) to[pos++] = 0;
        }
        else if (l) {
          to[pos++] = 1;
          for (let i = 1; i < c; ++i) to[pos++] = 3;
          to[pos++] = 2;
        }
        else {
          to[pos++] = 1;
          for (let i = 2; i < c; ++i) to[pos++] = 3;
          to[pos++] = 2;
        }
      }
    }
    if (l) to[pos++] = 0;

    if (lookup) for (let j = b; j < pos; ++j) lookup[j] = i;
    if (unweld) {
      const n = pos - b;
      const z = l ? c - 1 : 0;
      for (let j = 0; j < n; ++j) {
        unweld[j + b] = o + (j + z + c) % c;
      }
    }

    o += c;
  }

  while (pos < to.length) to[pos++] = 0;
}

export const generateChunkAnchors2 = (
  anchors: NumberArray,
  trims: NumberArray,
  chunks: number[],
  loops: boolean[] | boolean = false,
  starts: boolean[] | boolean = false,
  ends: boolean[] | boolean = false,
) => {

  const n = chunks.length;
  for (let i = 0; i < trims.length; ++i) trims[i] = 0;

  const hasLoop = !!loops;
  const hasStart = !!starts;
  const hasEnd = !!ends;

  let o = 0;
  let pos = 0;
  if (hasStart || hasEnd) for (let i = 0; i < n; ++i) {
    const c = chunks[i];
    const l = hasLoop && (loops === true || loops[i]);
    const s = hasStart && (starts === true || starts[i]);
    const e = hasEnd && (ends === true || ends[i]);

    const both = s && e ? 1 : 0;
    const bits = +s + (+e << 1);

    const start = pos + (l ? 1 : 0);
    const end = pos + c - 1 + (l ? 2 : 0);
    pos += c + (l ? 3 : 0);

    for (let j = start; j <= end; ++j) {
      trims[j * 4] = start;
      trims[j * 4 + 1] = end;
      trims[j * 4 + 2] = bits;
      trims[j * 4 + 3] = 0;
    }

    if (s) {
      anchors[o++] = start;
      anchors[o++] = start + 1;
      anchors[o++] = end;
      anchors[o++] = both;
    }
    if (e) {
      anchors[o++] = end;
      anchors[o++] = end - 1;
      anchors[o++] = start;
      anchors[o++] = both;
    }
  }

  return o / 4;
}

export const generateChunkFaces2 = (
  to: NumberArray,
  lookup: NumberArray | null | undefined,
  chunks: number[],
) => {
  let pos = 0;
  let n = chunks.length;

  for (let i = 0; i < n; ++i) {
    const c = chunks[i];

    const b = pos;
    if (c) {
      for (let i = 0; i < c - 2; ++i) to[pos++] = i + 1;
      if (c > 1) to[pos++] = 0;
      to[pos++] = 0;
    }
    
    if (lookup) for (let j = b; j < pos; ++j) lookup[j] = i;
  }

  while (pos < to.length) to[pos++] = 0;
}

