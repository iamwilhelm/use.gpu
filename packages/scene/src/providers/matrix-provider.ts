import type { ShaderModule } from '@use-gpu/shader';
import { makeContext, useContext, useNoContext } from '@use-gpu/live';
import { mat4 } from 'gl-matrix';

export type MatrixContextProps = mat4;

const DEFAULT_MATRIX = mat4.create();

export const MatrixContext = makeContext<MatrixContextProps>(DEFAULT_MATRIX, 'MatrixContext');

export const useMatrixContext = () => useContext(MatrixContext);
export const useNoMatrixContext = () => useNoContext(MatrixContext);
