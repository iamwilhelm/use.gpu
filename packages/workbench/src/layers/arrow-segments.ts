import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource } from '@use-gpu/core';

import { memo, yeet, useMemo } from '@use-gpu/live';
import { accumulateChunks, generateChunkSegments, generateChunkAnchors, alignSizeTo } from '@use-gpu/core';
import { useRawSource } from '../hooks/useRawSource';

export type ArrowSegmentsProps = {
  chunks?: number[],
  loops?: boolean[],
  starts?: boolean[],
  ends?: boolean[],

  render?: (segments: StorageSource, anchors: StorageSource, trim: StorageSource, lookups: StorageSource) => LiveElement,
};

/** Produces `segments`, `anchors`, `trims` composite data for `@{ArrowLayer}`. */
export const ArrowSegments: LiveComponent<ArrowSegmentsProps> = memo((
  props: ArrowSegmentsProps,
) => {
  const {chunks, loops, starts, ends, render} = props;
  if (!chunks) return null;

  const {segments, anchors, trims, lookups} = useArrowSegmentsSource(chunks, loops, starts, ends);
  return render ? render(segments, anchors, trims, lookups) : yeet([segments, anchors, trims, lookups]);
}, 'ArrowSegments');

export const useArrowSegments = (
  chunks: number[] | TypedArray,
  loops: boolean[] | boolean = false,
  starts: boolean[] | boolean = false,
  ends: boolean[] | boolean = false,
) => {
  // Make index data for line segments/anchor/trim data
  return useMemo(() => {
    const count = accumulateChunks(chunks, loops);

    const segments = new Int8Array(alignSizeTo(count, 4));
    const anchors = new Uint32Array(count * 4);
    const trims = new Uint32Array(count * 4);
    const lookups = new Uint32Array(count);
    const scatters = loops ? new Uint16Array(alignSizeTo(count, 2)) : undefined;

    generateChunkSegments(segments, lookups, scatters, chunks, loops, starts, ends);
    const anchorCount = generateChunkAnchors(anchors, trims, chunks, loops, starts, ends);

    return {
      segmentCount,
      anchorCount,
      segments,
      anchors,
      trims,
      lookups,
      scatters,
    };
  }, [chunks, loops, starts, ends]);
}

export const useArrowSegmentsSource = (
  chunks: number[] | TypedArray,
  loops: boolean[] | boolean = false,
  starts: boolean[] | boolean = false,
  ends: boolean[] | boolean = false,
) => {
  const {count, anchorCount, segments, anchors, trims, lookups} = useArrowSegments(chunks, loops, starts, ends);

  // Bind as shader storage
  const s = useRawSource(segments, 'i8');
  const a = useRawSource(anchors, 'vec4<u32>');
  const t = useRawSource(trims, 'vec4<u32>');
  const l = useRawSource(lookups, 'u32');

  a.length = anchorCount;
  a.size[0] = anchorCount;

  return {
    count,
    anchorCount,
    segments: s,
    anchors: a,
    trims: t,
    lookups: l,
  };
}
