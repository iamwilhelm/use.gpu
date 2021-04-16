import { LiveComponent, LiveElement } from '../live/types';

import { UniformAttribute } from '../core/types';
import { CameraUniforms } from '../camera/types';

import { PROJECTION_UNIFORMS, VIEW_UNIFORMS, makeProjectionMatrix, makeOrbitMatrix } from '../camera/camera';

const DEFAULT_CAMERA = {
  phi: 0,
  theta: 0,
  radius: 5,
  fov: Math.PI / 3,
  near: 0.01,
  far: 100,
};

const UNIFORMS: UniformAttribute[] = [
  ...PROJECTION_UNIFORMS,
  ...VIEW_UNIFORMS,
];

export type OrbitCameraProps = {
  width: number,
  height: number,
  phi: number,
  theta: number,
  radius: number,

  fov?: number,
  near?: number,
  far?: number,
  render: (defs: UniformAttribute[], uniforms: CameraUniforms) => LiveElement<any>,
};

export const OrbitCamera: LiveComponent<OrbitCameraProps> = (context) => (props) => {
  const {
    width,
    height,
    phi    = DEFAULT_CAMERA.phi,
    theta  = DEFAULT_CAMERA.theta,
    radius = DEFAULT_CAMERA.radius,
    fov    = DEFAULT_CAMERA.fov,
    near   = DEFAULT_CAMERA.near,
    far    = DEFAULT_CAMERA.far,
    render,
  } = props;
  
  const uniforms = {
    projectionMatrix: makeProjectionMatrix(width, height, fov, near, far),
    viewMatrix: makeOrbitMatrix(radius, phi, theta),
  };

  return render(UNIFORMS, uniforms);
};
