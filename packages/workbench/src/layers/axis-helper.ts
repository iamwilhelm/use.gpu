import type { LiveComponent } from '@use-gpu/live';
import { memo, use, useOne } from '@use-gpu/live';

import { ArrowSegments } from './arrow-segments';
import { ArrowLayer } from './arrow-layer';

import { useRawSource } from '../hooks/useRawSource';

export type AxisHelperProps = {
  size?: number,
};

const COLORS = new Float32Array([
  1, 0, 0, 1,
  1, 0, 0, 1,
  0, 1, 0, 1,
  0, 1, 0, 1,
  0, 0, 1, 1,
  0, 0, 1, 1,
]);

const CHUNKS = [2, 2, 2];
const ENDS   = [true, true, true];

/** Draws XYZ axis helper. */
export const AxisHelper: LiveComponent<AxisHelperProps> = memo((props: AxisHelperProps) => {
  const {
    width = 1,
    size = 1,
    depth = 0,
  } = props;

  const vertices = useOne(() => new Float32Array([
    0, 0, 0, 1,
    size, 0, 0, 1,
    0, 0, 0, 1,
    0, size, 0, 1,
    0, 0, 0, 1,
    0, 0, size, 1,
  ]), size);

  const positions = useRawSource(vertices, 'vec4<f32>');
  const colors    = useRawSource(COLORS, 'vec4<f32>');

  return use(ArrowSegments, {
    chunks: CHUNKS,
    ends: ENDS,
    render: (segments, anchors, trims) => 
      use(ArrowLayer, {positions, colors, width, depth, segments, anchors, trims})
  });
}, 'AxisHelper');
