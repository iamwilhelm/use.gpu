import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { StorageSource } from '@use-gpu/core/types';

import { memo, yeet, useMemo } from '@use-gpu/live';
import { getChunkCount, generateChunkSegments, generateChunkAnchors, alignSizeTo } from '@use-gpu/core';
import { useRawSource } from '../hooks/useRawSource';

type ArrowSegmentsProps = {
  chunks?: number[],
  loops?: boolean[],
  starts?: boolean[],
  ends?: boolean[],

  render?: (segments: StorageSource, anchors: StorageSource, trim: StorageSource, lookups: StorageSource) => LiveElement<any>,
};

export const ArrowSegments: LiveComponent<ArrowSegmentsProps> = memo((
  props: ArrowSegmentsProps,
) => {
  const {chunks, loops, starts, ends, render} = props;
  if (!chunks) return null;

  const {segments, anchors, trims, lookups} = useArrowSegments(chunks, loops, starts, ends);

  return render ? render(segments, anchors, trims, lookups) : yeet([segments, anchors, trims, lookups]);
}, 'ArrowSegments');

export const useArrowSegments = (
  chunks: number[],
  loops?: boolean[],
  starts?: boolean[],
  ends?: boolean[],
) => {
  const count = getChunkCount(chunks, loops);

  // Make index data for line segments/anchor/trim data
  const [segmentBuffer, anchorBuffer, trimBuffer, lookupBuffer] = useMemo(() => {
    const segmentBuffer = new Int8Array(alignSizeTo(count, 4));
    const anchorBuffer = new Uint32Array(count * 4);
    const trimBuffer = new Uint32Array(count * 4);
    const lookupBuffer = new Uint32Array(count);

    generateChunkSegments(segmentBuffer, lookupBuffer, chunks, loops, starts, ends);
    generateChunkAnchors(anchorBuffer, trimBuffer, chunks, loops, starts, ends);

    return [segmentBuffer, anchorBuffer, trimBuffer, lookupBuffer];
  }, [chunks, loops, starts, ends, count]);

  // Bind as shader storage
  const segments = useRawSource(segmentBuffer, 'i8');
  const anchors = useRawSource(anchorBuffer, 'vec4<u32>');
  const trims = useRawSource(trimBuffer, 'vec4<u32>');
  const lookups = useRawSource(lookupBuffer, 'u32');
  
  return {segments, anchors, trims, lookups};
}
