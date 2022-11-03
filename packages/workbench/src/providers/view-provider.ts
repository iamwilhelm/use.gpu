import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { DataBounds, ViewUniforms, UniformAttribute } from '@use-gpu/core';

import { provide, signal, yeet, makeContext, useCallback, useContext, useNoContext, useMemo, useRef } from '@use-gpu/live';
import { VIEW_UNIFORMS, makeSharedUniforms, uploadBuffer, makeBindGroupLayout, distanceToFrustum } from '@use-gpu/core';
import { useDeviceContext } from '../providers/device-provider';

import { mat4 } from 'gl-matrix';

export const ViewContext = makeContext<ViewContextProps>({
  defs: [],
  uniforms: [],
  layout: null,
  cull: () => true,
  bind: () => {},
}, 'ViewContext');

export type ViewContextProps = {
  defs: UniformAttribute[],
  uniforms: ViewUniforms,
  layout: GPUPipelineLayout,
  bind: (passEncoder: GPURenderPassEncoder) => void,
  cull: (bounds: DataBounds) => number | boolean,
};

export type ViewProviderProps = {
  defs: UniformAttribute[],
  uniforms: ViewUniforms,
  children?: LiveElement,
};

const sqr = (x: number) => x * x;

export const ViewProvider: LiveComponent<ViewProviderProps> = (props: ViewProviderProps) => {
  const {defs, uniforms, children} = props;

  const device = useDeviceContext();

  const binding = useMemo(() =>
    makeSharedUniforms(device, [defs]),
    [device, defs]);

  const {bindGroup, layout, buffer, pipe} = binding;
  pipe.fill(uniforms);
  uploadBuffer(device, buffer, pipe.data);

  const bind = useCallback((passEncoder: GPURenderPassEncoder) => {
    passEncoder.setBindGroup(0, bindGroup);
  }, [bindGroup]);

  const {projectionViewFrustum, viewPosition} = uniforms;

  const cull = useCallback((bounds: DataBounds) => {
    const {center, radius} = bounds;
    const {current: frustum} = projectionViewFrustum;

    const [x, y, z = 0] = center;
    const d = distanceToFrustum(frustum, x, y, z);

    if (d < -radius) return false;

    const {current: position} = viewPosition;
    return sqr(position[0] - x) + sqr(position[1] - y) + sqr(position[2] - z);
  }, [uniforms]);

  const context = useMemo(() => ({
    bind,
    cull,
    layout,
    defs,
    uniforms,
  }), [bindGroup, layout, defs, uniforms]);

  return [
    signal(),
    provide(ViewContext, context, children),
  ];
};

export const useViewContext = () => useContext(ViewContext);
export const useNoViewContext = () => useNoContext(ViewContext);
