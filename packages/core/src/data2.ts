import type { Lazy, NumberEmitter, TypedArray, VectorLike, UniformType, UniformAttribute, Emitter, Emit } from './types';
import { UNIFORM_ARRAY_TYPES, UNIFORM_ARRAY_DIMS, UNIFORM_ATTRIBUTE_SIZES } from './constants';

import { isTypedArray } from './buffer';
import { seq } from './tuple';

type NumberArray = VectorLike;

export const alignSizeTo2 = (n: number, s: number) => {
  let f = n % s;
  return f === 0 ? n : n + (s - f);
};

export const getUniformDims2 = (type: UniformType) => UNIFORM_ARRAY_DIMS[type];

export const makeRawArray2 = (byteSize: number, count: number) => new ArrayBuffer(byteSize);

export const makeDataArray2 = (type: UniformType, length: number) => {
  const ctor = UNIFORM_ARRAY_TYPES[type];
  const dims = UNIFORM_ARRAY_DIMS[type];

  const n = alignSizeTo2(length * Math.ceil(dims), 4);

  const array = new ctor(n);
  return {array, dims};
};
export const castRawArray2 = (buffer: ArrayBuffer | TypedArray, type: UniformType) => {
  const ctor = UNIFORM_ARRAY_TYPES[type];
  const dims = UNIFORM_ARRAY_DIMS[type];

  const array = new ctor(buffer.buffer ?? buffer);
  return {array, dims};
};

export const copyNumberArray2 = (
  from: number[] | TypedArray,
  to: TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
  toIndex: number = 0,
  length: number = 0,
  stride: number = 1,
) => {
  const n = length != null ? length * dims : from.length;

  let s = fromIndex * dims;
  let o = toIndex * dims;

  for (let i = 0; i < n; ++i) {
    to[o] = from[s + i];
    o += stride;
  }
};

export const offsetNumberArray2 = (
  from: number[] | TypedArray,
  to: TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
  toIndex: number = 0,
  length?: number,
  offset: number = 0,
  stride: number = 1,
) => {
  const n = length != null ? length * dims : from.length;

  let s = fromIndex * dims;
  let o = toIndex * dims;

  for (let i = 0; i < n; ++i) {
    to[o] = from[s + i] + offset;
    o += stride;
  }
};

export const expandNumberArray2 = (
  from: number[] | TypedArray,
  to: TypedArray,
  slices: TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
  toIndex: number = 0,
  stride: number = 1,
) => {
  const n = slices.length;
  let f = fromIndex;
  let t = toIndex;
  for (let i = 0; i < n; ++i) {
    const l = slices[i];
    fillNumberArray2(from, to, dims, f, t, l, stride);
    f++;
    t += l * stride;
  }
}
    
