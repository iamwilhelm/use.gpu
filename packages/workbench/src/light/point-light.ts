import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { ColorLike, VectorLike } from '@use-gpu/traits/types';
import { parseColor, parseNumber, parseMatrix, parsePosition, useProp } from '@use-gpu/traits';

import { useMemo } from '@use-gpu/live';

import { useLightConsumer } from './lights';
import { useTransformContext } from '../providers/transform-provider';

export type PointLightProps = {
  position?: VectorLike,
  size?: number,
  color?: ColorLike,
  intensity?: number,
};

export const PointLight: LiveComponent<PointLightProps> = (props: PointLightProps) => {
  
  const position = useProp(props.position, parsePosition);
  const size = useProp(props.size, parseNumber, -1);
  const color = useProp(props.color, parseColor);
  const intensity = useProp(props.intensity, parseNumber, 1);

  const transform = useTransformContext();

  const light = useMemo(() => ({
    kind: 2,
    position,
    size: [size, 0, 0, 0],
    color,
    intensity,
    transform,
  }), [position, size, color, intensity]);

  useLightConsumer(light);
  return null;
};
