import type { ShaderModule } from '@use-gpu/shader';
import { makeContext, useContext, useNoContext } from '@use-gpu/live';
import { vec4 } from 'gl-matrix';

export type TransformContextProps = ShaderModule | null;
export type DifferentialContextProps = ShaderModule | null;

const DEFAULT_TRANSFORM = null;

export const TransformContext = makeContext<TransformContextProps>(DEFAULT_TRANSFORM, 'TransformContext');
export const DifferentialContext = makeContext<DifferentialContextProps>(DEFAULT_TRANSFORM, 'DifferentialContext');

export const useTransformContext = () => useContext(TransformContext);
export const useDifferentialContext = () => useContext(DifferentialContext);

export const useNoTransformContext = () => useNoContext(TransformContext);
export const useNoDifferentialContext = () => useNoContext(DifferentialContext);
