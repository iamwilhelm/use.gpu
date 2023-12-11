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
  fromIndex: number = 0,
  toIndex: number = 0,
  length: number = from.length,
) => {
  const n = length;

  let s = fromIndex;
  let o = toIndex * toDims;

  for (let i = 0; i < n; ++i) {
    to[o++] = from[s + i];
  }
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

export const copyNumberArrayRepeated2 = (
  from: NumberArray | number, to: NumberArray,
  fromIndex: number, toIndex: number,
  dims: number, count: number, offset: number = 0,
) => {
  let pos = toIndex;
  const read = fromIndex;

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
      to[pos++] = array[read] + offset;
      to[pos++] = array[read + 1] + offset;
    }
  }
  else if (dims === 3) {
    for (let j = 0; j < count; ++j) {
      to[pos++] = array[read] + offset;
      to[pos++] = array[read + 1] + offset;
      to[pos++] = array[read + 2] + offset;
    }
  }
  else if (dims === 4) {
    for (let j = 0; j < count; ++j) {
      to[pos++] = array[read] + offset;
      to[pos++] = array[read + 1] + offset;
      to[pos++] = array[read + 2] + offset;
      to[pos++] = array[read + 3] + offset;
    }
  }
  else {
    // TBD
    console.warn('Dims > 4 not supported');
    for (let j = 0; j < count; ++j) {
      for (let k = 0; k < dims; ++k) {
        to[pos++] = array[read + k] + offset;
      }
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

