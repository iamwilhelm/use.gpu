import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource, VectorLike } from '@use-gpu/core';

import { memo, yeet, useMemo, useNoMemo, useOne, useNoOne } from '@use-gpu/live';
import { accumulateChunks, generateChunkFaces, generateConcaveIndices, alignSizeTo } from '@use-gpu/core';
import { useRawSource, useNoRawSource } from '../hooks/useRawSource';

export type FaceSegmentsData = {
  count: number,
  segments: TypedArray,
  slices: TypedArray,
};

export const getFaceSegments = ({
  chunks,
}: {
  chunks: VectorLike,
}) => {
  const count = accumulateChunks(chunks);

  const segments = new Int8Array(alignSizeTo(count, 4));
  const slices = new Uint16Array(alignSizeTo(chunks.length, 2));

  generateChunkFaces(segments, slices, chunks);

  return {count, segments, slices};
};

export const getFaceSegmentsConcave = ({
  chunks, groups, positions, dims,
}: {
  chunks: VectorLike,
  groups: VectorLike,
  positions: TypedArray,
  dims: number,
}) => {
  const count = accumulateChunks(chunks);

  const indices = new Uint32Array(count * 3);
  const slices = new Uint16Array(alignSizeTo(groups.length, 2));

  const indexed = generateConcaveIndices(indices, slices, chunks, groups, positions, dims);

  return {count, indexed, indices, slices};
};

export const useFaceSegmentsSource = (
  chunks: VectorLike,
) => {
  const {count, segments} = useOne(() => getFaceSegments({chunks}), chunks);

  // Bind as shader storage
  const s = useRawSource(segments, 'i8');

  return {count, segments};
};

export const useFaceSegmentsConcaveSource = (
  chunks: VectorLike,
  groups: VectorLike,
  positions: TypedArray,
  dims: number,
) => {
  const {count, indexed, indices} = useMemo(() => getFaceSegmentsConcave({chunks, groups, positions, dims}));

  // Bind as shader storage
  const i = useRawSource(indices, 'i8');
  i.length = indexed;
  i.size[0] = indexed;

  return {count, indexed, segments};
};

export const useNoFaceSegments = useNoOne;
export const useNoFaceSegmentsConcave = useNoMemo;

export const useNoFaceSegmentsSource = () => {
  useNoOne();
  useNoRawSource();
};

export const useNoFaceSegmentsConcaveSource = () => {
  useNoMemo();
  useNoRawSource();
};
