import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { ColorLike, VectorLike } from '../traits/types';

import { useMemo } from '@use-gpu/live';

import { useLightConsumer } from './lights';
import { useTransformContext } from '../providers/transform-provider';

import { parseColor, parseNumber, parseMatrix, parsePosition } from '../traits/parse';
import { useProp } from '../traits/useProp';

export type PointLightProps = {
  position?: VectorLike,
  scale?: number,
  color?: ColorLike,
  intensity?: number,
};

export const PointLight = (props: PointLightProps) => {
  
  const position = useProp(props.position, parsePosition);
  const scale = useProp(props.scale, parseNumber, -1);
  const color = useProp(props.color, parseColor);
  const intensity = useProp(props.intensity, parseNumber, 1);

  const transform = useTransformContext();

  const light = useMemo(() => ({
    kind: 2,
    position,
    size: [scale, 0, 0, 0],
    color,
    intensity,
    transform,
  }), [position, scale, color, intensity]);

  useLightConsumer(light);
};
