import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ColorLike, VectorLike } from '@use-gpu/traits';
import { parseColor, parseNumber, parseMatrix, parsePosition, useProp } from '@use-gpu/traits';

import { memo, useMemo } from '@use-gpu/live';

import { useLightContext } from '../providers/light-provider';
import { useMatrixContext } from '../providers/matrix-provider';

import { vec3, vec4 } from 'gl-matrix';

export type PointLightProps = {
  position?: VectorLike,
  color?: ColorLike,
  intensity?: number,
};

export const PointLight: LiveComponent<PointLightProps> = memo((props: PointLightProps) => {
  
  const position = useProp(props.position, parsePosition);
  const color = useProp(props.color, parseColor);
  const intensity = useProp(props.intensity, parseNumber, 1);

  const parent = useMatrixContext();

  const light = useMemo(() => {
    const p = vec4.clone(position);
    if (parent) vec3.transformMat4(p, p, parent);
    p[3] = 1;

    return {
      kind: 2,
      position: p,
      color,
      intensity,
    };
  }, [position, color, intensity, parent]);

  const {useLight} = useLightContext();
  useLight(light);

  return null;
}, 'PointLight');
