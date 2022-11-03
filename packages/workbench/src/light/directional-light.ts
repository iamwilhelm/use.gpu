import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ColorLike, VectorLike } from '@use-gpu/traits';
import type { ShadowMapProps } from './types';
import { optional, parseColor, parseNumber, parsePosition, parseVec2, parseVec3, useProp } from '@use-gpu/traits';

import { useMemo, useOne } from '@use-gpu/live';

import { useLightCapture } from './lights';
import { useTransformContext } from '../providers/transform-provider';
import { useMatrixContext } from '../providers/matrix-provider';

import { mat4, vec3, vec4 } from 'gl-matrix';

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

const parseOptionalPosition = optional(parsePosition);

export const DirectionalLight = (props: DirectionalLightProps) => {
  
  const position = useProp(props.position, parsePosition, DEFAULT_DIRECTION);
  const direction = useProp(props.direction, parseOptionalPosition);

  const color = useProp(props.color, parseColor);
  const intensity = useProp(props.intensity, parseNumber, 1);

  const normal = useOne(() =>
    direction ?? [-position[0], -position[1], -position[2]],
    direction ?? position
  );
  
  const {shadowMap} = props;

  const parent = useMatrixContext();

  const [tangent, shadow] = useMemo(() => {
    if (!shadowMap) return [null, null];

    const size  = parseVec2(shadowMap.size,  DEFAULT_SHADOW_MAP.size);
    const depth = parseVec2(shadowMap.depth, DEFAULT_SHADOW_MAP.depth);
    const span  = parseVec2(shadowMap.span,  DEFAULT_SHADOW_MAP.span);
    const up    = parseVec3(shadowMap.up,    DEFAULT_SHADOW_MAP.up);

    const matrix = mat4.create();
    
    const tangent = vec3.create();
    const bitangent = vec3.create();
    vec3.cross(tangent, normal, up);
    vec3.normalize(tangent, tangent);
    vec3.cross(bitangent, normal, tangent);
    matrix.set(
      tangent[0], tangent[1], tangent[2], 0.0,
      bitangent[0], bitangent[1], bitangent[2], 0.0,
      normal[0], normal[1], normal[2], 0.0,
      position[0], position[1], position[2], 1.0,
    );

    if (parent) mat4.multiply(matrix, parent, matrix);

    const shadow = {
      size,
      depth,
      matrix,
    };
    return [tangent, shadow];
  }, [normal, shadowMap, parent]);

  const {transform, differential} = useTransformContext();

  const light = useMemo(() => {
    let p, n, t;
    if (parent) {
      p = vec4.clone(position);
      n = vec4.clone(normal);
      t = vec4.clone(tangent);
      p[3] = 1;
      n[3] = 0;
      t[3] = 0;

      vec4.transformMat4(p, parent);
      vec4.transformMat4(n, parent);
      vec4.transformMat4(t, parent);
    }
    
    return {
      kind: 1,
      position: p ?? position,
      normal: n ?? normal,
      tangent: t ?? tangent,
      color,
      intensity,
      transform,
      differential,
      shadow,
    };
  }, [position, normal, tangent, color, intensity, transform, differential, shadow, parent]);

  useLightCapture(light);
  return null;
};
