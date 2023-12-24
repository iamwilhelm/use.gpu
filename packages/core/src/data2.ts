import type { Lazy, VectorEmitter, TypedArray, VectorLike, UniformType, UniformAttribute, Emitter, Emit } from './types';
import { UNIFORM_ARRAY_TYPES, UNIFORM_ARRAY_DIMS, UNIFORM_ATTRIBUTE_ALIGNS } from './constants';

import { isTypedArray } from './buffer';
import { seq } from './tuple';
import { vec3 } from 'gl-matrix';
import earcut from 'earcut';

type NumberArray = VectorLike;
type NumberMapper = (x: number) => number;

export const alignSizeTo2 = (n: number, s: number) => {
  let f = n % s;
  return f === 0 ? n : n + (s - f);
};

export const getUniformDims2 = (type: UniformType) => UNIFORM_ARRAY_DIMS[type];

export const makeRawArray2 = (byteSize: number) => new ArrayBuffer(byteSize);

export const makeDataArray2 = (type: UniformType, length: number) => {
  const ctor  = UNIFORM_ARRAY_TYPES[type];
  const dims  = UNIFORM_ARRAY_DIMS[type];
  const align = UNIFORM_ATTRIBUTE_ALIGNS[type];

  const n = alignSizeTo2(length * Math.ceil(dims), align || 4);

  const array = new ctor(n);
  return {array, dims};
};

export const castRawArray2 = (buffer: ArrayBuffer | TypedArray, type: UniformType) => {
  const ctor = UNIFORM_ARRAY_TYPES[type];
  const dims = UNIFORM_ARRAY_DIMS[type];

  const array = new ctor(buffer.buffer ?? buffer);
  return {array, dims};
};

// Copy packed scalar/vec2/vec3/vec4 with vec3to4 extension for WGSL
export const makeCopyPipe = ({
  index = (x => x),
  map = (x => x),
}: {
  index?: NumberMapper,
  map?: NumberMapper,
} = {}) => (
  from: number[] | TypedArray,
  to: TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
  toIndex: number = 0,
  count: number = 0,
  stride?: number,
) => {

  // vec3/mat3 to vec4/mat4 extension
  // 3.5 = 3to4, 7.5 = 6to8, 11.5 = 9to12, 15.5 = 12to16
  const dimsIn = Math.round(dims) !== dims ? Math.ceil(dims) * 3 / 4 : dims;
  const dimsOut = Math.ceil(dims);

  const n = count ?? from.length / dimsIn;
  const step = stride || dimsOut;

  let f = fromIndex;
  let t = toIndex;

  if (step !== dimsOut || dimsIn !== dimsOut || index || map)  {

    // repeat n writes of a vec4
    const dims4 = Math.min(Math.ceil(dims), 4);
    const repeat = Math.ceil(dims / 4);

    if (dims4 === 1) {
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
      if (dimsIn !== dims) {
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
    const n = count != null ? count * dims : from.length;
    for (let i = 0; i < n; ++i) {
      to[o] = map(from[s + i]);
      o++;
    }
  }
};

export const copyNumberArray2 = makeCopyPipe();

export const unweldNumberArray2 = (() => {
  let arg;
  const index = (i: number) => arg[i];
  const copyWithIndex = makeCopyPipe({index});
  return (
    from: number[] | TypedArray,
    to: TypedArray,
    indices: TypedArray,
    dims: number = 1,
    fromIndex: number = 0,
    toIndex: number = 0,
    count?: number,
    stride?: number,
  ) => {
    arg = indices;
    return copyWithIndex(from, to, dims, fromIndex, toIndex, count, stride);
  }  
})();

export const offsetNumberArray2 = (() => {
  let arg;
  const map = (x: number) => x + arg;
  const copyWithOffset = makeCopyPipe({map});
  return (
    from: number[] | TypedArray,
    to: TypedArray,
    offset: number = 0,
    dims: number = 1,
    fromIndex: number = 0,
    toIndex: number = 0,
    count?: number,
    stride?: number,
  ) => {
    arg = offset;
    return copyWithOffset(from, to, dims, fromIndex, toIndex, count, stride);
  };
})();

export const fillNumberArray2 = (() => {
  const index = (i: number) => 0;
  const copyWithNoIndex = makeCopyPipe({index});
  return (
    from: NumberArray | number,
    to: NumberArray,
    dims: number = 1, 
    fromIndex: number = 0,
    toIndex: number = 0,
    count: number,
    stride?: number,
  ) => {
    if (typeof from === 'number') {
      const step = stride || dims;

      let f = fromIndex;
      let t = toIndex;

      dims = Math.ceil(dims);
      if (dims === 1) {
        for (let j = 0; j < count; ++j) {
          to[t] = from;
          t += step;
        }
      }
      else {
        const skip = dims - 1;

        for (let j = 0; j < count; ++j) {
          to[t] = from;
          for (let k = 1; k <= skip; ++k) to[t + k] = 0;
          t += step;
        }
      }
    }
    else {
      return copyWithNoIndex(from, to, dims, fromIndex, toIndex, count, stride); 
    }
  }
})();

export const expandNumberArray2 = (
  from: number[] | TypedArray | null,
  to: TypedArray,
  slices: TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
  toIndex: number = 0,
  stride?: number,
) => {
  const step = stride || dims;

  const n = slices.length;
  let f = fromIndex;
  let t = toIndex;
  for (let i = 0; i < n; ++i) {
    const l = slices[i];
    fillNumberArray2(from ?? i, to, dims, f, t, l, stride);
    f++;
    t += l * step;
  }
}

// read from 1d/2d/3d/4d number[][] into 1d/2d/3d/4d typed array
export const copyNestedNumberArray2 = (
  from: number[][] | TypedArray[],
  to: TypedArray,
  fromDims: number,
  toDims: number,
  fromIndex: number = 0,
  toIndex: number = 0,
  count: number,
  w: number = 0,
) => {
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
  count?: number,
  stride?: number,
) => {
  const from = resolve(fromRef);
  if (typeof from === 'number') fillNumberArray2(from, to, dims, fromIndex, toIndex, count, stride);
  else copyNumberArray2(from, to, dims, fromIndex, toIndex, length, stride);
}

export const makePartialRefEmitter2 = (
  dims: number = 1,
  fromIndex: number = 0,
) => (
  fromRef: Lazy<number | number[] | TypedArray>,
  to: TypedArray,
  toIndex: number = 0,
  count?: number,
  stride?: number,
) => {
  const from = resolve(fromRef);
  if (typeof from === 'number') fillNumberArray2(from, to, dims, fromIndex, toIndex, count, stride);
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
) => expandNumberArray2(from, to, slices, dims, fromIndex, toIndex, stride);

export const makeFillEmitter2 = (
  from: NumberArray | number,
  dims: number = 1, 
  fromIndex: number = 0,
) => (
  to: NumberArray,
  toIndex: number = 0,
  count: number = 0,
  stride?: number,
) => fillNumberArray2(from, to, dims, fromIndex, toIndex, count, stride);

export const makeUnweldEmitter2 = (
  from: number[] | TypedArray,
  indices: number[] | TypedArray,
  dims: number = 1,
  fromIndex: number = 0,
) => (
  to: TypedArray,
  toIndex: number = 0,
  count?: number,
  stride?: number,
) => unweldNumberArray2(from, to, indices, dims, fromIndex, toIndex, count, stride);

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
  chunks: TypedArray | number[],
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
  slices: NumberArray | null | undefined,
  chunks: TypedArray | number[],
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

    if (slices) slices[i] = pos - b;
  }

  while (pos < to.length) to[pos++] = 0;
}

