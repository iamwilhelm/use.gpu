import type { ArchetypeSchema, Emit, TypedArrayConstructor, VectorLike, VectorLikes } from '@use-gpu/core';
import { isTypedArray, copyNumberArray, copyNestedNumberArray } from '@use-gpu/core';

const NO_CHUNKS = new Uint16Array(0);

const maybeTypedArray = (
  xs: VectorLike | VectorLikes | VectorLikes[]
) => isTypedArray(xs) ? xs : null;

const maybeEmptyArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[],
  ctor: T,
) => Array.isArray(xs) && !xs.length ? new ctor(0) : null;

// Array of scalars
const maybeScalarArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[],
  ctor: T,
) => typeof xs[0] === 'number' ? new ctor(xs) : null

// Array of vectors
const maybeVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLike | VectorLikes | VectorLikes[],
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
  xs: VectorLike | VectorLikes | VectorLikes[],
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
  xs: VectorLike | VectorLikes | VectorLikes[],
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
  xs: VectorLike | VectorLikes | VectorLikes[],
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
      n += chunk[i].length;
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
  xs: VectorLike,
  ctor?: T = Float32Array
): T | null => (
  maybeTypedArray(xs) ??
  maybeEmptyArray(xs, ctor) ??
  maybeScalarArray(xs, ctor)
);

export const toVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLikes,
  dims: number,
  w: number = 0,
  ctor: T = Float32Array,
): T | null => (
  toScalarArray(xs) ??
  maybeVectorArray(xs, dims, w, ctor)
);

export const toMultiScalarArray = <T extends TypedArrayConstructor>(
  xs: VectorLike,
  ctor: T = Float32Array
): T | null => (
  toScalarArray(xs) ??
  maybeMultiScalarArray(xs, ctor)
);

export const toMultiVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLikes | VectorLikes[],
  dims: number,
  w: number = 0,
  ctor: T = Float32Array
): T | null => (
  toVectorArray(xs) ??
  maybeMultiVectorArray(xs, dims, w, ctor)
);

export const toMultiMultiVectorArray = <T extends TypedArrayConstructor>(
  xs: VectorLikes | VectorLikes[],
  dims: number,
  w: number = 0,
  ctor: T = Float32Array
): T | null => (
  toMultiVectorArray(xs) ??
  maybeMultiMultiVectorArray(xs, dims, w, ctor)
);

// Get list of ragged chunk lengths
export const toCompositeChunks = (
  xs: VectorLike | VectorLikes | VectorLikes[],
) => {
  const n = xs.length;
  if (!n) return NO_CHUNKS;

  const x = xs[0];
  if (
    isTypedArray(xs) ||
    typeof x === 'number' ||
    typeof x?.[0] === 'number'
  ) {
    const to = new Uint16Array(1);
    to[0] = n;
    return to;
  }
  if (typeof x?.[0]?.[0] === 'number') {
    const to = new Uint16Array(n);
    for (let i = 0; i < n; ++i) to[i] = xs[i].length;
    return to;
  }
  return NO_CHUNKS;
};

// Get list of inner ragged chunk lengths plus outer ragged groupings
export const toMultiCompositeChunks = (
  xs: VectorLike | VectorLikes | VectorLikes[],
) => {
  const n = xs.length;
  const x = xs[0];

  if (typeof x?.[0]?.[0]?.[0] === 'number') {
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

  const chunks = toCompositeChunks(xs, n);
  return [chunks, [1]];
};
