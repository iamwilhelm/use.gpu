import { LiveComponent } from '../live/types';

import { PROJECTION_UNIFORMS, VIEW_UNIFORMS, makeProjectionMatrix, makeOrbitMatrix } from '../camera/camera';
import { mat4 } from 'gl-matrix';

const DEFAULT_CAMERA = {
  fov: Math.PI / 3,
  near: 0.01,
  far: 100,
};

const UNIFORMS: UniformAttribute[] = [
  ...PROJECTION_UNIFORMS,
  ...VIEW_UNIFORMS,
];

export type CameraUniforms = {
  projectionMatrix: mat4,
  viewMatrix: mat4,
};

export type CameraProps = {
  width: number,
  height: number,
  fov?: number,
  near?: number,
  far?: number,
  render: (uniforms: CameraUniforms) => {},
};

export const Camera: LiveComponent<CameraProps> = (context) => (props) => {
  const {
    width,
    height,
    render,
    fov  = DEFAULT_CAMERA.fov,
    near = DEFAULT_CAMERA.near,
    far  = DEFAULT_CAMERA.far,
  } = props;

  const phi = 0.6;
  const theta = 0.4;
  
  const uniforms = {
    projectionMatrix: makeProjectionMatrix(width, height, fov, near, far),
    viewMatrix: makeOrbitMatrix(5, phi, theta),
  };

  return render(UNIFORMS, uniforms);
};