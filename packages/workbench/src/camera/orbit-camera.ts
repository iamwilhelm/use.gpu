import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { VectorLike } from '@use-gpu/core';
import { ViewUniforms } from '@use-gpu/core';

import { useProp } from '@use-gpu/traits/live';
import { parsePosition } from '@use-gpu/parse';
import { provide, use, useContext, useOne, incrementVersion } from '@use-gpu/live';
import { VIEW_UNIFORMS, makeProjectionMatrix, makeOrbitMatrix, makeOrbitPosition, makeFrustumPlanes } from '@use-gpu/core';
import { FrameContext } from '../providers/frame-provider';
import { LayoutContext } from '../providers/layout-provider';
import { RenderContext } from '../providers/render-provider';
import { ViewProvider } from '../providers/view-provider';
import { vec2, mat4 } from 'gl-matrix';

const DEFAULT_ORBIT_CAMERA = {
  phi: 0,
  theta: 0,
  radius: 5,

  focus: 5,
  dolly: 1,

  fov: Math.PI / 3,
  near: 0.001,
  far: 1000,
};

export type OrbitCameraProps = PropsWithChildren<{
  phi?: number,
  theta?: number,
  radius?: number,
  target?: VectorLike,

  fov?: number,
  near?: number,
  far?: number,
  dolly?: number,

  focus?: number,
  scale?: number | null,
}>;

export const OrbitCamera: LiveComponent<OrbitCameraProps> = (props) => {
  const {
    width,
    height,
    pixelRatio,
  } = useContext(RenderContext);

  const layout = useContext(LayoutContext);

  const {
    phi    = DEFAULT_ORBIT_CAMERA.phi,
    theta  = DEFAULT_ORBIT_CAMERA.theta,
    radius = DEFAULT_ORBIT_CAMERA.radius,
    fov    = DEFAULT_ORBIT_CAMERA.fov,
    near   = DEFAULT_ORBIT_CAMERA.near,
    far    = DEFAULT_ORBIT_CAMERA.far,
    dolly  = DEFAULT_ORBIT_CAMERA.dolly,
    focus  = DEFAULT_ORBIT_CAMERA.focus,
    scale  = null,
    children,
  } = props;

  const target = useProp(props.target, parsePosition);

  const uniforms = useOne(() => ({
    projectionMatrix: { current: null as any },
    projectionViewMatrix: { current: null as any },
    projectionViewFrustum: { current: null as any },
    inverseViewMatrix: { current: mat4.create() },
    inverseProjectionViewMatrix: { current: mat4.create() },
    viewMatrix: { current: null as any },
    viewPosition: { current: null as any },
    viewNearFar: { current: null as any },
    viewResolution: { current: null as any },
    viewSize: { current: null as any },
    viewWorldDepth: { current: null as any },
    viewPixelRatio: { current: null as any },
  })) as ViewUniforms;

  const unit = scale != null ? height / pixelRatio / scale : 1;

  uniforms.projectionMatrix.current = makeProjectionMatrix(width, height, fov, near, far, radius, dolly);
  uniforms.viewMatrix.current = makeOrbitMatrix(radius, phi, theta, target, dolly);
  uniforms.viewPosition.current = makeOrbitPosition(radius, phi, theta, target, dolly);
  uniforms.viewNearFar.current = vec2.fromValues(near, far);
  uniforms.viewResolution.current = vec2.fromValues(1 / width, 1 / height);
  uniforms.viewSize.current = vec2.fromValues(width, height);
  uniforms.viewWorldDepth.current = vec2.fromValues(focus * Math.tan(fov / 2), 1);
  uniforms.viewPixelRatio.current = pixelRatio * unit;

  const {
    inverseProjectionViewMatrix,
    inverseViewMatrix,
    projectionMatrix,
    projectionViewMatrix,
    projectionViewFrustum,
    viewMatrix,
  } = uniforms;
  projectionViewMatrix.current = mat4.multiply(mat4.create(), projectionMatrix.current, viewMatrix.current);
  projectionViewFrustum.current = makeFrustumPlanes(projectionViewMatrix.current);
  mat4.invert(inverseProjectionViewMatrix.current, projectionViewMatrix.current);
  mat4.invert(inverseViewMatrix.current, viewMatrix.current);

  const frame = useOne(() => ({current: 0}));
  frame.current = incrementVersion(frame.current);

  return provide(FrameContext, frame.current,
    use(ViewProvider, {
      defs: VIEW_UNIFORMS,
      uniforms,
      children: provide(LayoutContext, layout, children),
    })
  );
};
