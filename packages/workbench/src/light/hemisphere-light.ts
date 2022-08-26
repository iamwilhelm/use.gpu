import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ColorLike, VectorLike } from '@use-gpu/traits';
import { parseColor, parseNumber, parsePosition, useProp } from '@use-gpu/traits';

import { useMemo } from '@use-gpu/live';

import { useLightCapture } from './lights';
import { useTransformContext, useDifferentialContext } from '../providers/transform-provider';

export type HemisphereLightProps = {
  position?: VectorLike,
  scale?: number,
  horizon?: ColorLike,
  zenith?: ColorLike,
  intensity?: number,
};

const DEFAULT_DIRECTION = [0, 1, 0, 1];

export const HemisphereLight = (props: HemisphereLightProps) => {
  
  const position = useProp(props.position, parsePosition, DEFAULT_DIRECTION);
  const horizon = useProp(props.horizon, parseColor, [.100, .125, 1, 1]);
  const zenith = useProp(props.zenith, parseColor, [.2, .25, 1, 1]);
  const intensity = useProp(props.intensity, parseNumber, 1);

  const transform = useTransformContext();
  const differential = useDifferentialContext();

  const light = useMemo(() => ({
    kind: 3,
    position,
    normal: [-position[0], -position[1], -position[2], 0],
    color: zenith,
    opts: horizon,
    intensity,
    transform,
    differential,
  }), [position, zenith, horizon, intensity, transform, differential]);

  useLightCapture(light);
  return null;
};
