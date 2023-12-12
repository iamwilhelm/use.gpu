import type { TypedArray, VectorLike, UniformType, UniformAttribute, Emitter, Emit } from './types';

import { isTypedArray } from './buffer';
import { seq } from './tuple';

type NumberArray = VectorLike;

/*
export const makeDataEmitter2 = (
  to: NumberArray,
  dims: number,
): {
  emit: Emit,
  emitted: () => number,
  reset: () => void,
} => {
  let i = 0;
  const emitted = () => i / Math.ceil(dims);
  const reset = () => i = 0;

  if (dims === 1)   return {reset, emitted, emit: (a: number) => { to[i++] = a; }};
  if (dims === 2)   return {reset, emitted, emit: (a: number, b: number) => { to[i++] = a; to[i++] = b; }};
  if (dims === 3)   return {reset, emitted, emit: (a: number, b: number, c: number) => { to[i++] = a; to[i++] = b; to[i++] = c; }};
  if (dims === 3.5) return {reset, emitted, emit: (a: number, b: number, c: number) => { to[i++] = a; to[i++] = b; to[i++] = c; i++; }}; // !
  if (dims === 4)   return {reset, emitted, emit: (a: number, b: number, c: number, d: number) => { to[i++] = a; to[i++] = b; to[i++] = c; to[i++] = d; }};
  return {
    reset,
    emitted,
    emit: (...args: number[]) => {
      const n = args.length;
      for (let j = 0; j < n; ++j) to[i++] = args[j];
    },
  };
}

export const emitIntoNumberArray2 = <T>(expr: Emitter, to: NumberArray, dims: number, props?: T) => {
  const {emit, emitted} = makeDataEmitter(to, dims);
  const n = to.length / Math.ceil(dims);
  for (let i = 0; i < n; i++) expr(emit, i, props);
  return emitted();
};

export const emitIntoMultiNumberArray2 = <T>(expr: Emitter, to: NumberArray, dims: number, size: number[], props?: T) => {
  const n = size.length;

  const index = size.map(_ => 0);
  const increment = () => {
    for (let i = 0; i < n; ++i) {
      let c = index[i];
      if (c === size[i] - 1) index[i] = 0;
      else {
        index[i] = c + 1;
        break;
      }
    }
  };

  let nest: Emitter;
  if (n === 1) {
    nest = (emit: Emit) => {
      expr(emit, index[0], props);
      increment();
    };
  }
  else if (n === 2) {
    nest = (emit: Emit) => {
      expr(emit, index[0], index[1], props);
      increment();
    };
  }
  else if (n === 3) {
    nest = (emit: Emit) => {
      expr(emit, index[0], index[1], index[2], props);
      increment();
    };
  }
  else if (n === 4) {
    nest = (emit: Emit) => {
      expr(emit, index[0], index[1], index[2], index[3], props);
      increment();
    };
  }
  else {
    nest = (emit: Emit) => {
      expr(emit, ...index, props);
      increment();
    };
  }
  
  return emitIntoNumberArray(nest, to, dims);
};
*/

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
  
