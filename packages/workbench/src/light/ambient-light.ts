import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ColorLike, VectorLike } from '@use-gpu/traits';
import { parseColor, parseNumber, useProp } from '@use-gpu/traits';

import { useMemo } from '@use-gpu/live';

import { useLightCapture } from './lights';
import { useTransformContext } from '../providers/transform-provider';

export type AmbientLightProps = {
  color?: ColorLike,
  intensity?: number,
};

export const AmbientLight = (props: AmbientLightProps) => {
  
  const color = useProp(props.color, parseColor);
  const intensity = useProp(props.intensity, parseNumber, 1);

  const {transform, differential} = useTransformContext();

  const light = useMemo(() => ({
    kind: 0,
    position: [0, 0, 0, 0],
    color,
    intensity,
    transform,
    differential,
  }), [color, intensity, transform, differential]);

  useLightCapture(light);
  return null;
};
