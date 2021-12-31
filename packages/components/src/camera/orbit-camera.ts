import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { provide, use, useContext, useOne } from '@use-gpu/live';
import { ViewUniforms, UniformAttribute } from '@use-gpu/core/types';
import { VIEW_UNIFORMS, makeProjectionMatrix, makeOrbitMatrix, makeOrbitPosition } from '@use-gpu/core';
import { RenderContext } from '../providers/render-provider';
import { ViewProvider } from '../providers/view-provider';
import { FrameContext } from '../providers/frame-context';

const DEFAULT_ORBIT_CAMERA = {
  phi: 0,
  theta: 0,
  radius: 5,
  fov: Math.PI / 3,
  near: 0.01,
  far: 100,
};

export type OrbitCameraProps = {
  width: number,
  height: number,
  phi: number,
  theta: number,
  radius: number,

  fov?: number,
  near?: number,
  far?: number,
  
  children?: LiveElement<any>,
};

export const OrbitCamera: LiveComponent<OrbitCameraProps> = (fiber) => (props) => {
  const {
    width,
    height,
    pixelRatio,
  } = useContext(RenderContext);

  const {
    phi    = DEFAULT_ORBIT_CAMERA.phi,
    theta  = DEFAULT_ORBIT_CAMERA.theta,
    radius = DEFAULT_ORBIT_CAMERA.radius,
    fov    = DEFAULT_ORBIT_CAMERA.fov,
    near   = DEFAULT_ORBIT_CAMERA.near,
    far    = DEFAULT_ORBIT_CAMERA.far,
    children,
  } = props;
  
  const uniforms = useOne(() => ({
    projectionMatrix: { value: null },
    viewMatrix: { value: null },
    viewPosition: { value: null },
    viewResolution: { value: null },
    viewSize: { value: null },
    viewPixelRatio: { value: null },
  })) as any as ViewUniforms;

  uniforms.projectionMatrix.value = makeProjectionMatrix(width, height, fov, near, far);
  uniforms.viewMatrix.value = makeOrbitMatrix(radius, phi, theta);
  uniforms.viewPosition.value = makeOrbitPosition(radius, phi, theta);
  uniforms.viewResolution.value = [ 1/width, 1/height ];
  uniforms.viewSize.value = [ width, height ];
  uniforms.viewPixelRatio.value = pixelRatio;

  return provide(FrameContext, null, use(ViewProvider)({
    defs: VIEW_UNIFORMS, uniforms, children,
  }));
};
