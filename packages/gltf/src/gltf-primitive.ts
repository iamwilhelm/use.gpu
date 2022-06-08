import { LC, LiveElement } from '@use-gpu/live/types';
import { GLTF, GLTFPrimitiveData } from './types';

import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { use, provide, useMemo } from '@use-gpu/live';
import { mat4 } from 'gl-matrix';

import { FaceLayer, FaceLayerProps, PBRMaterial, TransformContext, useBoundShader, useNoBoundShader } from '@use-gpu/components';
import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl'
import { useGLTFMaterial } from './gltf-material';

const CARTESIAN_BINDINGS = bundleToAttributes(getCartesianPosition);

type GLTFPrimitiveProps = {
  gltf: GLTF,
  primitive: GLTFPrimitiveData,

  transform?: mat4,
};

export const GLTFPrimitive: LC<GLTFPrimitiveProps> = (props) => {
  const {
    gltf,
    primitive,
    transform,
  } = props;

  const {bound: {storage}} = gltf;
  const {attributes, indices, material, mode} = primitive;
  const {POSITION, NORMAL} = attributes;

  const faces: Partial<FaceLayerProps> = {};
  if (POSITION != null) faces.positions = storage[POSITION];
  if (NORMAL   != null) faces.normals   = storage[NORMAL];
  if (indices  != null) faces.indices   = storage[indices];
    
  const render = use(FaceLayer, faces);

  let view: LiveElement<any> = render;
  if (transform) {
    const xform = useBoundShader(getCartesianPosition, CARTESIAN_BINDINGS, [transform]);
    view = provide(TransformContext, xform, view);
  }
  else {
    useNoBoundShader();
  }

  const pbrMaterial = useGLTFMaterial(gltf, material);  
  return (
    use(PBRMaterial, {...pbrMaterial, children: view})
  );
};
