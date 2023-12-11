import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { UniformAttributeValue, VectorLike } from '@use-gpu/core';
import type { Swizzle } from '../types';
import type { TraitProps } from '@use-gpu/traits';

import { trait, combine, makeUseTrait } from '@use-gpu/traits/live';
import { parseMatrix, parsePosition, parseRotation, parseQuaternion, parseScale } from '@use-gpu/parse';
import { use, provide, signal, useContext, useOne, useMemo } from '@use-gpu/live';
import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';
import {
  TransformContext,
  useShaderRef, useBoundShader, useBoundSource, useCombinedTransform,
} from '@use-gpu/workbench';

import { RangeContext } from '../providers/range-provider';
import { composeTransform } from '../util/compose';
import { swizzleMatrix } from '../util/swizzle';
import { mat3, mat4 } from 'gl-matrix';

import { AxesTrait, ObjectTrait } from '../traits';

import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';
import { getMatrixDifferential } from '@use-gpu/wgsl/transform/diff-matrix.wgsl';

const MATRIX_BINDINGS = bundleToAttributes(getCartesianPosition);

const Traits = combine(AxesTrait, ObjectTrait);
const useTraits = makeUseTrait(Traits);

export type TransformProps = TraitProps<typeof Traits>;

export const Transform: LiveComponent<TransformProps> = (props: PropsWithChildren<TransformProps>) => {
  const {
    children,
  } = props;

  const {
    axes: a,
    position: p, scale: s, quaternion: q, rotation: r, matrix: m,
  } = useTraits(props);

  const [matrix, normalMatrix] = useMemo(() => {

    const matrix = mat4.create();

    // Swizzle output axes
    if (a !== 'xyzw') {
      const t = mat4.create();
      swizzleMatrix(t, a);
      mat4.multiply(matrix, t, matrix);
    }

    // Then apply transform (so these are always relative to the world basis, not the internal basis)
    if (m) {
      mat4.multiply(matrix, m, matrix);
    }
    if (p || r || q || s) {
      const t = mat4.create();
      composeTransform(t, p, r, q, s);
      mat4.multiply(matrix, t, matrix);
    }

    const normalMatrix = mat3.normalFromMat4(mat3.create(), matrix);

    return [matrix, normalMatrix];
  }, [a, p, r, q, s, m]);

  const matrixRef = useShaderRef(matrix);
  const normalMatrixRef = useShaderRef(normalMatrix);

  const boundMatrix = useBoundSource(MATRIX_BINDINGS[0], matrixRef);
  const boundPosition = useBoundShader(getCartesianPosition, [boundMatrix]);
  const boundDifferential = useBoundShader(getMatrixDifferential, [boundMatrix, normalMatrixRef]);

  const context = useCombinedTransform(boundPosition, boundDifferential);

  return [
    signal(),
    provide(TransformContext, context, children ?? []),
  ];
};


