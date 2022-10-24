import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ViewUniforms, UniformAttribute } from '@use-gpu/core';

import { memo, provide, signal, makeContext, useContext, useNoContext, useMemo } from '@use-gpu/live';
import { VIEW_UNIFORMS, makeSharedUniforms, uploadBuffer } from '@use-gpu/core';
import { useDeviceContext } from '../providers/device-provider';

import { mat4 } from 'gl-matrix';

const VIEW_UNIFORM_DEFAULTS = {
  projectionMatrix: { current: mat4.create() },
  viewMatrix: { current: mat4.create() },
  viewPosition: { current: [0, 0, 0, 1] },
  viewNearFar: { current: [1, 1] },
  viewResolution: { current: [1, 1] },
  viewSize: { current: [1, 1] },
  viewWorldDepth: { current: 1 },
  viewPixelRatio: { current: 1 },
};

export const ViewContext = makeContext<ViewContextProps>({
  defs: VIEW_UNIFORMS,
  uniforms: VIEW_UNIFORM_DEFAULTS,
} as any as ViewContextProps, 'ViewContext');

export type ViewContextProps = {
  defs: UniformAttribute[],
  uniforms: ViewUniforms,
};

export type ViewProviderProps = {
  defs: UniformAttribute[],
  uniforms: ViewUniforms,
  children?: LiveElement,
};

export const ViewProvider: LiveComponent<ViewProviderProps> = memo((props: ViewProviderProps) => {
  const {defs, uniforms, children} = props;

  const device = useDeviceContext();

  const binding = useMemo(() =>
    makeSharedUniforms(device, [defs]),
    [device, defs]);

  const {bind, buffer, pipe} = binding;
  pipe.fill(uniforms);
  uploadBuffer(device, buffer, pipe.data);

  const context = useMemo(() => ({
    bind,
    defs,
    uniforms,
  }), [bind, defs, uniforms]);

  return [
    signal(),
    provide(ViewContext, context, children),
  ];
}, 'ViewProvider');

export const useViewContext = () => useContext(ViewContext);
export const useNoViewContext = () => useNoContext(ViewContext);
