import type { LC, LiveElement } from '@use-gpu/live';
import type { UniformAttribute } from '@use-gpu/core';
import type { GLTF, GLTFPrimitiveData } from './types';

import { flattenIndexedArray } from '@use-gpu/core';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { use, provide, useOne, useNoOne, useMemo, useNoMemo, useVersion, useNoVersion } from '@use-gpu/live';
import { generateTangents } from 'mikktspace';
import { mat3, mat4 } from 'gl-matrix';

import {
  FaceLayer, FaceLayerProps,
  PBRMaterial,
  TransformContext, DifferentialContext,
  useBoundShader, useNoBoundShader,
  useRawSource, useNoRawSource,
} from '@use-gpu/workbench';
import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl'
import { getMatrixDifferential } from '@use-gpu/wgsl/transform/diff-matrix.wgsl'
import { useGLTFMaterial } from './gltf-material';

const CARTESIAN_BINDINGS = bundleToAttributes(getCartesianPosition);
const NORMAL_BINDINGS = bundleToAttributes(getMatrixDifferential);

export type GLTFPrimitiveProps = {
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
  if (!gltf.bound) throw new Error("GLTF bound data is missing. Load GLTF using <GLTFData>.");

  const {bound: {storage}} = gltf;
  const {attributes, indices, material, mode} = primitive;
  const {POSITION, NORMAL, TANGENT, TEXCOORD_0} = attributes;

  const pbrMaterial = useGLTFMaterial(gltf, material);  

  const faces: Partial<FaceLayerProps> = {
    shaded: true,
    color: [1, 1, 1, 1],
    unweldedTangents: true,
    pipeline: {
      primitive: {
        cullMode: pbrMaterial.doubleSided ? 'none' : 'back',
      },
    },
  };

  if (POSITION   != null) faces.positions = storage[POSITION];
  if (NORMAL     != null) faces.normals   = storage[NORMAL];
  if (TANGENT    != null) faces.tangents  = storage[TANGENT];
  if (TEXCOORD_0 != null) faces.uvs       = storage[TEXCOORD_0];
  if (indices    != null) faces.indices   = storage[indices];

  // Generate mikkTSpace tangents
  if (faces.positions && faces.normals && faces.uvs && !faces.tangents) {
    let ps = gltf.bound.data[POSITION];
    let ns = gltf.bound.data[NORMAL];
    let ts = gltf.bound.data[TEXCOORD_0];

    const tangents = useMemo(() => {
      if (indices != null) {
        // Unweld mesh
        const inds = gltf.bound?.data?.[indices] as any;
        if (inds) {
          ps = flattenIndexedArray(ps as any, inds, 3);
          ns = flattenIndexedArray(ns as any, inds, 3);
          ts = flattenIndexedArray(ts as any, inds, 2);
        }
      }

      const out = generateTangents(ps as any, ns as any, ts as any);
      const n = out.length;
      for (let i = 0; i < n; i += 4) out[i + 3] *= -1;
      return out;
    }, [ps, ns, ts]);

    faces.tangents = useRawSource(tangents, 'vec4<f32>');
  }
  else {
    useNoMemo();
    useNoRawSource();
  }

  const render = use(FaceLayer, faces);

  let view: LiveElement = render;
  if (transform) {
    const {normals, tangents} = faces;

    const contravariant = useOne(() => mat3.normalFromMat4(mat3.create(), transform), transform);

    // Apply matrix transform
    const xform = useBoundShader(getCartesianPosition, CARTESIAN_BINDINGS, [transform]);
    const dform = useBoundShader(getMatrixDifferential, NORMAL_BINDINGS, [transform, contravariant]);

    view = provide(TransformContext, xform, provide(DifferentialContext, dform, view));
  }
  else {
    useNoOne();
    useNoBoundShader();
    useNoBoundShader();
  }

  return (
    use(PBRMaterial, {...pbrMaterial, children: view})
  );
};