export const scatterNumberArray2 = (
  from: number[] | TypedArray,
  to: TypedArray,
  scatter: TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
  toIndex: number = 0,
  length?: number,
) => {
  const n = length != null ? length : scatter.length;

  let s = fromIndex * dims;
  let o = toIndex * dims;

  if (dims === 1) {
    for (let i = 0; i < n; ++i) {
      to[o++] = from[scatter[s + i]];
    }
  }
  else if (dims === 2) {
    for (let i = 0; i < n; ++i) {
      let b = scatter[s + i] * dims;
      to[o    ] = from[b];
      to[o + 1] = from[b + 1];
      o += 2;
    }
  }
  else if (dims === 3) {
    for (let i = 0; i < n; ++i) {
      let b = scatter[s + i] * dims;
      to[o    ] = from[b];
      to[o + 1] = from[b + 1];
      to[o + 2] = from[b + 2];
      o += 3;
    }
  }
  else if (dims === 4) {
    for (let i = 0; i < n; ++i) {
      let b = scatter[s + i] * dims;
      to[o    ] = from[b];
      to[o + 1] = from[b + 1];
      to[o + 2] = from[b + 2];
      to[o + 3] = from[b + 3];
      o += 4;
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
    // TBD
    console.warn('Dims > 4 not supported');
    for (let j = 0; j < count; ++j) {
      for (let k = 0; k < dims; ++k) {
        to[pos + k] = array[read + k] + offset;
      }
      pos += k;
    }
  }
}

export const unweldIndexedArray2 = (
  from: NumberArray,
  indices: NumberArray,
  dims: number = 1,
) => {
  const n = indices.length;
  const flat = new Float32Array(n * Math.ceil(dims));

  let o = 0;
  if (dims === 1) {
    for (let i = 0; i < n; ++i) {
      const j = indices[i];
      flat[o++] = from[j];
    }
  }
  else if (dims === 2) {
    for (let i = 0; i < n; ++i) {
      const j = indices[i] * 2;
      flat[o++] = from[j];
      flat[o++] = from[j + 1];
    }
  }
  else if (dims === 3) {
    for (let i = 0; i < n; ++i) {
      const j = indices[i] * 3;
      flat[o++] = from[j];
      flat[o++] = from[j + 1];
      flat[o++] = from[j + 2];
    }
  }
  else if (dims === 4) {
    for (let i = 0; i < n; ++i) {
      const j = indices[i] * 4;
      flat[o++] = from[j];
      flat[o++] = from[j + 1];
      flat[o++] = from[j + 2];
      flat[o++] = from[j + 3];
    }
  }
  else {
    for (let i = 0; i < n; ++i) {
      const j = indices[i] * dims;
      for (let k = 0; k < dims; ++k) {
        flat[o++] = from[j + k];
      }
      j += dims;
    }
  }

  return flat;
};

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

export const generateChunkSegments2 = (
  to: NumberArray,
  lookup: NumberArray | null | undefined,
  scatter: NumberArray | null | undefined,
  chunks: TypedArray | number[],
  loops: TypedArray | boolean[] | boolean = false,
  starts: TypedArray | boolean[] | boolean = false,
  ends: TypedArray | boolean[] | boolean = false,
) => {
  let pos = 0;
  let n = chunks.length;
  let o = 0;

  for (let i = 0; i < n; ++i) {
    const c = chunks[i];
    const l = (loops as any)[i] ?? !!loops;
    const s = starts === true || (starts as any)[i];
    const e = ends === true || (ends as any)[i];

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
    if (scatter) {
      const n = pos - b;
      const z = l ? c - 1 : 0;
      for (let j = 0; j < n; ++j) {
        scatter[j + b] = o + (j + z + c) % c;
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
  loops: boolean[] = NO_LOOPS,
  starts: boolean[] | boolean = false,
  ends: boolean[] | boolean = false,
) => {

  const n = chunks.length;
  for (let i = 0; i < trims.length; ++i) trims[i] = 0;

  const hasStart = !!starts;
  const hasEnd = !!ends;

  let o = 0;
  let pos = 0;
  if (hasStart || hasEnd) for (let i = 0; i < n; ++i) {
    const c = chunks[i];
    const l = loops[i];

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
  loops: boolean[] = NO_LOOPS,
) => {
  let pos = 0;
  let n = chunks.length;

  for (let i = 0; i < n; ++i) {
    const c = chunks[i];
    const l = loops[i];

    const b = pos;
    if (l) to[pos++] = 0;
    if (c) {
      if (c < 3) {
        for (let i = 0; i < c; ++i) to[pos++] = 0;
      }
      else {
        for (let i = 0; i < c - 2; ++i) to[pos++] = i + 1;
        to[pos++] = 0;
        to[pos++] = 0;
      }
    }
    if (l) {
      to[pos++] = 0;
      to[pos++] = 0;
    }
    
    if (lookup) for (let j = b; j < pos; ++j) lookup[j] = i;
  }

  while (pos < to.length) to[pos++] = 0;
}

