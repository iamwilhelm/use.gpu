import type { LiveComponent, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { StorageSource } from '@use-gpu/core';
import type { InstanceAggregate } from './types';

import { use, memo, provide, yeet, useCallback, useMemo, useOne, tagFunction } from '@use-gpu/live';
import { hashBits53, getObjectKey } from '@use-gpu/state';
import { getBundleKey, bundleToAttributes, bindEntryPoint } from '@use-gpu/shader/wgsl';

import { FaceLayer } from '../layers/face-layer';
import { InstanceProvider } from '../providers/instance-provider';
import { TransformContext, DifferentialContext } from '../providers/transform-provider';
import { MaterialContext } from '../providers/material-provider';
import { useMatrixContext, MatrixContext } from '../providers/matrix-provider';
import { useCombinedTransform } from '../hooks/useCombinedTransform';
import { useBoundShader } from '../hooks/useBoundShader';

import { loadInstance } from '@use-gpu/wgsl/transform/instance.wgsl';
import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';
import { getMatrixDifferential } from '@use-gpu/wgsl/transform/diff-matrix.wgsl';

import { InstanceData } from '../data/instance-data';
import { mat3, mat4 } from 'gl-matrix';

const INSTANCE_BINDINGS = bundleToAttributes(loadInstance);
const MATRIX_BINDINGS   = bundleToAttributes(getCartesianPosition);
const NORMAL_BINDINGS   = bundleToAttributes(getMatrixDifferential);

export type InstanceInfo = {
  mesh: Record<string, ShaderSource>,
  material: Record<string, Record<string, ShaderSource>>,
};

export type InstancesProps = InstanceInfo & {
  index?: 'u16' | 'u32',
  render?: (Instance: LiveComponent) => LiveElement,
};

const INSTANCE_FIELDS = [
  ['mat4x4<f32>', 'matrix'],
  ['mat3x3<f32>', 'normalMatrix'],
];

export const Instances: LiveComponent<InstancesProps> = (props: PropsWithChildren<InstancesProps>) => {
  const {
    index,
    mesh,
    material,
    render,
  } = props;

  const Resume = useCallback((indexSource, fieldSources) => {
    const [matrices, normalMatrices] = fieldSources;

    const instances = indexSource;

    const load = useBoundShader(loadInstance, INSTANCE_BINDINGS, [matrices, normalMatrices]);
    const matrix = bindEntryPoint(load, 'getTransformMatrix');
    const normalMatrix = bindEntryPoint(load, 'getNormalMatrix');

    const boundPosition = useBoundShader(getCartesianPosition, MATRIX_BINDINGS, [matrix]);
    const boundDifferential = useBoundShader(getMatrixDifferential, NORMAL_BINDINGS, [matrix, normalMatrix]);

    const [transform, differential] = useCombinedTransform(boundPosition, boundDifferential);

    return (
      provide(MaterialContext, material, 
        provide(TransformContext, transform,
          provide(DifferentialContext, differential,
            use(FaceLayer, {...mesh, instances, load})
          )
        )
      )
    );
  }, [mesh, material]);

  return use(InstanceData, {
    index,
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
) => tagFunction(() => {
  const matrix = useMatrixContext();
  const updateInstance = useInstance();

  useOne(() => {
    const normalMatrix = mat3.normalFromMat4(mat3.create(), matrix);
    updateInstance({matrix, normalMatrix});
  }, matrix);

  return yeet();
}, 'Instance');
