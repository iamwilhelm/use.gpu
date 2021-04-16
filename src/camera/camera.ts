import { mat4, vec3 } from 'gl-matrix';

import { UniformAttribute, UniformType } from '../core/types';

export const PROJECTION_UNIFORMS: UniformAttribute[] = [{
  name: 'projectionMatrix',
  format: UniformType.mat4,
}];

export const VIEW_UNIFORMS: UniformAttribute[] = [{
  name: 'viewMatrix',
  format: UniformType.mat4,
}];

export const makeProjectionMatrix = (
  width: number,
  height: number,
  fov: number,
  near: number,
  far: number,
): mat4 => {
  const aspect = width / height;
  const matrix = mat4.create();
  mat4.perspective(matrix, fov, aspect, near, far);

  const z = mat4.create();
  mat4.translate(z, z, vec3.fromValues(0, 0, 0.5));
  mat4.scale(z, z, vec3.fromValues(1, 1, 0.5));
  mat4.multiply(matrix, z, matrix);

  return matrix;
}

export const makeOrbitMatrix = (radius: number, phi: number, theta: number): mat4 => {
  const matrix = mat4.create();
  mat4.translate(matrix, matrix, vec3.fromValues(0, 0, -radius));
  mat4.rotate(matrix, matrix, theta, vec3.fromValues(1, 0, 0));
  mat4.rotate(matrix, matrix, phi, vec3.fromValues(0, 1, 0));
  return matrix;
}
