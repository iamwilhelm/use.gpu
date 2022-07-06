import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { StorageSource } from '@use-gpu/core/types';

import { memo, yeet, useMemo } from '@use-gpu/live';
import { getChunkCount, generateChunkFaces } from '@use-gpu/core';
import { useRawSource } from '../hooks/useRawSource';

type FaceSegmentsProps = {
  chunks?: number[],
  loops?: boolean[],

  render?: (segments: StorageSource, lookups: StorageSource) => LiveElement<any>,
};

export const FaceSegments: LiveComponent<FaceSegmentsProps> = memo((
  props: FaceSegmentsProps,
) => {
  const {chunks, loops, render} = props;
  if (!chunks) return null;
  
  const count = getChunkCount(chunks, loops);

  // Make segment/lookup data for face segments data
  const [segmentBuffer, lookupBuffer] = useMemo(() => {
    const segmentBuffer = new Int32Array(count);
    const lookupBuffer = new Uint32Array(count);

    generateChunkFaces(segmentBuffer, lookupBuffer, chunks, loops);

    return [segmentBuffer, lookupBuffer];
  }, [chunks, loops, count]);

  // Bind as shader storage
  const segments = useRawSource(segmentBuffer, 'i32');
  const lookups = useRawSource(lookupBuffer, 'u32');

  return render ? render(segments, lookups) : yeet([segments, lookups]);
}, 'FaceSegments');
