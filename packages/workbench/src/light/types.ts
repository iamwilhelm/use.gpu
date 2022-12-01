import type { VectorLike } from '@use-gpu/traits';
import type { TypedArray } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

export type Light = {
  into?: TypedArray | number[],
  position?: TypedArray | number[],
  normal?: TypedArray | number[],
  color?: TypedArray | number[],
  opts?: TypedArray | number[],
  intensity?: number,
  kind: number,
  
  shadow?: ShadowMapLike | null,
};

export type BoundLight = Light & {
  id?: number,
  shadowType?: 'ortho',
  shadowMap?: number,
  shadowUV?: TypedArray | number[],
  shadowBias?: TypedArray | number[],
};

export type ShadowMapLike = {
  size?: VectorLike,
  depth?: VectorLike,
  bias?: VectorLike,
  span?: VectorLike,
  up?: VectorLike,
  blur?: number,
};
