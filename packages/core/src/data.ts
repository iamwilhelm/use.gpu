import type { Lazy, Emitter, VectorEmitter, Emit, TypedArray, VectorLike, UniformType, UniformAttribute } from './types';

import { getUniformArrayType, getUniformDims, getUniformAlign, toCPUDims, toGPUDims } from './uniform';
import { isTypedArray } from './buffer';

type NumberMapper = (x: number) => number;

const IDENTITY = (x: number) => x;

export const alignSizeTo = (n: number, s: number) => {
  let f = n % s;
  return f === 0 ? n : n + (s - f);
};

export const makeRawArray = (byteSize: number) => new ArrayBuffer(byteSize);

export const makeDataArray = (type: UniformType, length: number) => {
  const ctor  = getUniformArrayType(type);
  const dims  = getUniformDims(type);
  const align = getUniformAlign(type);

  const n = alignSizeTo(length * toGPUDims(dims), align || 4);

  const array = new ctor(n);
  return {array, dims};
};

export const castRawArray = (buffer: ArrayBuffer | TypedArray, type: UniformType) => {
  const ctor = getUniformArrayType(type);
  const dims = getUniformDims(type);

  const array = new ctor(buffer.buffer ?? buffer);
  return {array, dims};
};


// Copy packed scalar/vec2/vec3/vec4 with vec3-to-vec4 extension for WGSL.
// Extends to matrix types via repetition.
export const makeCopyPipe = ({
  index = IDENTITY,
  map = IDENTITY,
}: {
  index?: NumberMapper,
  map?: NumberMapper,
} = {}) => (
  from: VectorLike | number,
  to: TypedArray,
  fromDims: number = 1,
  toDims: number = fromDims,
  fromIndex: number = 0,
  toIndex: number = 0,
  count: number = 0,
  stride?: number,
) => {

  const n = count ?? ((from.length ?? 1) / fromDims);
  const step = stride ?? toDims;

  let f = fromIndex;
  let t = toIndex;

  if (step !== toDims || fromDims !== toDims || index != IDENTITY)  {

    // repeat n writes of a vec4
    const dims4 = Math.min(toDims, 4);
    const repeat = Math.ceil(toDims / 4);

    if (dims4 < 4 && fromDims !== toDims) throw new Error(`Unsupported copy pipe dimensions: ${fromDims} -> ${toDims}`);

    if (typeof from === 'number') {
      for (let i = 0; i < n; ++i) {
        to[t] = from;
        for (let j = 1; j < toDims; ++j) to[t + j] = 0;
        t += step;
      }
    }
    else if (dims4 === 1) {
      for (let i = 0; i < n; ++i) {
        for (let j = 0; j < repeat; ++j) {
          let b = f + index(i);
          to[t + j] = map(from[b]);
        }
        t += step;
      }
    }
    else if (dims4 === 2) {
      for (let i = 0; i < n; ++i) {
        let b = f + index(i) * 2;
        to[t    ] = map(from[b]);
        to[t + 1] = map(from[b + 1]);
        t += step;
      }
    }
    else if (dims4 === 3) {
      for (let i = 0; i < n; ++i) {
        let b = f + index(i) * 3;
        to[t    ] = map(from[b]);
        to[t + 1] = map(from[b + 1]);
        to[t + 2] = map(from[b + 2]);
        t += step;
      }
    }
    else if (dims4 === 4) {
      if (fromDims !== toDims) {
        // vec3to4 extension
        if (repeat > 1) {
          for (let i = 0; i < n; ++i) {
            let b = f + index(i) * 3 * repeat; // !
            for (let j = 0; j < repeat; ++j) {
              let bb = b + j * 3;
              let tt = t + j * 4;
              to[tt    ] = map(from[bb]);
              to[tt + 1] = map(from[bb + 1]);
              to[tt + 2] = map(from[bb + 2]);
              to[tt + 3] = 0; // unused
            }
            t += step;
          }
        }
        else {
          for (let i = 0; i < n; ++i) {
            let b = f + index(i) * 3; // !
            to[t    ] = map(from[b]);
            to[t + 1] = map(from[b + 1]);
            to[t + 2] = map(from[b + 2]);
            to[t + 3] = 0; // unused
            t += step;
          }
        }
      }
      else {
        if (repeat > 1) {
          for (let i = 0; i < n; ++i) {
            let b = f + index(i) * 4 * repeat;
            for (let j = 0; j < repeat; ++j) {
              let j4 = j * 4;
              let tt = t + j4;
              let bb = b + j4;
              to[tt    ] = map(from[bb]);
              to[tt + 1] = map(from[bb + 1]);
              to[tt + 2] = map(from[bb + 2]);
              to[tt + 3] = map(from[bb + 3]);
            }
            t += step;
          }
        }
        else {
          for (let i = 0; i < n; ++i) {
            let b = f + index(i) * 4;
            to[t    ] = map(from[b]);
            to[t + 1] = map(from[b + 1]);
            to[t + 2] = map(from[b + 2]);
            to[t + 3] = map(from[b + 3]);
            t += step;
          }
        }
      }
    }
  }
  else {
    const nd = n * toDims;

    if (typeof from === 'number') {
      for (let i = 0; i < n; ++i) {
        to[t] = map(from);
        for (let j = 1; j < toDims; ++j) to[t + j] = 0;
        t += toDims;
      }
    }
    else {
      for (let i = 0; i < nd; ++i) {
        to[t] = map(from[f + i]);
        t++;
      }
    }
  }

  return n * step;
};

