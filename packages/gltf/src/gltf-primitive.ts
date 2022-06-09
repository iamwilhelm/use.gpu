import { LC, LiveElement } from '@use-gpu/live/types';
import { UniformAttribute } from '@use-gpu/core/types';
import { GLTF, GLTFPrimitiveData } from './types';

import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { use, provide, useMemo, useNoMemo } from '@use-gpu/live';
import { mat4 } from 'gl-matrix';

import {
  FaceLayer, FaceLayerProps,
  PBRMaterial,
  TransformContext,
  useBoundShader, useNoBoundShader,
  useRawSource, useNoRawSource,
} from '@use-gpu/components';
import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl'
import { getTransformedNormal } from '@use-gpu/wgsl/transform/normal.wgsl'
import { useGLTFMaterial } from './gltf-material';
import { generateTangents } from 'mikktspace';

const CARTESIAN_BINDINGS = bundleToAttributes(getCartesianPosition);
const NORMAL_BINDINGS = bundleToAttributes(getTransformedNormal);

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
  const {POSITION, NORMAL, TANGENT, TEXCOORD_0} = attributes;

  const faces: Partial<FaceLayerProps> = {
    shaded: true,
    color: [1, 1, 1, 1],
  };

  if (POSITION   != null) faces.positions = storage[POSITION];
  if (NORMAL     != null) faces.normals   = storage[NORMAL];
  if (TANGENT    != null) faces.tangents  = storage[TANGENT];
  if (TEXCOORD_0 != null) faces.uvs       = storage[TEXCOORD_0];
  if (indices    != null) faces.indices   = storage[indices];

  if (faces.positions && faces.normals && faces.uvs && !faces.tangents) {
    const ps = gltf.bound.data[POSITION];
    const ns = gltf.bound.data[NORMAL];
    const ts = gltf.bound.data[TEXCOORD_0];

    const tangents = useMemo(() => generateTangents(ps, ns, ts), [ps, ns, ts]);
    faces.tangents = useRawSource(tangents, 'vec4<f32>');
  }
  else {
    useNoMemo();
    useNoRawSource();
    useNoMemo();
  }

  const render = use(FaceLayer, faces);

  let view: LiveElement<any> = render;
  if (transform) {
    const xform = useBoundShader(getCartesianPosition, CARTESIAN_BINDINGS, [transform]);
    view = provide(TransformContext, xform, view);

    const {normals} = faces;
    if (normals) {
      const m = mat4.create();
      mat4.invert(m, transform);
      mat4.transpose(m, m);

      faces.normals = useBoundShader(getTransformedNormal, NORMAL_BINDINGS, [m, normals]);
    }
    else {
      useNoBoundShader();      
    }
  }
  else {
    useNoBoundShader();
    useNoBoundShader();
  }

  const pbrMaterial = useGLTFMaterial(gltf, material);  
  return (
    use(PBRMaterial, {...pbrMaterial, children: view})
  );
};
