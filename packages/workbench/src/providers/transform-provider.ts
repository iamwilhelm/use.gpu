import type { ShaderModule } from '@use-gpu/shader';
import type { DataBounds } from '@use-gpu/core';
import { makeContext, useContext, useNoContext } from '@use-gpu/live';
import { mat4, vec4 } from 'gl-matrix';

export type TransformBounds = (bounds: DataBounds) => DataBounds;

export type TransformContextProps = {
  key: number,
  transform: ShaderModule | null,
  differential: ShaderModule | null,
  bounds: TransformBounds,

  matrix?: TransformContextProps,
};

export const DEFAULT_TRANSFORM = {
  key: 0,
  transform: null,
  differential: null,
  bounds: (b: DataBounds) => b,
};

export const TransformContext = makeContext<TransformContextProps>(DEFAULT_TRANSFORM, 'TransformContext');

export const useTransformContext = () => useContext(TransformContext);
export const useNoTransformContext = () => useNoContext(TransformContext);