export const generateConcaveIndices2 = (
  to: NumberArray,
  slices: NumberArray | null | undefined,
  chunks: TypedArray | number[],
  groups: TypedArray | number[],
  positions: TypedArray,
) => {
  let g = groups.length;

  // Convert XYZ to dominant 2D plane
  const scratch = [];

  const p1 = vec3.fromValues(positions[0], positions[1], positions[2]);
  const p2 = vec3.fromValues(positions[4], positions[5], positions[6]);
  const p3 = vec3.fromValues(positions[8], positions[9], positions[10]);
  
  vec3.sub(p1, p2, p1);
  vec3.sub(p2, p3, p1);
  vec3.cross(p3, p1, p2);

  const nx = Math.abs(p3[0]);
  const ny = Math.abs(p3[1]);
  const nz = Math.abs(p3[2]);

  const max = Math.max(nx, ny, nz);
  const holes: number[] = [];

  let baseChunk = 0;
  let baseVertex = 0;
  let baseIndex = 0;
  for (let i = 0; i < g; ++i) {
    let n = 0;
    for (let j = 0; j < groups[i]; ++j) {
      n += chunks[baseChunk + j];
      holes.push(n);
    }
    holes.pop();

    let o = 0;
    if (max === nz) {
      const n4 = n * 4;
      for (let i = 0; i < n4; i += 4) {
        let f = baseVertex + i;
        scratch[o]     = positions[f];
        scratch[o + 1] = positions[f + 1];
        o += 2;
      }
    }
    else if (max === ny) {
      const n4 = n * 4;
      for (let i = 0; i < n4; i += 4) {
        let f = baseVertex + i;
        scratch[o]     = positions[f + 2];
        scratch[o + 1] = positions[f];
        o += 2;
      }
    }
    else {
      const n4 = n * 4;
      for (let i = 0; i < n4; i += 4) {
        let f = baseVertex + i;
        scratch[o]     = positions[f + 1];
        scratch[o + 1] = positions[f + 2];
        o += 2;
      }
    }

    const indices = earcut(scratch, holes);
    offsetNumberArray2(indices, to, baseVertex, 1, 0, baseIndex, indices.length);

    scratch.length = 0;
    holes.length = 0;

    slices[i] = n;

    baseChunk += groups[i];
    baseVertex += n;
    baseIndex += indices.length;
  }

  return baseIndex;
}
