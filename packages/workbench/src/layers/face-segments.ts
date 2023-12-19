import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource } from '@use-gpu/core';

import { memo, yeet, useOne } from '@use-gpu/live';
import { generateChunkFaces2, alignSizeTo2 } from '@use-gpu/core';
import { useRawSource } from '../hooks/useRawSource';

export type FaceSegmentsProps = {
  chunks?: number[],

  render?: (segments: StorageSource) => LiveElement,
};

/** Produces `segments` composite data for `@{FaceLayer}`. */
export const FaceSegments: LiveComponent<FaceSegmentsProps> = memo((
  props: FaceSegmentsProps,
) => {
  const {chunks, render} = props;
  if (!chunks) return null;
  
  const {segments} = useFaceSegmentsSource(chunks);
  return render ? render(segments) : yeet([segments]);
}, 'FaceSegments');

export const useFaceSegments = (
  chunks: number[] | TypedArray,
) => {
  return useOne(() => {
    const count = (
      chunks.reduce((a, b, i) => a + b, 0)
    );

    const segments = new Int8Array(alignSizeTo2(count, 4));
    const slices = new Uint16Array(alignSizeTo2(chunks.length, 2));

    generateChunkFaces2(segments, slices, chunks);

    return {count, segments, slices};
  }, chunks);
};

export const useFaceSegmentsSource = (
  chunks: number[] | TypedArray,
) => {
  const {count, segments} = useFaceSegments(chunks);

  // Bind as shader storage
  const s = useRawSource(segments, 'i8');

  return {count, segments};
};
