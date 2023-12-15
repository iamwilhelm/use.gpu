import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource } from '@use-gpu/core';

import { memo, yeet, useMemo } from '@use-gpu/live';
import { accumulateChunks, generateChunkSegments2, generateChunkAnchors2, alignSizeTo2 } from '@use-gpu/core';
import { useRawSource } from '../hooks/useRawSource';

export type ArrowSegmentsProps = {
  chunks?: number[],
  loops?: boolean[],
  starts?: boolean[],
  ends?: boolean[],

  render?: (segments: StorageSource, anchors: StorageSource, trim: StorageSource) => LiveElement,
};

/** Produces `segments`, `anchors`, `trims` composite data for `@{ArrowLayer}`. */
export const ArrowSegments: LiveComponent<ArrowSegmentsProps> = memo((
  props: ArrowSegmentsProps,
) => {
  const {chunks, loops, starts, ends, render} = props;
  if (!chunks) return null;

  const {segments, anchors, trims} = useArrowSegmentsSource(chunks, loops, starts, ends);
  return render ? render(segments, anchors, trims) : yeet([segments, anchors, trims]);
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

    const segments = new Int8Array(alignSizeTo2(count, 4));
    const anchors = new Uint32Array(count * 4);
    const trims = new Uint32Array(count * 4);
    const slices = new Uint32Array(chunks.length);
    const unwelds = loops ? new Uint16Array(alignSizeTo2(count, 2)) : undefined;

    generateChunkSegments2(segments, slices, unwelds, chunks, loops, starts, ends);
    const sparse = generateChunkAnchors2(anchors, trims, chunks, loops, starts, ends);

    return {
      count,
      sparse,
      segments,
      anchors,
      trims,
      slices,
      unwelds,
    };
  }, [chunks, loops, starts, ends]);
}

export const useArrowSegmentsSource = (
  chunks: number[] | TypedArray,
  loops: boolean[] | boolean = false,
  starts: boolean[] | boolean = false,
  ends: boolean[] | boolean = false,
) => {
  const {count, sparse, segments, anchors, trims, slices} = useArrowSegments(chunks, loops, starts, ends);

  // Bind as shader storage
  const s = useRawSource(segments, 'i8');
  const a = useRawSource(anchors, 'vec4<u32>');
  const t = useRawSource(trims, 'vec4<u32>');

  a.length = sparse;
  a.size[0] = sparse;

  return {
    count,
    sparse,
    segments: s,
    anchors: a,
    trims: t,
  };
}
