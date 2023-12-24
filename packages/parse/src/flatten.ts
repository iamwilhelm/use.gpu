import type { ArchetypeSchema, Emit, TypedArrayConstructor, VectorLike, VectorLikes } from '@use-gpu/core';
import { isTypedArray, copyNumberArray2, copyNestedNumberArray2 } from '@use-gpu/core';

const NO_CHUNKS = new Uint16Array(0);

const maybeTypedArray = (
  x: VectorLike | VectorLikes | VectorLikes[]
) => isTypedArray(x) ? x : null;

const maybeEmptyArray = <T extends TypedArrayConstructor>(
  x: VectorLike | VectorLikes | VectorLikes[],
  constructor: T,
) => !x.length ? new constructor(0) : null;

// Array of scalars
const maybeScalarArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[],
  constructor: T,
) => typeof xs[0] === 'number' ? new constructor(x) : null

// Array of vectors
const maybeVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[],
  dims: number,
  w: number,
  constructor: T,
) => {
  const d = (xs[0] as any)?.length;
  if (d == null) return null;

  if (typeof xs[0][0] !== 'number') return null;
  if (d > dims) throw new Error(`Data point cannot be larger than ${dims}-vector`);

  const n = xs.length;

  const to = new constructor(n * dims);
  copyNestedNumberArray2(xs as any, to, d, dims, 0, 0, n, w);
  return to;
}

// Array of ragged scalar arrays
const maybeMultiScalarArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[],
  constructor: T,
) => {
  const d = (xs[0] as any)?.length;
  if (d == null) return null;

  if (typeof xs[0][0] !== 'number') return null;

  const chunks = xs.length;

  let n = 0;
  for (let i = 0; i < chunks; i++) n += xs[i].length;

  const to = new constructor(n);
  let o = 0;
  for (let i = 0; i < chunks; i++) {
    const x = xs[i];
    const l = x.length;
    copyNumberArray2(x, to, l, 0, o);
    o += l;
  }
  return to;
}

// Array of ragged vector arrays
const maybeMultiVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[],
  dims: number,
  w: number,
  constructor: T,
) => {
  const d = (xs[0]?.[0] as any)?.length;
  if (d == null) return null;

  if (typeof xs[0][0][0] !== 'number') return null;
  if (d > dims) throw new Error(`Data point cannot be larger than ${dims}-vector`);

  const chunks = xs.length;

  let n = 0;
  for (let i = 0; i < chunks; i++) n += xs[i].length;

  const to = new constructor(n * dims);
  let o = 0;
  for (let i = 0; i < chunks; i++) {
    const x = xs[i];
    const l = x.length;

    copyNestedNumberArray2(x, to, d, dims, 0, o, l, w);
    o += l * dims;
  }
  return to;
}
// Array of ragged arrays of ragged vector arrays
const maybeMultiMultiVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[],
  dims: number,
  w: number,
  constructor: T,
) => {
  const d = (xs[0]?.[0]?.[0] as any)?.length;
  if (d == null) return null;

  if (typeof xs[0][0][0][0] !== 'number') return null;
  if (d > dims) throw new Error(`Data point cannot be larger than ${dims}-vector`);

  const chunks = xs.length;

  let n = 0;
  for (let i = 0; i < chunks; i++) {
    const chunk = xs[i];
    const groups = chunk.length;

    for (let j = 0; j < groups; j++) {
      n += chunk[i].length;
    }
  }

  const to = new constructor(n * dims);
  let o = 0;
  for (let i = 0; i < chunks; i++) {
    const chunk = xs[i];
    const groups = chunk.length;

    for (let j = 0; j < groups; j++) {
      const x = chunk[j];
      const l = x.length;

      copyNestedNumberArray2(x, to, d, dims, 0, o, l, w);
      o += l * dims;
    }
  }
  return to;
}

export const toScalarArray = <T extends TypedArrayConstructor>(
  xs: VectorLike,
  constructor?: T = Float32Array
): T => (
  maybeTypedArray(xs) ||
  maybeEmptyArray(xs, constructor) ||
  maybeScalarArray(xs, constructor) ||
  new constructor(0)
);

export const toVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLikes,
  dims: number,
  w: number = 0,
  constructor: T = Float32Array,
) => (
  maybeTypedArray(xs) ||
  maybeEmptyArray(xs, constructor) ||
  maybeScalarArray(xs, constructor) ||
  maybeVectorArray(xs, dims, w, constructor) ||
  new constructor(0)
);

export const toMultiScalarArray = <T extends TypedArrayConstructor>(
  xs: VectorLike,
  constructor: T = Float32Array
) => (
  maybeTypedArray(xs) ||
  maybeEmptyArray(xs, constructor) ||
  maybeScalarArray(xs, constructor) ||
  maybeMultiScalarArray(xs, constructor) ||
  new constructor(0)
);

export const toMultiVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLikes | VectorLikes[],
  dims: number,
  w: number = 0,
  constructor: T = Float32Array
) => (
  maybeTypedArray(xs) ||
  maybeEmptyArray(xs, constructor) ||
  maybeScalarArray(xs, constructor) ||
  maybeVectorArray(xs, dims, w, constructor) ||
  maybeMultiVectorArray(xs, dims, w, constructor) ||
  new constructor(0)
);

export const toMultiMultiVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLikes | VectorLikes[],
  dims: number,
  w: number = 0,
  constructor: T = Float32Array
) => (
  maybeTypedArray(xs) ||
  maybeEmptyArray(xs, constructor) ||
  maybeScalarArray(xs, constructor) ||
  maybeVectorArray(xs, dims, w, constructor) ||
  maybeMultiVectorArray(xs, dims, w, constructor) ||
  maybeMultiMultiVectorArray(xs, dims, w, constructor) ||
  new constructor(0)
);

// Get list of ragged chunk lengths
export const toCompositeChunks = (xs: VectorLike | VectorLikes | VectorLikes[]) => {
  if (!xs.length) return NO_CHUNKS;
  if (
    isTypedArray(xs) ||
    typeof xs[0] === 'number' ||
    typeof xs[0]?.[0] === 'number'
  ) {
    const to = new Uint16Array(1);
    to[0] = xs.length;
    return to;
  }
  if (typeof xs[0]?.[0]?.[0] === 'number') {
    const n = xs.length;
    const to = new Uint16Array(n);
    for (let i = 0; i < n; ++i) to[i] = xs[i].length;
    return to;
  }
  return NO_CHUNKS;
};

// Get list of inner ragged chunk lengths plus outer ragged groupings
export const toMultiCompositeChunks = (xs: VectorLike | VectorLikes | VectorLikes[]) => {
  if (typeof xs[0]?.[0]?.[0]?.[0] === 'number') {
    const n = xs.length;
    const groups = new Uint16Array(n);

    let count = 0;
    for (let i = 0; i < n; ++i) {
      const chunk = xs[i];
      const l = chunk.length;
      count += l;
      groups[i] = l;
    }

    let o = 0;
    const to = new Uint16Array(count);
    for (let i = 0; i < n; ++i) {
      const chunk = xs[i];
      const l = chunk.length;
      for (let j = 0; j < l; ++j) {
        to[o++] = chunk[j].length;
      }
    }

    return [to, groups];
  }

  const chunks = toCompositeChunks(xs);
  return [chunks, [1]];
};

