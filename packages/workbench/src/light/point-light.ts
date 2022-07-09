import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { UniformAttributeValue } from '@use-gpu/core/types';
import { VectorLike } from '../traits/types';

import { use, provide, useConsumer, useOne, useMemo } from '@use-gpu/live';
import { makeRefBinding } from '@use-gpu/core';
import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';

import { useLightConsumer } from '../providers/light-provider';
import { useTransformContext } from '../providers/transform-provider';
import { vec4 } from 'gl-matrix';

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
  const scale = useProp(props.scale, parseNumber);
  const color = useProp(props.color, parseColor);
  const intensity = useProp(props.intensity, parseNumber);

  const transform = useTransformContext();

  const light = useMemo(() => ({
    kind: 2,
    position,
    normal: [1, 0, 0, 0],
    tangent: [0, 1, 0, 0],
    size: [scale, scale, scale, 1],
    color,
    intensity: 1,
    transform,
  }), [position, scale, color, intensity]);

  useLightConsumer(light);
};
