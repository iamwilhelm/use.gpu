import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource } from '@use-gpu/core';

import { memo, yeet, useMemo } from '@use-gpu/live';
import { accumulateChunks, generateChunkSegments, generateChunkAnchors, alignSizeTo } from '@use-gpu/core';
import { useRawSource } from '../hooks/useRawSource';
import { ARROW_SEGMENTS_SCHEMA } from './schemas';

export type ArrowSegmentsData = {
  count: number,
  sparse: number,
  segments: TypedArray,
  anchors: TypedArray,
  trims: TypedArray,
  slices: TypedArray,
  unwelds: TypedArray,
};

/** Make index data for arrow segments/anchor/trim data */
export const getArrowSegments = ({
  chunks, loops, starts, ends,
}: {
  chunks: number[] | TypedArray,
  loops?: boolean[] | boolean | null,
  starts?: boolean[] | boolean | null,
  ends?: boolean[] | boolean | null,
}) => {
  const count = accumulateChunks(chunks, loops);

  const segments = new Int8Array(alignSizeTo(count, 4));
  const anchors = new Uint32Array(count * 4);
  const trims = new Uint32Array(count * 4);
  const slices = new Uint16Array(alignSizeTo(chunks.length, 2));
  const unwelds = loops ? new Uint16Array(alignSizeTo(count, 2)) : undefined;

  generateChunkSegments(segments, slices, unwelds, chunks, loops, starts, ends);
  const sparse = generateChunkAnchors(anchors, trims, chunks, loops, starts, ends);

  return {
    count,
    sparse,
    segments,
    anchors,
    trims,
    slices,
    unwelds,
    schema: ARROW_SEGMENTS_SCHEMA,
  };
}

export const useArrowSegmentsSource = (
  chunks: number[] | TypedArray,
  loops?: boolean[] | boolean | null,
  starts?: boolean[] | boolean | null,
  ends?: boolean[] | boolean | null,
) => {
  const {count, sparse, segments, anchors, trims, slices} = useMemo(
    () => getArrowSegments({chunks, loops, starts, ends}),
    [chunks, loops, starts, ends]
  );

  // Bind as shader storage
  const s = useRawSource(segments, 'i8');
  const a = useRawSource(anchors, 'vec4<u32>');
  const t = useRawSource(trims, 'vec4<u32>');

  a.length = sparse;
  a.size[0] = sparse;

  return {
    count,
    sparse,
    segments: s,
    anchors: a,
    trims: t,
  };
}