export const unweldNumberArray2 = (
  from: number[] | TypedArray,
  to: TypedArray,
  indices: TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
  toIndex: number = 0,
  length?: number,
  stride: number = 1,
) => {
  const n = length != null ? length : indices.length;

  let s = fromIndex * dims;
  let o = toIndex * dims;

  if (dims === 1) {
    for (let i = 0; i < n; ++i) {
      to[o] = from[indices[s + i]];
      o += stride;
    }
  }
  else if (dims === 2) {
    for (let i = 0; i < n; ++i) {
      let b = indices[s + i] * 2;
      to[o         ] = from[b];
      to[o + stride] = from[b + 1];
      o += stride * 2;
    }
  }
  else if (dims === 3) {
    for (let i = 0; i < n; ++i) {
      let b = indices[s + i] * 3;
      to[o             ] = from[b];
      to[o + stride    ] = from[b + 1];
      to[o + stride * 2] = from[b + 2];
      o += stride * 3;
    }
  }
  else if (dims === 4) {
    for (let i = 0; i < n; ++i) {
      let b = indices[s + i] * 4;
      to[o    ] = from[b];
      to[o + stride    ] = from[b + 1];
      to[o + stride * 2] = from[b + 2];
      to[o + stride * 3] = from[b + 3];
      o += stride * 4;
    }
  }
  else {
    for (let i = 0; i < n; ++i) {
      let b = indices[s + i] * n;
      for (let k = 0; k < dims; ++k) {
        to[o + stride * k] = from[b + k];
      }
      o += stride * dims;
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
  stride: number = 1,
) => {
  let pos = toIndex * dims;
  const read = fromIndex * dims;

  const array = from as NumberArray;

  if (typeof from === 'number') {
    if (dims === 1) {
      for (let j = 0; j < count; ++j) {
        to[pos] = from;
        pos += stride;
      }
    }
    else {
      for (let j = 0; j < count; ++j) {
        to[pos] = from;
        pos += stride;
        for (let k = 0; k < skip; ++k) {
          to[pos] = 0;
          pos += stride;
        }
      }
    }
  }
  else if (dims === 1) {
    for (let j = 0; j < count; ++j) {
      to[pos] = array[read];
      pos += stride;
    }
  }
  else if (dims === 2) {
    for (let j = 0; j < count; ++j) {
      to[pos         ] = array[read];
      to[pos + stride] = array[read + 1];
      pos += stride * 2;
    }
  }
  else if (dims === 3) {
    for (let j = 0; j < count; ++j) {
      to[pos             ] = array[read];
      to[pos + stride    ] = array[read + 1];
      to[pos + stride * 2] = array[read + 2];
      pos += stride * 3;
    }
  }
  else if (dims === 4) {
    for (let j = 0; j < count; ++j) {
      to[pos             ] = array[read];
      to[pos + stride    ] = array[read + 1];
      to[pos + stride * 2] = array[read + 2];
      to[pos + stride * 3] = array[read + 3];
      pos += stride * 4;
    }
  }
  else {
    for (let j = 0; j < count; ++j) {
      for (let k = 0; k < dims; ++k) {
        to[pos + stride * k] = array[read + k];
      }
      pos += stride * dims;
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
  stride?: number,
) => copyNumberArray2(from, to, dims, fromIndex, toIndex, length, stride);

export const makeRefEmitter2 = (
  fromRef: Lazy<number | number[] | TypedArray>,
  dims: number = 1,
  fromIndex: number = 0,
) => (
  to: TypedArray,
  toIndex: number = 0,
  length?: number,
  stride?: number,
) => {
  const from = resolve(fromRef);
  if (typeof from === 'number') fillNumberArray2(from, to, dims, fromIndex, toIndex, length, stride);
  else copyNumberArray2(from, to, dims, fromIndex, toIndex, length, stride);
}

export const makePartialRefEmitter2 = (
  dims: number = 1,
  fromIndex: number = 0,
) => (
  fromRef: Lazy<number | number[] | TypedArray>,
  to: TypedArray,
  toIndex: number = 0,
  length?: number,
  stride?: number,
) => {
  const from = resolve(fromRef);
  if (typeof from === 'number') fillNumberArray2(from, to, dims, fromIndex, toIndex, length, stride);
  else copyNumberArray2(from, to, dims, fromIndex, toIndex, length, stride);
}

export const makeExpandEmitter2 = (
  from: NumberArray | number,
  slices: number[] | TypedArray,
  dims: number = 1, 
  fromIndex: number = 0,
) => (
  to: NumberArray,
  toIndex: number = 0,
  count: number = 0,
  stride?: number,
) => expandNumberArray2(from, to, slices, dims, fromIndex, toIndex, length, stride);

export const makeFillEmitter2 = (
  from: NumberArray | number,
  dims: number = 1, 
  fromIndex: number = 0,
) => (
  to: NumberArray,
  toIndex: number = 0,
  count: number = 0,
  stride?: number,
) => fillNumberArray2(from, to, dims, fromIndex, toIndex, length, stride);

export const makeUnweldEmitter2 = (
  from: number[] | TypedArray,
  indices: number[] | TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
) => (
  to: TypedArray,
  toIndex: number = 0,
  length?: number,
  stride?: number,
) => unweldNumberArray2(from, to, indices, dims, fromIndex, toIndex, length, stride);

export const generateChunkSegments2 = (
  to: NumberArray,
  slices: NumberArray | null | undefined,
  unwelds: NumberArray | null | undefined,
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

    if (slices) slices[i] = pos - b;
    if (unwelds) {
      const n = pos - b;
      const z = l ? c - 1 : 0;
      for (let j = 0; j < n; ++j) {
        unwelds[j + b] = o + (j + z + c) % c;
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
  }

  while (pos < to.length) to[pos++] = 0;
}
