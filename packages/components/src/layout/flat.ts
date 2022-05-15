import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { Rectangle } from './types';

import { use, provide, useContext, useOne, useMemo } from '@use-gpu/live';
import { ViewUniforms, UniformAttribute } from '@use-gpu/core/types';
import { VIEW_UNIFORMS, makeOrthogonalMatrix } from '@use-gpu/core';
import { LayoutContext } from '../providers/layout-provider';
import { RenderContext } from '../providers/render-provider';
import { FrameContext, usePerFrame } from '../providers/frame-provider';
import { ViewProvider } from '../providers/view-provider';
import { mat4, vec3 } from 'gl-matrix';

const DEFAULT_FLAT_CAMERA = {
  near: 0,
  far: 1,
  focus: 1,
};

export type FlatProps = {
  x?: number,
  y?: number,
  zoom?: number,

  focus?: number,
  scale?: number | null,

  near?: number,
  far?: number,

  children?: LiveElement<any>,
};

export const Flat: LiveComponent<FlatProps> = (props) => {
  const {
    x = 0,
    y = 0,
    zoom = 1,
    scale = null,
    focus = DEFAULT_FLAT_CAMERA.focus,
    near = DEFAULT_FLAT_CAMERA.near,
    far = DEFAULT_FLAT_CAMERA.far,
    children,
  } = props;

  const {
    width,
    height,
    pixelRatio,
  } = useContext(RenderContext);

  const [layout, matrix, ratio, w, h] = useMemo(() => {
    const unit = scale != null ? height / pixelRatio / scale : 1;
    const ratio = unit * pixelRatio;

    const w = Math.floor(width / ratio);
    const h = Math.floor(height / ratio);

    const left = 0;
    const top = 0;
    const right = w;
    const bottom = h;
    const layout = [left, top, right, bottom] as Rectangle;

    const matrix = makeOrthogonalMatrix(left, right, bottom, top, -near, -far);

    return [layout, matrix, ratio, w, h];
  }, [scale, width, height, pixelRatio]);

  const uniforms = useOne(() => ({
    projectionMatrix: { current: null },
    viewMatrix: { current: mat4.create() },
    viewPosition: { current: null },
    viewNearFar: { current: null },
    viewResolution: { current: null },
    viewSize: { current: null },
    viewWorldUnit: { current: null },
    viewPixelRatio: { current: null },
  })) as any as ViewUniforms;

  if (x || y || (zoom !== 1)) {
    const m = mat4.create();
    mat4.scale(m, m, vec3.fromValues(zoom, zoom, 1));
    mat4.translate(m, m, vec3.fromValues(x, y, 0));
    uniforms.viewMatrix.current = m;
  }

  uniforms.projectionMatrix.current = matrix;
  uniforms.viewPosition.current = [ 0, 0, 1, 0 ];
  uniforms.viewNearFar.current = [ near, far ];
  uniforms.viewResolution.current = [ 1 / width, 1 / height ];
  uniforms.viewSize.current = [ width, height ];
  uniforms.viewWorldUnit.current = focus;
  uniforms.viewPixelRatio.current = ratio;

  usePerFrame();
  const frame = useOne(() => ({ current: 0 }));
  frame.current++;

  return (
    provide(FrameContext, {...frame},
      use(ViewProvider, {
        defs: VIEW_UNIFORMS,
        uniforms,
        children: provide(LayoutContext, layout, children),
      })
    )
  );
};
