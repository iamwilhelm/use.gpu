import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ColorLike, VectorLike } from '@use-gpu/traits';
import { parseColor, parseNumber, parsePosition, useProp } from '@use-gpu/traits';

import { useMemo } from '@use-gpu/live';

import { useLightCapture } from './lights';
import { useTransformContext, useDifferentialContext } from '../providers/transform-provider';

import { vec3 } from 'gl-matrix';

export type DirectionalLightProps = {
  position?: VectorLike,
  color?: ColorLike,
  intensity?: number,
};

const DEFAULT_DIRECTION = vec3.fromValues(1, 3, 2);

export const DirectionalLight = (props: DirectionalLightProps) => {
  
  const position = useProp(props.position, parsePosition, DEFAULT_DIRECTION);
  const color = useProp(props.color, parseColor);
  const intensity = useProp(props.intensity, parseNumber, 1);

  const transform = useTransformContext();
  const differential = useDifferentialContext();

  const light = useMemo(() => ({
    kind: 1,
    position,
    normal: [-position[0], -position[1], -position[2], 0],
    color,
    intensity,
    transform,
    differential,
  }), [position, color, intensity, transform, differential]);

  useLightCapture(light);
  return null;
};
