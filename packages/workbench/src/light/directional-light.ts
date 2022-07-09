import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { ColorLike, VectorLike } from '../traits/types';

import { useMemo } from '@use-gpu/live';

import { useLightConsumer } from './lights';
import { useTransformContext } from '../providers/transform-provider';

import { parseColor, parseNumber, parsePosition } from '../traits/parse';
import { useProp } from '../traits/useProp';

export type DirectionalLightProps = {
  position?: VectorLike,
  scale?: number,
  color?: ColorLike,
  intensity?: number,
};

export const DirectionalLight = (props: DirectionalLightProps) => {
  
  const position = useProp(props.position, parsePosition);
  const color = useProp(props.color, parseColor);
  const intensity = useProp(props.intensity, parseNumber, 1);

  const transform = useTransformContext();

  const light = useMemo(() => ({
    kind: 1,
    position,
    normal: [-position[0], -position[1], -position[2], 0],
    color,
    intensity,
    transform,
  }), [position, color, intensity]);

  useLightConsumer(light);
};
