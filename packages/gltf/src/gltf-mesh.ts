import type { LC, LiveElement } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader/wgsl';
import type { GLTF, GLTFPrimitiveData } from './types';

import { use, yeet, memo, useMemo } from '@use-gpu/live';
import { mat4 } from 'gl-matrix';

import { GLTFPrimitive } from './gltf-primitive';
import { useGLTFGeometry } from './gltf-geometry';

export type GLTFMeshProps = {
  gltf: GLTF,
  mesh: number,

  environment?: ShaderSource,
  transform?: mat4,
};

export const GLTFMesh: LC<GLTFMeshProps> = (props: GLTFMeshProps) => {
  const {
    gltf,
    mesh,
    environment,
    transform,
  } = props;

  const {meshes} = gltf;
  if (!meshes) return null;

  const {primitives} = meshes[mesh];
  if (!primitives) return null;

  return useMemo(() =>
    gltf.bound
    ? primitives.map((primitive: GLTFPrimitiveData) => use(GLTFPrimitive, {gltf, environment, primitive, transform}))
    : yeet(primitives.map((primitive: GLTFPrimitiveData) => useGLTFGeometry(gltf, environment, primitive, transform))),
    [gltf, environment, primitives, transform]);
};
