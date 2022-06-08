import { GLTFScene, GLTFNode, GLTFMesh, GLTFPrimitive, GLTFAccessor, GLTFMaterial } from './types';
import { mat4, vec3, quat } from 'gl-matrix';

export const toScene = <T = any>(t: any): GLTFScene<T> => {
  return {
    ...t,
    nodes: new Uint32Array(t.nodes),
  };
};

export const toNode = <T = any>(t: any): GLTFNode<T> => {
  return {
    ...t,
    children:    t.children    ? new Uint32Array(t.children)       : undefined,
    weights:     t.weights     ? new Float32Array(t.weights)       : undefined,
    matrix:      t.matrix      ? mat4.fromValues(...t.matrix)      : undefined,
    rotation:    t.rotation    ? quat.fromValues(...t.rotation)    : undefined,
    scale:       t.scale       ? vec3.fromValues(...t.scale)       : undefined,
    translation: t.translation ? vec3.fromValues(...t.translation) : undefined,
  };
};

export const toMesh = <T = any>(t: any): GLTFMesh<T> => {
  return {
    ...t,
    weights: t.weights ? new Float32Array(t.weights) : undefined,
  };
};


export const toMaterial = <T = any>(t: any): GLTFMaterial<T> => {
  return {
    ...t,
    pbrMetallicRoughness: t.pbrMetallicRoughness ? toPBR(t.pbrMetallicRoughness)        : undefined,
    emissiveFactor:       t.emissiveFactor       ? vec3.fromValues(...t.emissiveFactor) : undefined,
  }
};

export const toPBR = <T = any>(t: any): GLTFMaterial<T> => {
  return {
    ...t,
    baseColorFactor: t.baseColorFactor ? vec4.fromValues(...t.baseColorFactor) : undefined,
  }
};
