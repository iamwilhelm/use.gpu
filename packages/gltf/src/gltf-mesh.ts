import { LC, LiveElement } from '@use-gpu/live/types';
import { GLTF } from './types';

import { use, memo, useMemo } from '@use-gpu/live';
import { mat4 } from 'gl-matrix';
import { GLTFPrimitive } from './gltf-primitive';

type GLTFMeshProps = {
  gltf: GLTF,
  mesh: number,

  transform?: mat4,
};

export const GLTFMesh: LC<GLTFMeshProps> = memo((props) => {
  const {
    gltf,
    mesh,
    transform,
  } = props;

  const {meshes} = gltf;
  const {primitives} = meshes[mesh];

  return useMemo(() =>
    primitives.map(primitive => use(GLTFPrimitive, {gltf, primitive, transform})),
    [gltf, primitives, transform]);
}, 'GLTFMesh');
