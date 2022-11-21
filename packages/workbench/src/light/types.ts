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
  
  id?: number,
  shadowType?: 'ortho',
  shadowMap?: number,
  shadowUV?: TypedArray | number[],
};

export type ShadowMapLike = {
  size?: VectorLike,
  depth?: VectorLike,
  span?: VectorLike,
  up?: VectorLike,
};
