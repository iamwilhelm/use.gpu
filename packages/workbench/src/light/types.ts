import type { VectorLike } from '@use-gpu/traits';
import type { TypedArray } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

export type Light = {
  kind: number,
  position?: TypedArray | number[],
  normal?: TypedArray | number[],
  tangent?: TypedArray | number[],
  size?: TypedArray | number[],
  color?: TypedArray | number[],
  opts?: TypedArray | number[],
  intensity?: number,
  transform?: ShaderModule | null,
  differential?: ShaderModule | null,
  shadowMap?: ShadowMapLike | null,
};

export type ShadowMapLike = {
  size?: VectorLike,
  depth?: VectorLike,
  span?: VectorLike,
  up?: VectorLike,
};
