import { LC, LiveElement } from '@use-gpu/live/types';
import { GLTF } from './types';
import { vec3, mat4, quat } from 'gl-matrix';

import { use, gather, useMemo, useOne } from '@use-gpu/live';
import { GLTFMesh } from './gltf-mesh';

type GLTFNodeProps = {
  gltf: GLTF,
  node: number,
  matrix?: mat4,
};

export const GLTFNode: LC<GLTFNodeProps> = (props) => {
  const {
    gltf,
    node,
    matrix: parentMatrix,
  } = props;

  const {
    mesh,
    matrix,
    translation,
    rotation,
    scale,
    children,
  } = gltf.nodes[node];

  const transform = useMemo(() => {
    if (!(matrix || translation || rotation || scale)) return parentMatrix;

    const transform = mat4.create();
    composeTransform(transform, translation, rotation, scale, matrix);
    return transform;
  }, [matrix, translation, rotation, scale]);

  const self = mesh != null ? (
    use(GLTFMesh, {gltf, mesh, transform})
  ) : null;

  if (children) {
    const out: LiveElement<any> = [];

    if (self) out.push(self);
    out.push(children.map(node => use(GLTFNode, {gltf, node})));

    return self;
  }

  return self;
};

const makeComposeTransform = () => {

  const q = quat.create();
  const p = vec3.create();
  const s = vec3.create();
  const t = mat4.create();

  return (
    transform: mat4,
    position?: TypedArray | null,
    quaternion?: TypedArray | null,
    scale?: TypedArray | null,
    matrix?: TypedArray | null,
  ) => {

    if (quaternion != null) quat.multiply(q, q, quaternion as any);

    if (position != null) vec3.copy(p, position as any);
    else vec3.zero(p);

    if (scale != null) vec3.copy(s, scale as any);
    else vec3.set(s, 1, 1, 1);
    
    mat4.fromRotationTranslationScale(transform, q, p, s);
    return transform;
  }
}

export const composeTransform = makeComposeTransform();