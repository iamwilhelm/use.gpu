import type { LiveComponent, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { StorageSource } from '@use-gpu/core';
import type { ObjectTrait } from './types';

import { use, memo, provide, yeet, useCallback, useMemo, useOne, tagFunction } from '@use-gpu/live';
import { bundleToAttributes, bindEntryPoint } from '@use-gpu/shader/wgsl';

import {
  FaceLayer,
  InstanceData,
  TransformContext,
  DifferentialContext,
  useCombinedTransform,
  getBoundShader,
} from '@use-gpu/workbench';

import { useMatrixContext, MatrixContext } from './providers/matrix-provider';

import { useObjectTrait } from './traits';
import { composeTransform } from './lib/compose';

import { loadInstance } from '@use-gpu/wgsl/transform/instance.wgsl';
import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';
import { getMatrixDifferential } from '@use-gpu/wgsl/transform/diff-matrix.wgsl';

import { mat3, mat4 } from 'gl-matrix';

const INSTANCE_BINDINGS = bundleToAttributes(loadInstance);
const MATRIX_BINDINGS   = bundleToAttributes(getCartesianPosition);
const NORMAL_BINDINGS   = bundleToAttributes(getMatrixDifferential);

export type InstancesProps = InstanceInfo & {
  mesh: Record<string, ShaderSource>,
  shaded?: boolean,
  format?: 'u16' | 'u32',
  render?: (Instance: LiveComponent) => LiveElement,
};

const INSTANCE_FIELDS = [
  ['mat4x4<f32>', 'matrix'],
  ['mat3x3<f32>', 'normalMatrix'],
];

export const Instances: LiveComponent<InstancesProps> = (props: PropsWithChildren<InstancesProps>) => {
  const {
    mesh,
    shaded,
    format,
    render,
  } = props;

  const Resume = useCallback((instances, fieldSources) => {
    
    const [view, boundPosition, boundDifferential] = useMemo(() => {

      const [matrices, normalMatrices] = fieldSources;

      const load = getBoundShader(loadInstance, INSTANCE_BINDINGS, [matrices, normalMatrices]);
      const matrix = bindEntryPoint(load, 'getTransformMatrix');
      const normalMatrix = bindEntryPoint(load, 'getNormalMatrix');

      const boundPosition = getBoundShader(getCartesianPosition, MATRIX_BINDINGS, [matrix]);
      const boundDifferential = getBoundShader(getMatrixDifferential, NORMAL_BINDINGS, [matrix, normalMatrix]);

      const view = use(FaceLayer, {...mesh, instances, load, shaded});
      return [view, boundPosition, boundDifferential];
    }, [instances, fieldSources]);

    const [transform, differential] = useCombinedTransform(boundPosition, boundDifferential);

    return (
      provide(TransformContext, transform,
        provide(DifferentialContext, differential, view)
      )
    );
  }, [mesh]);

  return use(InstanceData, {
    format,
    fields: INSTANCE_FIELDS,
    render: (useInstance) => {
      const Instance = useMemo(() => makeInstance(props, useInstance), [props, useInstance]);
      return render(Instance);
    },
    then: Resume,
  })
};

const makeInstance = (
  instance: InstanceInfo,
  useInstance: () => [number, (data: Record<string, any>) => void],
) => tagFunction((props: Partial<ObjectTrait>) => {
  const parent = useMatrixContext();
  const updateInstance = useInstance();

  const {position: p, scale: s, quaternion: q, rotation: r, matrix: m} = useObjectTrait(props);
  const [matrix, normalMatrix] = useOne(() => [
    mat4.create(),
    mat3.create(),
  ]);

  useOne(() => {
    if (m) {
      mat4.copy(matrix, m);
      if (p || r || q || s) {
        const t = mat4.create();
        composeTransform(t, p, r, q, s);
        mat4.multiply(matrix, matrix, t);
      }
    }
    else if (p || r || q || s) {
      composeTransform(matrix, p, r, q, s);
    }

    mat4.multiply(matrix, parent, matrix);
    mat3.normalFromMat4(normalMatrix, matrix);

    updateInstance({matrix, normalMatrix});
  }, [p, s, q, r, m]);

  return yeet();
}, 'Instance');
