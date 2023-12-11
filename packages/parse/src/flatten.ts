import type { ArchetypeSchema, Emit, TypedArrayConstructor, VectorLike, VectorLikes } from '@use-gpu/core';
import { isTypedArray, copyNumberArray2, copyNestedNumberArray2 } from '@use-gpu/core';

const NO_CHUNKS: number[] = [];

const maybeTypedArray = (
  x: VectorLike | VectorLikes | VectorLikes[]
) => isTypedArray(x) ? x : null;

const maybeEmptyArray = (
  x: VectorLike | VectorLikes | VectorLikes[],
  constructor: TypedArrayConstructor,
) => !x.length ? new constructor(0) : null;

// Array of scalars
const maybeScalarArray = (
  xs: VectorLike | VectorLikes | VectorLikes[],
  constructor: TypedArrayConstructor,
) => typeof xs[0] === 'number' ? new constructor(x) : null

// Array of vectors
const maybeVectorArray = (
  xs: VectorLike | VectorLikes | VectorLikes[],
  dims: number,
  w: number,
  constructor: TypedArrayConstructor,
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
const maybeMultiScalarArray = (
  xs: VectorLike | VectorLikes | VectorLikes[],
  constructor: TypedArrayConstructor,
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
    copyNumberArray2(x, to, 0, o, l);
    o += l;
  }
  return to;
}

// Array of ragged vector arrays
const maybeMultiVectorArray = (
  xs: VectorLike | VectorLikes | VectorLikes[],
  dims: number,
  w: number,
  constructor: TypedArrayConstructor,
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

    copyNestedNumberArray2(x, to, d, dims, 0, o, l);
    o += l;
  }
  return to;
}

export const toCompositeChunks = (
  x: VectorLike | VectorLikes | VectorLikes[],
  dims: number,
  w: number,
  constructor: TypedArrayConstructor,
) => {
  if (!x.length) return NO_CHUNKS;
  if (isTypedArray(x)) return [x.length];
  if (typeof x[0] === 'number') return [x.length];
  if (typeof x[0]?.[0] === 'number') return [x.length];
  if (typeof x[0]?.[0]?.[0] === 'number') return x[0].map(x => x.length);
  return NO_CHUNKS;
};

export const toScalarArray = (
  x: VectorLike,
  constructor: TypedArrayConstructor = Float32Array
) => (
  maybeTypedArray(x) ||
  maybeEmptyArray(x, constructor) ||
  maybeScalarArray(x, constructor) ||
  new constructor(0)
);

export const toVectorArray = (
  x: VectorLikes,
  dims: number,
  w: number = 0,
  constructor: TypedArrayConstructor = Float32Array,
) => (
  maybeTypedArray(x) ||
  maybeEmptyArray(x, constructor) ||
  maybeScalarArray(x, constructor) ||
  maybeVectorArray(x, dims, w, constructor) ||
  new constructor(0)
);

export const toMultiScalarArray = (
  x: VectorLike,
  constructor: TypedArrayConstructor = Float32Array
) => (
  maybeTypedArray(x) ||
  maybeEmptyArray(x, constructor) ||
  maybeScalarArray(x, constructor) ||
  maybeMultiScalarArray(x, constructor) ||
  new constructor(0)
);

export const toMultiVectorArray = (
  x: VectorLikes | VectorLikes[],
  dims: number,
  w: number = 0,
  constructor: TypedArrayConstructor = Float32Array
) => (
  maybeTypedArray(x) ||
  maybeEmptyArray(x, constructor) ||
  maybeScalarArray(x, constructor) ||
  maybeVectorArray(x, dims, w, constructor) ||
  maybeMultiVectorArray(x, dims, w, constructor) ||
  new constructor(0)
);
