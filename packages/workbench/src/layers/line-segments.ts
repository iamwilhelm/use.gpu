import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource, VectorLike } from '@use-gpu/core';

import { memo, yeet, useMemo } from '@use-gpu/live';
import { accumulateChunks, generateChunkSegments, alignSizeTo } from '@use-gpu/core';
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
  const count = accumulateChunks(chunks, loops);

  const segments = new Int8Array(alignSizeTo(count, 4));
  const slices = new Uint16Array(alignSizeTo(chunks.length, 2));
  const unwelds = loops ? new Uint16Array(alignSizeTo(count, 2)) : undefined;

  generateChunkSegments(segments, slices, unwelds, chunks, loops);

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
