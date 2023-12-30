import type { TypedArray, VectorLike } from './types';

import { vec3 } from 'gl-matrix';
import earcut from 'earcut';

import { offsetNumberArray } from './data';

export const accumulateChunks = (
  chunks: VectorLike,
  loops: VectorLike | boolean[] | boolean = false,
) => {
  const count = (
    loops === true ? chunks.reduce((a, b, i) => a + b + 3, 0) :
    loops ? chunks.reduce((a, b, i) => a + b + (loops[i] ? 3 : 0), 0) :
    chunks.reduce((a, b, i) => a + b, 0)
  );
  return count;
};

export const generateChunkSegments = (
  to: VectorLike,
  slices: VectorLike | null | undefined,
  unwelds: VectorLike | null | undefined,
  chunks: VectorLike,
  loops: VectorLike | boolean[] | boolean = false,
  starts: VectorLike | boolean[] | boolean = false,
  ends: VectorLike | boolean[] | boolean = false,
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

export const generateChunkAnchors = (
  anchors: VectorLike,
  trims: VectorLike,
  chunks: VectorLike,
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

export const generateChunkFaces = (
  to: VectorLike,
  slices: VectorLike | null | undefined,
  chunks: VectorLike,
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

export const generateConcaveIndices = (
  to: VectorLike,
  slices: VectorLike | null | undefined,
  chunks: VectorLike,
  groups: VectorLike,
  positions: VectorLike,
  dims: number,
) => {
  let g = groups.length;

  // Convert XYZ to dominant 2D plane
  const scratch = [];

  let axis = 0;
  if (dims >= 3) {
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
    if (max === ny) axis = 1;
    else if (max === nx) axis = 2;
  }
  else if (dims <= 1) {
    throw new Error("Cannot triangulate 1D data");
  }

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
    if (axis === 0) {
      const nd = n * dims;
      for (let i = 0; i < nd; i += dims) {
        let f = baseVertex * dims + i;
        scratch[o]     = positions[f];
        scratch[o + 1] = positions[f + 1];
        o += 2;
      }
    }
    else if (axis === 1) {
      const nd = n * dims;
      for (let i = 0; i < nd; i += dims) {
        let f = baseVertex * dims + i;
        scratch[o]     = positions[f + 2];
        scratch[o + 1] = positions[f];
        o += 2;
      }
    }
    else {
      const nd = n * dims;
      for (let i = 0; i < nd; i += dims) {
        let f = baseVertex * dims + i;
        scratch[o]     = positions[f + 1];
        scratch[o + 1] = positions[f + 2];
        o += 2;
      }
    }

    const indices = earcut(scratch, holes);
    offsetNumberArray(indices, to, baseVertex, 1, 1, 0, baseIndex, indices.length);

    scratch.length = 0;
    holes.length = 0;

    slices[i] = n;

    baseChunk += groups[i];
    baseVertex += n;
    baseIndex += indices.length;
  }

  return baseIndex;
}
