import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ColorLike, VectorLike } from '@use-gpu/traits';
import { parseColor, parseNumber, parsePosition, useProp } from '@use-gpu/traits';

import { memo, useMemo } from '@use-gpu/live';

import { useLightContext } from '../providers/light-provider';
import { useMatrixContext } from '../providers/matrix-provider';

import { vec3, vec4 } from 'gl-matrix';

export type HemisphereLightProps = {
  direction?: VectorLike,
  horizon?: ColorLike,
  zenith?: ColorLike,
  intensity?: number,
  bleed?: number,
};

const DEFAULT_DIRECTION = vec3.fromValues(0, 1, 0);

export const HemisphereLight = memo((props: HemisphereLightProps) => {
  
  const direction = useProp(props.direction, parsePosition, DEFAULT_DIRECTION);
  const horizon = useProp(props.horizon, parseColor, [1, 1, 1, 1]);
  const zenith = useProp(props.zenith, parseColor, [.5, .5, .5, 1]);

  const intensity = useProp(props.intensity, parseNumber, 1);
  const bleed = useProp(props.bleed, parseNumber, 0.25);

  const parent = useMatrixContext();

  const light = useMemo(() => {
    const normal = vec4.clone(direction);
    if (parent) {
      normal[3] = 0;
      vec3.transformMat4(normal, normal, parent);
    }
    normal[3] = bleed;

    return {
      kind: 3,
      normal,
      color: zenith,
      opts: horizon,
      intensity,
    };
  }, [direction, zenith, horizon, intensity, parent]);

  const {useLight} = useLightContext();
  useLight(light);

  return null;
}, 'HemisphereLight');
