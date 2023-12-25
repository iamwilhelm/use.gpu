import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource, VectorLike } from '@use-gpu/core';

import { memo, yeet, useMemo, useNoMemo, useOne, useNoOne } from '@use-gpu/live';
import { generateChunkFaces2, generateConcaveIndices2, alignSizeTo2 } from '@use-gpu/core';
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
  const count = (
    chunks.reduce((a, b, i) => a + b, 0)
  );

  const segments = new Int8Array(alignSizeTo2(count, 4));
  const slices = new Uint16Array(alignSizeTo2(chunks.length, 2));

  generateChunkFaces2(segments, slices, chunks);

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
  const count = (
    chunks.reduce((a, b, i) => a + b, 0)
  );

  const indices = new Uint32Array(count * 3);
  const slices = new Uint16Array(alignSizeTo2(groups.length, 2));

  const indexed = generateConcaveIndices2(indices, slices, chunks, groups, positions, dims);

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
