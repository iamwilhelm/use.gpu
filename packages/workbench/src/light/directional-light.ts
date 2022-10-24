import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ColorLike, VectorLike } from '@use-gpu/traits';
import type { ShadowMapProps } from './types';
import { parseColor, parseNumber, parsePosition, parseVec2, parseVec3, useProp } from '@use-gpu/traits';

import { useMemo, useOne } from '@use-gpu/live';

import { useLightCapture } from './lights';
import { useTransformContext, useDifferentialContext } from '../providers/transform-provider';

import { mat4, vec3 } from 'gl-matrix';

export type DirectionalLightProps = {
  position?: VectorLike,
  direction?: VectorLike,
  color?: ColorLike,
  intensity?: number,
  shadowMap?: ShadowMapLike,
};

const DEFAULT_DIRECTION = vec3.fromValues(1, 3, 2);

const DEFAULT_SHADOW_MAP = {
  size: [1024, 1024],
  depth: [0.1, 1000],
  span: [1000, 1000],
  up: [0, 1, 0],
};

export const DirectionalLight = (props: DirectionalLightProps) => {
  
  const position = useProp(props.position, parsePosition, DEFAULT_DIRECTION);
  const direction = useProp(props.direction, parseVec3);

  const color = useProp(props.color, parseColor);
  const intensity = useProp(props.intensity, parseNumber, 1);

  const normal = useOne(() =>
    direction ?? [-position[0], -position[1], -position[2], 0],
    direction ?? position
  );
  
  const {shadowMap} = props;

  const [tangent, shadow] = useMemo(() => {
    if (!shadowMap) return [null, null];

    const size  = parseVec2(shadowMap.size,  DEFAULT_SHADOW_MAP.size);
    const depth = parseVec2(shadowMap.depth, DEFAULT_SHADOW_MAP.depth);
    const span  = parseVec2(shadowMap.span,  DEFAULT_SHADOW_MAP.span);
    const up    = parseVec3(shadowMap.up,    DEFAULT_SHADOW_MAP.up);

    const transform = mat4.create();
    
    const tangent = vec3.create();
    const bitangent = vec3.create();
    vec3.cross(tangent, normal, up);
    vec3.normalize(tangent, tangent);
    vec3.cross(bitangent, normal, tangent);
    m.set(
      tangent[0], tangent[1], tangent[2], 0.0,
      bitangent[0], bitangent[1], bitangent[2], 0.0,
      normal[0], normal[1], normal[2], 0.0,
      position[0], position[1], position[2], 1.0,
    );

    const shadow = {
      size,
      depth,
      transform,
    };
    return [tangent, shadow];
  }, [normal, shadowMap]);

  const transform = useTransformContext();
  const differential = useDifferentialContext();

  const light = useMemo(() => ({
    kind: 1,
    position,
    normal,
    tangent,
    color,
    intensity,
    transform,
    differential,
    shadow,
  }), [position, normal, tangent, color, intensity, transform, differential, shadow]);

  useLightCapture(light);
  return null;
};
