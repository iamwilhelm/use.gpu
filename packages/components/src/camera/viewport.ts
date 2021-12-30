import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { makeContext, useContext, useOne } from '@use-gpu/live';
import { ViewUniforms, UniformAttribute } from '@use-gpu/core/types';
import { VIEW_UNIFORMS, makeProjectionMatrix, makeOrbitMatrix, makeOrbitPosition } from '@use-gpu/core';
import { RenderContext } from '../providers/render-provider';
import { ViewProvider } from '../providers/view-provider';

const ViewportContext = makeContext('ViewportContext')

export type LayoutBox = {
  left: number,
  top: number,
  right: number,
  bottom: number,
  width: number,
  height: number,
};

export type ViewportProps = LayoutBox & {
  left: number | null,
  top: number | null,
  right: number | null,
  bottom: number | null,
  width: number | null,
  height: number | null,

  children?: LiveElement<any>,
};

export const Viewport: LiveComponent<ViewportProps> = (fiber) => (props) => {
  const {
    width: renderWidth,
    height: renderHeight,
    pixelRatio,
  } = useContext(RenderContext);

  const viewWidth = renderWidth / pixelRatio;
  const viewHeight = renderHeight / pixelRatio;

  let {
    left,
    right,
    top,
    bottom,
    width,
    height,
    children,
  } = props;  

  if (left == null) left = 0;
  if (top == null) top = 0;
  if (width == null && right != null) width = right - left;
  if (height == null && bottom != null) height = bottom - top;
  if (right == null) right = left + width;
  if (bottom == null) bottom = top + height;

  const layout = { left, top, right, bottom, width, height };  
  const uniforms = useOne(() => ({
    projectionMatrix: { value: null },
    viewMatrix: { value: null },
    viewPosition: { value: null },
    viewResolution: { value: null },
    viewSize: { value: null },
    viewPixelRatio: { value: null },
  })) as any as ViewUniforms;

  uniforms.projectionMatrix.value = makeOrthogonalMatrix(0, w, 0, h, near, far);
  uniforms.viewMatrix.value = mat4.create();
  uniforms.viewPosition.value = [ 0, 0, 1, 0 ];
  uniforms.viewResolution.value = [ 1/w, 1/h ];
  uniforms.viewSize.value = [ w, h ];
  uniforms.viewPixelRatio.value = pixelRatio;

  return use(ViewProvider)({
    defs, uniforms, children,
  });
};
