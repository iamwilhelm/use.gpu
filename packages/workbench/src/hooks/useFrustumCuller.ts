import type { DataBounds, ViewUniforms } from '@use-gpu/core';
import type { RefObject } from '@use-gpu/live';

import { useCallback, useNoCallback } from '@use-gpu/live';
import { distanceToFrustum } from '@use-gpu/core';
import { mat4 } from 'gl-matrix';

const sqr = (x: number) => x * x;

export const useFrustumCuller = (
  positionRef: RefObject<vec4>,
  frustumRef: RefObject<mat4>,
) => useCallback((bounds: DataBounds) => {
  const {center, radius} = bounds;
  const {current: frustum} = frustumRef;

  const [x, y, z = 0] = center;
  const d = distanceToFrustum(frustum, x, y, z);

  if (d < -radius) return false;

  const {current: position} = positionRef;
  return sqr(position[0] - x) + sqr(position[1] - y) + sqr(position[2] - z);
}, [positionRef, frustumRef]);

export const useNoFrustumCuller = useNoCallback;

