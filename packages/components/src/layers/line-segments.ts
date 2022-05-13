import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { StorageSource } from '@use-gpu/core/types';

import { memo, yeet, useMemo } from '@use-gpu/live';
import { getChunkCount, generateChunkSegments } from '@use-gpu/core';
import { useBoundStorage } from '../hooks/useBoundStorage';

type LineSegmentsProps = {
  chunks?: number[],
  loops?: boolean[],

  render?: (segments: StorageSource) => LiveElement<any>,
};

export const LineSegments: LiveComponent<LineSegmentsProps> = memo((
  props: LineSegmentsProps,
) => {
  const {chunks, loops, render} = props;
  if (!chunks) return null;
  
  const count = getChunkCount(chunks, loops);

  // Make index data for line segments/anchor/trim data
  const segmentBuffer = useMemo(() => {
    const segmentBuffer = new Int32Array(count);

    generateChunkSegments(segmentBuffer, chunks, loops);

    return segmentBuffer;
  }, [chunks, loops, count]);

  // Bind as shader storage
  const segments = useBoundStorage(segmentBuffer, 'i32');

  return render ? render(segments) : yeet(segments);
}, 'LineSegments');
