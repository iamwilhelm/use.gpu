import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource } from '@use-gpu/core';

import { memo, yeet, useOne } from '@use-gpu/live';
import { generateChunkFaces2, alignSizeTo2 } from '@use-gpu/core';
import { useRawSource } from '../hooks/useRawSource';

export type FaceSegmentsProps = {
  chunks?: number[],

  render?: (segments: StorageSource, lookups: StorageSource) => LiveElement,
};

/** Produces `segments` and `lookups` composite data for `@{FaceLayer}`. */
export const FaceSegments: LiveComponent<FaceSegmentsProps> = memo((
  props: FaceSegmentsProps,
) => {
  const {chunks, render} = props;
  if (!chunks) return null;
  
  const {segments, lookups} = useFaceSegmentsSource(chunks);
  return render ? render(segments, lookups) : yeet([segments, lookups]);
}, 'FaceSegments');

export const useFaceSegments = (
  chunks: number[] | TypedArray,
) => {
  return useOne(() => {
    const count = (
      chunks.reduce((a, b, i) => a + b, 0)
    );

    const segments = new Int8Array(alignSizeTo2(count, 4));
    const lookups = new Uint16Array(alignSizeTo2(count, 2));

    generateChunkFaces2(segments, lookups, chunks);

    return {count, segments, lookups};
  }, chunks);
};

export const useFaceSegmentsSource = (
  chunks: number[] | TypedArray,
) => {
  const {count, segments, lookups} = useFaceSegments(chunks);

  // Bind as shader storage
  const s = useRawSource(segmentBuffer, 'i8');
  const l = useRawSource(lookupBuffer, 'u32');

  return {count, segments: s, lookups: l};
};
