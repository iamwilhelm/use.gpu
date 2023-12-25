import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource, VectorLike } from '@use-gpu/core';

import { memo, yeet, useMemo } from '@use-gpu/live';
import { accumulateChunks, generateChunkSegments, generateChunkSegments2, alignSizeTo2 } from '@use-gpu/core';
import { useRawSource } from '../hooks/useRawSource';

export type LineSegmentsData = {
  count: number,
  segments: TypedArray,
  slices: TypedArray,
  unwelds: TypedArray,
};

/** Make index data for line segments data */
export const getLineSegments = ({
  chunks, loops, starts, ends,
}: {
  chunks: VectorLike,
  loops?: boolean[] | boolean | null,
  starts?: boolean[] | boolean | null,
  ends?: boolean[] | boolean | null,
}) => {
  const count = (
    loops === true ? chunks.reduce((a, b, i) => a + b + 3, 0) :
    loops ? chunks.reduce((a, b, i) => a + b + (loops[i] ? 3 : 0), 0) :
    chunks.reduce((a, b, i) => a + b, 0)
  );

  const segments = new Int8Array(alignSizeTo2(count, 4));
  const slices = new Uint16Array(alignSizeTo2(chunks.length, 2));
  const unwelds = loops ? new Uint16Array(alignSizeTo2(count, 2)) : undefined;

  generateChunkSegments2(segments, slices, unwelds, chunks, loops);

  return {count, segments, slices, unwelds};
};

export const useLineSegmentsSource = ({
  chunks, loops, starts, ends,
}: {
  chunks: VectorLike,
  loops?: boolean[] | boolean | null,
  starts?: boolean[] | boolean | null,
  ends?: boolean[] | boolean | null,
}) => {
  const {count, segments, slices} = useMemo(
    () =>getLineSegments({chunks, loops, starts, ends}),
    [chunks, loops, starts, ends]
  );

  // Bind as shader storage
  const s = useRawSource(segments, 'i8');
  const l = useRawSource(slices, 'u32');

  return {count, segments: s, slices: l};
};
