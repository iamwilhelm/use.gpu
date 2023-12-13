import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource } from '@use-gpu/core';

import { memo, yeet, useMemo } from '@use-gpu/live';
import { accumulateChunks, generateChunkSegments, generateChunkSegments2, alignSizeTo } from '@use-gpu/core';
import { useRawSource } from '../hooks/useRawSource';

export type LineSegmentsProps = {
  chunks?: number[],
  loops?: boolean[] | boolean,

  render?: (segments: StorageSource, lookups: StorageSource) => LiveElement,
};

/** Produces `segments` composite data for `@{LineLayer}`. */
export const LineSegments: LiveComponent<LineSegmentsProps> = memo((
  props: LineSegmentsProps,
) => {
  const {chunks, loops, render} = props;
  if (!chunks) return null;

  const {segments, lookups} = useLineSegmentsSource(chunks, loops);
  return render ? render(segments, lookups) : yeet([segments, lookups]);
}, 'LineSegments');

export const useLineSegments = (
  chunks: number[] | TypedArray,
  loops: boolean[] | boolean = false,
  starts: boolean[] | boolean = false,
  ends: boolean[] | boolean = false,
) => {
  return useMemo(() => {
    const count = (
      loops === true ? chunks.reduce((a, b, i) => a + b + 3, 0) :
      loops ? chunks.reduce((a, b, i) => a + b + (loops[i] ? 3 : 0), 0) :
      chunks.reduce((a, b, i) => a + b, 0)
    );

    const segments = new Int8Array(alignSizeTo(count, 4));
    const lookups = new Uint16Array(alignSizeTo(count, 2));
    const unwelds = loops ? new Uint16Array(alignSizeTo(count, 2)) : undefined;

    generateChunkSegments2(segments, lookups, unwelds, chunks, loops);

    return {count, segments, lookups, unwelds};
  }, [chunks, loops, starts, ends]);
};

export const useLineSegmentsSource = (
  chunks: number[] | TypedArray,
  loops: boolean[] | boolean = false,
  starts: boolean[] | boolean = false,
  ends: boolean[] | boolean = false,
) => {
  const {count, segments, lookups} = useLineSegments(chunks, loops, starts, ends);

  // Bind as shader storage
  const s = useRawSource(segmentBuffer, 'i8');
  const l = useRawSource(lookupBuffer, 'u32');

  return {count, segments: s, lookups: l};
};
