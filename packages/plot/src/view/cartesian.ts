import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { UniformAttributeValue, VectorLike } from '@use-gpu/core';
import type { Swizzle } from '../types';
import type { TraitProps } from '@use-gpu/traits';

import { trait, combine, makeUseTrait } from '@use-gpu/traits/live';
import { parseMatrix, parsePosition, parseRotation, parseQuaternion, parseScale } from '@use-gpu/parse';
import { use, provide, signal, useContext, useOne, useMemo } from '@use-gpu/live';
import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';
import {
  TransformContext, useCombinedMatrixTransform,
} from '@use-gpu/workbench';

import { RangeContext } from '../providers/range-provider';
import { composeTransform } from '../util/compose';
import { swizzleMatrix } from '../util/swizzle';
import { mat4 } from 'gl-matrix';

import { AxesTrait, ObjectTrait } from '../traits';

const Traits = combine(AxesTrait, ObjectTrait);
const useTraits = makeUseTrait(Traits);

export type CartesianProps = TraitProps<typeof Traits>;

export const Cartesian: LiveComponent<CartesianProps> = (props: PropsWithChildren<CartesianProps>) => {
  const {
    children,
  } = props;

  const {
    range: g, axes: a,
    position: p, scale: s, quaternion: q, rotation: r, matrix: m,
  } = useTraits(props);

  const matrix = useMemo(() => {
    const x = g[0][0];
    const y = g[1][0];
    const z = g[2][0];
    const dx = (g[0][1] - x) || 1;
    const dy = (g[1][1] - y) || 1;
    const dz = (g[2][1] - z) || 1;

    const matrix = mat4.create();
    mat4.set(matrix,
      2/dx, 0, 0, 0,
      0, 2/dy, 0, 0,
      0, 0, 2/dz, 0,

      -(2*x+dx)/dx,
      -(2*y+dy)/dy,
      -(2*z+dz)/dz,
      1,
    );

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

    return matrix;
  }, [g, a, p, r, q, s, m]);

  const context = useCombinedMatrixTransform(matrix);

  return [
    signal(),
    provide(TransformContext, context,
      provide(RangeContext, g, children ?? [])
    )
  ];
};


