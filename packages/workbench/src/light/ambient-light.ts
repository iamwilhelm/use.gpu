import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { UniformAttributeValue } from '@use-gpu/core/types';
import { VectorLike } from '../traits/types';

import { use, provide, useConsumer, useOne, useMemo } from '@use-gpu/live';
import { makeRefBinding } from '@use-gpu/core';
import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';

import { useLightConsumer } from './lights';
import { useTransformContext } from '../providers/transform-provider';
import { vec4 } from 'gl-matrix';

import { parseColor, parseNumber, parseMatrix, parsePosition } from '../traits/parse';
import { useProp } from '../traits/useProp';

export type AmbientLightProps = {
  color?: ColorLike,
  intensity?: number,
};

export const AmbientLight = (props: PointLightProps) => {
  
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
};
