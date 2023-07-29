import type { LC } from '@use-gpu/live';
import type { StorageSource, TypedArray } from '@use-gpu/core';

import { memo, use, useMemo } from '@use-gpu/live';
import { useRawSource } from '../hooks/useRawSource';
import { ArrowSegments } from '../layers/arrow-segments';
import { ArrowLayer } from '../layers/arrow-layer';

type VectorHelperProps = {
  position?: number[] | TypedArray,
  tangent?: number[] | TypedArray,
  color?: number[] | TypedArray,
  width?: number,
  length?: number,
};

type AABBHelperProps = {
  matrix?: number[] | TypedArray,
  min?: number[] | TypedArray,
  max?: number[] | TypedArray,
  color?: number[] | TypedArray,
  width?: number,
};

const CHUNKS = [2];
const ENDS   = [true];

const EMPTY: any[] = [];

export const VectorHelper: LC<VectorHelperProps> = memo((props: VectorHelperProps) => {
  const {
    position = EMPTY,
    tangent = EMPTY,
    length = 1,
    color = [1, 0.75, 0.5, 1],
    width = 3,
  } = props;

  const ps = useMemo(() => {
    const [tx = 0, ty = 0, tz = 0] = tangent;
    const tl = length / Math.sqrt(tx*tx + ty*ty + tz*tz);

    const p = [position[0] || 0, position[1] || 0, position[2] || 0, 1];
    const q = [
      (position[0] || 0) + tx * tl,
      (position[1] || 0) + ty * tl,
      (position[2] || 0) + tz * tl,
      1
    ];
    return new Float32Array([...p, ...q]);
  }, [position, tangent, length]);

  const positions = useRawSource(ps, 'vec4<f32>');

  return use(ArrowSegments, {
    chunks: CHUNKS,
    ends: ENDS,
    render: (segments: StorageSource, anchors: StorageSource, trims: StorageSource) => 
      use(ArrowLayer, { positions, segments, anchors, trims, color, width })
  });
}, 'VectorHelper');
