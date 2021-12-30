import { mat4, vec3 } from 'gl-matrix';

import { UniformAttribute, UniformType } from './types';

export const VIEW_UNIFORMS: UniformAttribute[] = [
  {
    name: 'projectionMatrix',
    format: UniformType.mat4,
  },
  {
    name: 'viewMatrix',
    format: UniformType.mat4,
  },
  {
    name: 'viewPosition',
    format: UniformType.vec4
  },
  {
    name: 'viewResolution',
    format: UniformType.vec2
  },
  {
    name: 'viewSize',
    format: UniformType.vec2
  },
  {
    name: 'viewPixelRatio',
    format: UniformType.float
  },
];

export const makeOrthogonalMatrix = (
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number,
): mat4 => {
  const aspect = width / height;
  
  const x = 2 / (right - left);
  const y = 2 / (top - bottom);
  const z = 1 / (far - near);

  const wx = -(right + left) / (right - left);
  const wy = -(bottom + top) / (bottom - top);
  const wz = -(near) / (far - near);  

  const matrix = mat4.create();
  mat4.set(matrix,
    x, 0, 0, wx,
    0, y, 0, wy,
    0, 0, z, wz,
    0, 0, 0, 1,
  );

  return matrix;
}

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

export const makeOrbitPosition = (radius: number, phi: number, theta: number): number[] => {
  const ct = Math.cos(theta);
  return [
    -Math.sin(phi) * ct * radius,
    Math.sin(theta) * radius,
    Math.cos(phi) * ct * radius,
  ];
}