export const copyNumberArray = makeCopyPipe();

export const unweldNumberArray = (() => {
  let arg;
  const index = (i: number) => arg[i];
  const copyWithIndex = makeCopyPipe({index});
  return (
    from: VectorLike | number,
    to: TypedArray,
    indices: TypedArray,
    fromDims: number = 1,
    toDims: number = fromDims,
    fromIndex: number = 0,
    toIndex: number = 0,
    count?: number,
    stride?: number,
  ) => {
    arg = indices;
    return copyWithIndex(from, to, fromDims, toDims, fromIndex, toIndex, count, stride);
  }  
})();

export const offsetNumberArray = (() => {
  let arg;
  const map = (x: number) => x + arg;
  const copyWithOffset = makeCopyPipe({map});
  return (
    from: VectorLike | number,
    to: TypedArray,
    offset: number = 0,
    fromDims: number = 1,
    toDims: number = fromDims,
    fromIndex: number = 0,
    toIndex: number = 0,
    count?: number,
    stride?: number,
  ) => {
    arg = offset;
    return copyWithOffset(from, to, fromDims, toDims, fromIndex, toIndex, count, stride);
  };
})();

export const fillNumberArray = (() => {
  const index = (i: number) => 0;
  const copyWithZeroIndex = makeCopyPipe({index});
  return (
    from: VectorLike | number,
    to: VectorLike,
    fromDims: number = 1,
    toDims: number = fromDims,
    fromIndex: number = 0,
    toIndex: number = 0,
    count: number,
    stride?: number,
  ) => {
    if (typeof from === 'number') {
      const step = stride || toDims;

      let f = fromIndex;
      let t = toIndex;

      if (toDims === 1) {
        for (let j = 0; j < count; ++j) {
          to[t] = from;
          t += step;
        }
      }
      else {
        const skip = toDims - 1;

        for (let j = 0; j < count; ++j) {
          to[t] = from;
          for (let k = 1; k <= skip; ++k) to[t + k] = 0;
          t += step;
        }
      }
      
      return count * step;
    }
    else {
      return copyWithZeroIndex(from, to, fromDims, toDims, fromIndex, toIndex, count, stride); 
    }
  }
})();

export const spreadNumberArray = (
  from: VectorLike | number | null,
  to: TypedArray,
  slices: TypedArray,
  fromDims: number = 1,
  toDims: number = fromDims,
  fromIndex: number = 0,
  toIndex: number = 0,
  stride?: number,
) => {
  const step = stride || toDims;

  const n = slices.length;
  let f = fromIndex;
  let t = toIndex;
  for (let i = 0; i < n; ++i) {
    const l = slices[i];
    fillNumberArray(from ?? i, to, fromDims, toDims, f, t, l, stride);
    f++;
    t += l * step;
  }
  return t - toIndex;
}

