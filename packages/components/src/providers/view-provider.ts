import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { memo, provide, makeContext, useMemo } from '@use-gpu/live';
import { ViewUniforms, UniformAttribute } from '@use-gpu/core/types';
import { VIEW_UNIFORMS } from '@use-gpu/core';

import { mat4 } from 'gl-matrix';

const VIEW_UNIFORM_DEFAULTS = {
  projectionMatrix: { current: mat4.create() },
  viewMatrix: { current: mat4.create() },
  viewPosition: { current: [0, 0, 0, 1] },
  viewNearFar: { current: [1, 1] },
  viewResolution: { current: [1, 1] },
  viewSize: { current: [1, 1] },
  viewWorldUnit: { current: 1 },
  viewPixelRatio: { current: 1 },
};

export const ViewContext = makeContext<ViewContextProps>({
  viewUniforms: VIEW_UNIFORM_DEFAULTS,
  viewDefs: VIEW_UNIFORMS,
} as any as ViewContextProps, 'ViewContext');

export type ViewContextProps = {
  viewUniforms: ViewUniforms,
  viewDefs: UniformAttribute[],
};

export type ViewProviderProps = {
  defs: UniformAttribute[],
  uniforms: ViewUniforms,
  children?: LiveElement<any>,
};

export const ViewProvider: LiveComponent<ViewProviderProps> = memo((props: ViewProviderProps) => {
  const {defs: viewDefs, uniforms: viewUniforms, children} = props;
  const context = useMemo(() => ({viewDefs, viewUniforms}), [viewDefs, viewUniforms]);
  return provide(ViewContext, context, children);
}, 'ViewProvider');