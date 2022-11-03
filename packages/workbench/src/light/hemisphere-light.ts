import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ColorLike, VectorLike } from '@use-gpu/traits';
import { parseColor, parseNumber, parsePosition, useProp } from '@use-gpu/traits';

import { useMemo } from '@use-gpu/live';

import { useLightCapture } from './lights';
import { useTransformContext } from '../providers/transform-provider';

import { vec3 } from 'gl-matrix';

export type HemisphereLightProps = {
  position?: VectorLike,
  scale?: number,
  horizon?: ColorLike,
  zenith?: ColorLike,
  intensity?: number,
  bleed?: number,
};

const DEFAULT_DIRECTION = vec3.fromValues(0, 1, 0);

export const HemisphereLight = (props: HemisphereLightProps) => {
  
  const position = useProp(props.position, parsePosition, DEFAULT_DIRECTION);
  const horizon = useProp(props.horizon, parseColor, [1, 1, 1, 1]);
  const zenith = useProp(props.zenith, parseColor, [.5, .5, .5, 1]);

  const intensity = useProp(props.intensity, parseNumber, 1);
  const bleed = useProp(props.bleed, parseNumber, 0.25);

  const {transform, differential} = useTransformContext();

  const light = useMemo(() => ({
    kind: 3,
    position,
    normal: [-position[0], -position[1], -position[2], bleed],
    color: zenith,
    opts: horizon,
    intensity,
    transform,
    differential,
  }), [position, zenith, horizon, intensity, transform, differential]);

  useLightCapture(light);
  return null;
};
