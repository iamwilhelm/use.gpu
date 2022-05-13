import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { StorageSource } from '@use-gpu/core/types';

import { memo, yeet, useMemo } from '@use-gpu/live';
import { getChunkCount, generateChunkFaces } from '@use-gpu/core';
import { useBoundStorage } from '../hooks/useBoundStorage';

type FaceSegmentsProps = {
  chunks?: number[],
  loops?: boolean[],

  render?: (segments: StorageSource) => LiveElement<any>,
};

export const FaceSegments: LiveComponent<FaceSegmentsProps> = memo((
  props: FaceSegmentsProps,
) => {
  const {chunks, loops, render} = props;
  if (!chunks) return null;
  
  const count = getChunkCount(chunks, loops);

  // Make index data for face segments data
  const segmentBuffer = useMemo(() => {
    const segmentBuffer = new Int32Array(count);

    generateChunkFaces(segmentBuffer, chunks, loops);
    console.log({segmentBuffer})

    return segmentBuffer;
  }, [chunks, loops, count]);

  // Bind as shader storage
  const segments = useBoundStorage(segmentBuffer, 'i32');

  return render ? render(segments) : yeet(segments);
}, 'FaceSegments');
