import { LiveComponent, LiveElement } from '../live/types';

import { UniformAttribute } from '../core/types';
import { CameraUniforms } from '../camera/types';

import { PROJECTION_UNIFORMS, VIEW_UNIFORMS, makeProjectionMatrix, makeOrbitMatrix } from '../camera/camera';

const DEFAULT_CAMERA = {
  fov: Math.PI / 3,
  near: 0.01,
  far: 100,
};

const UNIFORMS: UniformAttribute[] = [
  ...PROJECTION_UNIFORMS,
  ...VIEW_UNIFORMS,
];

export type CameraProps = {
  width: number,
  height: number,
  fov?: number,
  near?: number,
  far?: number,
  render: (defs: UniformAttribute[], uniforms: CameraUniforms) => LiveElement<any>,
};

export const Camera: LiveComponent<CameraProps> = () => (props) => {
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