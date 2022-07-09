import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { ColorLike, VectorLike } from '../traits/types';

import { useMemo } from '@use-gpu/live';

import { useLightConsumer } from './lights';
import { useTransformContext } from '../providers/transform-provider';

import { parseColor, parseNumber } from '../traits/parse';
import { useProp } from '../traits/useProp';

export type AmbientLightProps = {
  color?: ColorLike,
  intensity?: number,
};

export const AmbientLight = (props: AmbientLightProps) => {
  
  const color = useProp(props.color, parseColor);
  const intensity = useProp(props.intensity, parseNumber, 1);

  const transform = useTransformContext();

  const light = useMemo(() => ({
    kind: 0,
    position: [0, 0, 0, 0],
    color,
    intensity,
    transform,
  }), [color, intensity]);

  useLightConsumer(light);
  return null;
};
