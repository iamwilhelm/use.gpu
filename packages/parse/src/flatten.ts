import type { ArchetypeSchema, Emit, TypedArrayConstructor, TensorArray, VectorLike, VectorLikes } from '@use-gpu/core';
import { seq, isTypedArray, copyNumberArray, copyNestedNumberArray } from '@use-gpu/core';

const NO_CHUNKS = [new Uint32Array(0), null];

const maybeTypedArray = (
  xs: VectorLike | VectorLikes | VectorLikes[] | TensorArray
) => isTypedArray(xs) ? xs : isTypedArray(xs.array) ? xs.array : null;

const maybeEmptyArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[] | TensorArray,
  ctor: T,
) => Array.isArray(xs) && !xs.length ? new ctor(0) : null;

const maybeTensorArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[] | TensorArray,
  ctor: T,
) => Array.isArray(xs) && !xs.length ? new ctor(0) : null;

// Array of scalars
const maybeScalarArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[] | TensorArray,
  ctor: T,
) => typeof xs[0] === 'number' ? new ctor(xs) : null

// Array of vectors
const maybeVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[] | TensorArray,
  dims: number,
  w: number,
  ctor: T,
) => {
  const d = (xs[0] as any)?.length;
  if (d == null) return null;

  if (typeof xs[0][0] !== 'number') return null;
  if (d > dims) throw new Error(`Data point cannot be larger than ${dims}-vector`);

  const n = xs.length;

  const to = new ctor(n * dims);
  copyNestedNumberArray(xs as any, to, d, dims, 0, 0, n, w);
  return to;
}

// Array of ragged scalar arrays
const maybeMultiScalarArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[] | TensorArray,
  ctor: T,
) => {
  const d = (xs[0] as any)?.length;
  if (d == null) return null;

  if (typeof xs[0][0] !== 'number') return null;

  const chunks = xs.length;

  let n = 0;
  for (let i = 0; i < chunks; i++) n += xs[i].length;

  const to = new ctor(n);
  let o = 0;
  for (let i = 0; i < chunks; i++) {
    const x = xs[i];
    const l = x.length;
    copyNumberArray(x, to, 1, 1, 0, o, l);
    o += l;
  }
  return to;
}

// Array of ragged vector arrays
const maybeMultiVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[] | TensorArray,
  dims: number,
  w: number,
  ctor: T,
) => {
  const d = (xs[0]?.[0] as any)?.length;
  if (d == null) return null;

  if (typeof xs[0][0][0] !== 'number') return null;
  if (d > dims) throw new Error(`Data point cannot be larger than ${dims}-vector`);

  const chunks = xs.length;

  let n = 0;
  for (let i = 0; i < chunks; i++) n += xs[i].length;

  const to = new ctor(n * dims);
  let o = 0;
  for (let i = 0; i < chunks; i++) {
    const x = xs[i];
    const l = x.length;

    copyNestedNumberArray(x, to, d, dims, 0, o, l, w);
    o += l * dims;
  }
  return to;
}
// Array of ragged arrays of ragged vector arrays
const maybeMultiMultiVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[] | TensorArray,
  dims: number,
  w: number,
  ctor: T,
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
      n += chunk[j].length;
    }
  }

  const to = new ctor(n * dims);
  let o = 0;
  for (let i = 0; i < chunks; i++) {
    const chunk = xs[i];
    const groups = chunk.length;

    for (let j = 0; j < groups; j++) {
      const x = chunk[j];
      const l = x.length;

      copyNestedNumberArray(x, to, d, dims, 0, o, l, w);
      o += l * dims;
    }
  }
  return to;
}

export const toScalarArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | TensorArray,
  ctor?: T = Float32Array
): T | null => (
  maybeTypedArray(xs) ??
  maybeEmptyArray(xs, ctor) ??
  maybeScalarArray(xs, ctor)
);

export const toVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLikes | TensorArray,
  dims: number,
  w: number = 0,
  ctor: T = Float32Array,
): T | null => (
  toScalarArray(xs, ctor) ??
  maybeVectorArray(xs, dims, w, ctor)
);

export const toMultiScalarArray = <T extends TypedArrayConstructor>(
  xs: VectorLikes | TensorArray,
  ctor: T = Float32Array
): T | null => (
  toScalarArray(xs, ctor) ??
  maybeMultiScalarArray(xs, ctor)
);

export const toMultiVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLikes | VectorLikes[] | TensorArray,
  dims: number,
  w: number = 0,
  ctor: T = Float32Array
): T | null => (
  toVectorArray(xs, dims, w, ctor) ??
  maybeMultiVectorArray(xs, dims, w, ctor)
);

export const toMultiMultiVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLikes | VectorLikes[] | TensorArray,
  dims: number,
  w: number = 0,
  ctor: T = Float32Array
): T | null => (
  toMultiVectorArray(xs, dims, w, ctor) ??
  maybeMultiMultiVectorArray(xs, dims, w, ctor)
);

// Get 1 chunk length
export const toVertexCount = (
  xs: number | VectorLike | VectorLikes | VectorLikes[] | TensorArray | null | undefined,
  dims: number,
): number => {
  if (isTypedArray(xs?.array)) return xs.length;

  const n = xs?.length;
  if (!n) return 0;

  const x = xs[0];
  if (typeof xs === 'number') return 1;
  if (isTypedArray(xs) || typeof x === 'number') {
    return (n / dims) | 0;
  }
  if (typeof x?.[0] === 'number') {
    return n;
  }
  return 0;
};

// Get list of inner ragged chunk lengths plus outer ragged groupings
export const toChunkCounts = (
  xs: VectorLike | VectorLikes | VectorLikes[] | TensorArray | null | undefined,
  dims: number,
): VectorLike => {
  if (isTypedArray(xs?.array)) return sizeToChunkCounts(xs.size);

  const n = xs?.length;
  if (!n) return NO_CHUNKS;

  const x = xs[0];
  if (typeof x?.[0]?.[0] === 'number') {
    const to = new Uint32Array(n);
    for (let i = 0; i < n; ++i) to[i] = xs[i].length;
    return [to, null];
  }
  if (typeof x?.[0]?.[0]?.[0] === 'number') {
    const groups = new Uint32Array(n);

    let count = 0;
    for (let i = 0; i < n; ++i) {
      const chunk = xs[i];
      const l = chunk.length;
      count += l;
      groups[i] = l;
    }

    let o = 0;
    const to = new Uint32Array(count);
    for (let i = 0; i < n; ++i) {
      const chunk = xs[i];
      const l = chunk.length;
      for (let j = 0; j < l; ++j) {
        to[o++] = chunk[j].length;
      }
    }

    return [to, groups];
  }

  const count = toVertexCount(xs, dims);
  return count ? [[count], null] : NO_CHUNKS;
};

export const sizeToChunkCounts = (size: number[]) => {
  const [segment, group, ...rest] = size;

  if (group == null) return [[segment], null];

  if (rest.length === 0) {
    const chunks = seq(group).map(_ => segment);
    return [chunks, null];
  }

  const planes = rest.reduce((a, b) => a * b, 1);
  const chunks = seq(group * planes).map(_ => segment);
  const groups = seq(planes).map(_ => group);
  return [chunks, groups];
};
