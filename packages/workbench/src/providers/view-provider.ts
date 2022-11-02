import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ViewUniforms, UniformAttribute } from '@use-gpu/core';

import { memo, provide, signal, yeet, makeContext, useCallback, useContext, useNoContext, useHasContext, useMemo, useFiber } from '@use-gpu/live';
import { VIEW_UNIFORMS, makeSharedUniforms, uploadBuffer, makeBindGroupLayout } from '@use-gpu/core';
import { useDeviceContext } from '../providers/device-provider';

import { mat4 } from 'gl-matrix';

export const ViewContext = makeContext<ViewContextProps>({
  defs: [],
  uniforms: [],
  layout: null,
  bind: () => {},
}, 'ViewContext');

export type ViewContextProps = {
  defs: UniformAttribute[],
  uniforms: ViewUniforms,
  layout: GPUPipelineLayout,
  bind: (passEncoder: GPURenderPassEncoder) => void,
};

export type ViewProviderProps = {
  defs: UniformAttribute[],
  uniforms: ViewUniforms,
  children?: LiveElement,
};

export const ViewProvider: LiveComponent<ViewProviderProps> = memo((props: ViewProviderProps) => {
  const {defs, uniforms, children} = props;

  const fiber = useFiber();
  const device = useDeviceContext();

  const binding = useMemo(() =>
    makeSharedUniforms(device, [defs]),
    [device, defs]);

  const {bindGroup, layout, buffer, pipe} = binding;
  pipe.fill(uniforms);
  uploadBuffer(device, buffer, pipe.data);

  const bind = useCallback((passEncoder: GPURenderPassEncoder) => {
    passEncoder.setBindGroup(0, bindGroup);
  });

  const context = useMemo(() => ({
    bind,
    layout,
    defs,
    uniforms,
  }), [bindGroup, layout, defs, uniforms]);

  return [
    signal(),
    provide(ViewContext, context, children),
  ];
}, 'ViewProvider');

export const useViewContext = () => useContext(ViewContext);
export const useNoViewContext = () => useNoContext(ViewContext);
