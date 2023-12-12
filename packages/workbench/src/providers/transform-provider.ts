import type { ShaderModule } from '@use-gpu/shader';
import type { DataBounds } from '@use-gpu/core';
import { makeContext, useContext, useNoContext } from '@use-gpu/live';
import { mat4, vec4 } from 'gl-matrix';

export type TransformBounds = (bounds: DataBounds) => DataBounds;

export type TransformContextProps = {
  key: number,
  matrix: mat4 | null,
  normalMatrix: mat4 | null,
  transform: ShaderModule | null,
  differential: ShaderModule | null,
  bounds: TransformBounds,
};

export const DEFAULT_TRANSFORM = {
  key: 0,
  matrix: null,
  normalMatrix: null,
  transform: null,
  differential: null,
  bounds: (b: DataBounds) => b,
};

export const TransformContext = makeContext<TransformContextProps>(DEFAULT_TRANSFORM, 'TransformContext');

export const useTransformContext = () => useContext(TransformContext);
export const useNoTransformContext = () => useNoContext(TransformContext);