// Copy from any-nested 1d/2d/3d/4d number[] with array depth known ahead of time
export const copyRecursiveNumberArray = (
  from: number | any[],
  to: TypedArray,
  fromDims: number = 1,
  toDims: number = fromDims,
  fromDepth: number = 0,
  toIndex: number = 0,
  w: number = 0,
) => {
  if (fromDepth === 0) {
    if (typeof from === 'number') {
      // Scalar
      return fillNumberArray(from, to, fromDims, toDims, 0, toIndex, 1);
    }
    else if (typeof from[0] === 'number') {
      // Vector
      return copyNumberArray(from, to, fromDims, toDims, 0, toIndex, from.length / fromDims);
    }
  }
  else if (fromDepth === 1) {
    if (typeof from[0] === 'number') {
      // Scalar array or flattened vectors
      return copyNumberArray(from, to, fromDims, toDims, 0, toIndex, from.length / fromDims);
    }
    if (typeof from[0][0] === 'number') {
      // Vector array or flattened multivectors
      return copyNestedNumberArray(from, to, fromDims, toDims, 0, toIndex, from.length, w);
    }
  }
  else if (fromDepth >= 2) {
    const n = from.length;
    let b = 0;
    for (let i = 0; i < n; ++i) {
      const l = copyRecursiveNumberArray(from, to, dimsIn, dimsOut, fromDepth - 1, b, w);
      b += l;
    }
    return b;
  }
};

// Copy from 1d/2d/3d/4d number[][] into 1d/2d/3d/4d typed array, with specified w coordinate
export const copyNestedNumberArray = (
  from: number[][] | TypedArray[],
  to: TypedArray,
  fromDims: number,
  toDims: number,
  fromIndex: number = 0,
  toIndex: number = 0,
  count?: number,
  w: number = 0,
): number => {
  const n = count ?? from.length;

  let s = fromIndex;
  let o = toIndex;

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
    throw new Error(`Unsupported nested number array dimensions: ${fromDims} -> ${toDims}`);
  }

  return n * toDims;
};

export const makeSpreadEmitter = (
  from: VectorLike | number,
  slices: VectorLike,
  fromDims: number = 1,
  toDims: number = fromDims,
  fromIndex: number = 0,
) => (
  to: VectorLike,
  toIndex: number = 0,
  count: number = 0,
  stride?: number,
) => spreadNumberArray(from, to, slices, fromDims, toDims, fromIndex, toIndex, stride);

export const makeUnweldEmitter = (
  from: VectorLike | number,
  indices: VectorLike,
  fromDims: number = 1,
  toDims: number = fromDims,
  fromIndex: number = 0,
) => (
  to: TypedArray,
  toIndex: number = 0,
  count?: number,
  stride?: number,
) => unweldNumberArray(from, to, indices, fromDims, toDims, fromIndex, toIndex, count, stride);


export const makeExprEmitter = (to: VectorLike, dims: number): {
  emit: Emit,
  emitted: () => number,
  reset: () => void,
} => {
  let i = 0;
  const emitted = () => i / toGPUDims(dims);
  const reset = () => i = 0;

  if (dims === 1)   return {reset, emitted, emit: (a: number) => { to[i++] = a; }};
  if (dims === 2)   return {reset, emitted, emit: (a: number, b: number) => { to[i++] = a; to[i++] = b; }};
  if (dims === 3)   return {reset, emitted, emit: (a: number, b: number, c: number) => { to[i++] = a; to[i++] = b; to[i++] = c; }};
  if (dims === 3.5) return {reset, emitted, emit: (a: number, b: number, c: number) => { to[i++] = a; to[i++] = b; to[i++] = c; i++; }}; // !
  if (dims === 4)   return {reset, emitted, emit: (a: number, b: number, c: number, d: number) => { to[i++] = a; to[i++] = b; to[i++] = c; to[i++] = d; }};
  if (dims !== Math.round(dims)) throw new Error(`Unsupported expr emitter dims ${dims}`);
  return {
    reset,
    emitted,
    emit: (...args: number[]) => {
      const n = args.length;
      for (let j = 0; j < n; ++j) to[i++] = args[j];
    },
  };
}

export const emitIntoNumberArray = <T>(expr: Emitter, to: VectorLike, dims: number, props?: T) => {
  const {emit, emitted} = makeExprEmitter(to, dims);
  const n = to.length / Math.ceil(dims);
  for (let i = 0; i < n; i++) expr(emit, i, props);
  return emitted();
}

export const emitIntoMultiNumberArray = <T>(expr: Emitter, to: VectorLike, dims: number, size: number[], props?: T) => {
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
}

