import { mat4 } from 'gl-matrix'

export type CameraUniforms = {
  projectionMatrix: mat4,
  viewMatrix: mat4,
};
