import type { LiveComponent, PropsWithChildren, DeferredCall } from '@use-gpu/live';
import type { Swizzle } from '../types';
import type { TraitProps } from '@use-gpu/traits';

import { trait, combine, makeUseTrait } from '@use-gpu/traits/live';
import { parseMatrix, parsePosition, parseRotation, parseQuaternion, parseScale } from '@use-gpu/parse';
import { use, provide, useContext, useDouble, useOne, useMemo } from '@use-gpu/live';
import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';
import { MatrixContext, TransformContext, useCombinedMatrixTransform, useCombinedMatrix, useNoCombinedMatrix, QueueReconciler } from '@use-gpu/workbench';

import { RangeContext } from '../providers/range-provider';
import { composeTransform } from '../util/compose';
import { swizzleMatrix } from '../util/swizzle';
import { mat4 } from 'gl-matrix';

import { AxesTrait, ObjectTrait } from '../traits';

import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';
import { getMatrixDifferential } from '@use-gpu/wgsl/transform/diff-matrix.wgsl';

const {signal} = QueueReconciler;

const MATRIX_BINDINGS = bundleToAttributes(getCartesianPosition);
const makeMat4 = () => mat4.create();

const Traits = combine(AxesTrait, ObjectTrait);
const useTraits = makeUseTrait(Traits);

export type TransformProps = TraitProps<typeof Traits>;

export const Transform: LiveComponent<TransformProps> = (props: PropsWithChildren<TransformProps>) => {
  const {
    children,
  } = props;

  if (!children) return;

  const {
    axes: a,
    position: p, scale: s, quaternion: q, rotation: r, matrix: m,
  } = useTraits(props);

  const [swapMatrix] = useDouble(makeMat4);
  const composed = useOne(makeMat4);

  const matrix = useMemo(() => {

    const matrix = swapMatrix();

    // Swizzle output axes (and reinitialize matrix)
    swizzleMatrix(matrix, a);

    // Then apply transform (so these are always relative to the world basis, not the internal basis)
    if (m) {
      mat4.multiply(matrix, m, matrix);
    }
    if (p || r || q || s) {
      composeTransform(composed, p, r, q, s);
      mat4.multiply(matrix, composed, matrix);
    }

    return matrix;
  }, [a, p, r, q, s, m]);

  const isArray = Array.isArray(children)
  const nested = isArray ? !children.find(c => (c as DeferredCall<any>).f !== Transform) : (children as DeferredCall<any>).f === Transform;

  if (nested) {
    const combined = useCombinedMatrix(matrix);
    return provide(MatrixContext, combined, children);
  }
  else {
    useNoCombinedMatrix();
    const [context, combined] = useCombinedMatrixTransform(matrix);

    return [
      signal(),
      provide(MatrixContext, combined,
        provide(TransformContext, context, children),
      ),
    ];
  }
};
