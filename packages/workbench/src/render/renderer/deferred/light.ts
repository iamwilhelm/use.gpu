import type { LiveComponent, LiveElement, Lazy, TextureSource } from '@use-gpu/live';
import type { ShaderModule } from '@use-gpu/shader/wgsl';
import type { VirtualDraw } from '../render/pass';
import type { BoundLight } from '../../../light/types';

import { memo, use, yeet, keyed, useCallback, useMemo, useOne, useRef } from '@use-gpu/live';
import { resolve, uploadBuffer } from '@use-gpu/core';
import { bindBundle, bindEntryPoint, bundleToAttributes } from '@use-gpu/shader/wgsl';

import { drawCall } from '../../command/draw-call';
import { useBufferedSize } from '../../../hooks/useBufferedSize';
import { useBoundShader } from '../../../hooks/useBoundShader';
import { useRawSource } from '../../../hooks/useRawSource';

import { useDeviceContext } from '../../../providers/device-provider';
import { useRenderContext } from '../../../providers/render-provider';
import { useViewContext } from '../../../providers/view-provider';
import { usePassContext } from '../../../providers/pass-provider';

import { makeSphereGeometry } from '../../../primitives/geometry/sphere';

import { SHADOW_PAGE } from '../light-data';

import { getLightVertex } from '@use-gpu/wgsl/instance/vertex/light.wgsl';
import { getLightFragment } from '@use-gpu/wgsl/instance/fragment/light.wgsl';

import lightUniforms from '@use-gpu/wgsl/use/light.wgsl';
import shadowBindings from '@use-gpu/wgsl/use/shadow.wgsl';

import instanceDrawVirtualLight from '@use-gpu/wgsl/render/vertex/virtual-light.wgsl';
import instanceFragmentLight from '@use-gpu/wgsl/render/fragment/deferred-light.wgsl';

import { Light as WGSLLight } from '@use-gpu/wgsl/use/types.wgsl';
import { applyLight as applyLightWGSL } from '@use-gpu/wgsl/material/light.wgsl';
import { applyPBRMaterial as applyMaterial } from '@use-gpu/wgsl/material/pbr-apply.wgsl';

import { POINT_LIGHT } from '../../../light/types';

const getLight = bindEntryPoint(lightUniforms, 'getLight');
const sampleShadow = bindEntryPoint(shadowBindings, 'sampleShadow');

const LIGHT_BINDINGS = bundleToAttributes(applyLightWGSL);
const VERTEX_BINDINGS = bundleToAttributes(getLightVertex);
const FRAGMENT_BINDINGS = bundleToAttributes(getLightFragment);

export type LightRenderProps = {
  lights: Map<number, BoundLight>,
  shadows: boolean,

  order: number[],
  subranges: Map<number, [number, number]>,
};

export type LightKindProps = {
  gbuffer: TextureSource[],

  lights: Map<number, BoundLight>,
  shadows: boolean,

  order: number[],
  start: number,
  end: number,
};

export const LightRender: LiveComponent<LightRenderProps> = memo((props: LightRenderProps) => {
  let {
    lights,
    shadows,
    order,
    subranges,
  } = props;

  const {renderContexts: {gbuffer}} = usePassContext();
  const {sources} = gbuffer;

  return [...subranges.keys()].map(kind => {
    const [start, end] = subranges.get(kind);
    if (kind === POINT_LIGHT) return keyed(PointLightRender, kind, {lights, order, start, end, gbuffer: sources});
    return null;
  });
}, 'LightRender');

const GEOMETRY_PIPELINE = {
  primitive: {
    cullMode: 'front',
  },
  depthStencil: {
    depthCompare: 'less',
    depthWriteEnabled: false,
  },
};

const GEOMETRY_DEFS = {
  IS_FULLSCREEN: false,
};

const FULLSCREEN_DEFS = {
  IS_FULLSCREEN: true,
};

export const PointLightRender: LiveComponent<LightKindProps> = (props: LightKindProps) => {
  const {
    lights,
    shadows,
    order,
    start,
    end,
    gbuffer,
  } = props;

  const device = useDeviceContext();
  const {cull} = useViewContext();

  const sphere = useOne(() => makeSphereGeometry({ width: 2, detail: [4, 8] }));
  const getPosition = useRawSource(sphere.attributes.positions, 'vec4<f32>');
  const getIndex = useRawSource(sphere.attributes.indices, 'u16');

  const size = useBufferedSize(end - start);
  const indices = useOne(() => new Uint16Array(size), size);
  const getInstance = useRawSource(indices, 'u16');

  const applyLight = useOne(() =>
    bindBundle(applyLightWGSL, {
      applyMaterial,
      sampleShadow: shadows ? sampleShadow : null,
    }, {SHADOW_PAGE}),
    shadows);

  const getVertex = useBoundShader(getLightVertex, VERTEX_BINDINGS, [getLight, getInstance, getPosition, getIndex], GEOMETRY_DEFS);
  const getFragment = useBoundShader(getLightFragment, FRAGMENT_BINDINGS, [...gbuffer, getLight, applyLight]);

  const links = useMemo(() => ({getVertex, getFragment}), [getVertex, getFragment]);

  const countRef = useRef(0);
  const callRef = useRef();
  const bounds = {center: null, radius: null} as any;

  const onDispatch = useCallback(() => {
    let count = 0;
    for (let i = start; i < end; ++i) {
      const light = lights.get(order[i]);
      const {position, intensity} = light;

      const radius = intensity * 0.1;
      if (cull(position, radius)) indices[count++] = i;
    }
    countRef.current = count;

    uploadBuffer(device, getInstance.buffer, indices.buffer);
  }, [lights, indices]);

  return yeet(makeLightRender(sphere.count, countRef, links, GEOMETRY_PIPELINE, onDispatch));
}

const makeLightRender = (
  vertexCount: Lazy<number>,
  instanceCount: Lazy<number>,
  links: Record<string, ShaderModule>,
  pipeline?: Partial<GPURenderPipelineDescriptor>,
  onDispatch?: () => void,
) => {
  const device = useDeviceContext();
  const renderContext = useRenderContext();

  const {layout: globalLayout, uniforms: viewUniforms} = useViewContext();
  const {layout: passLayout, renderContexts: {gbuffer}} = usePassContext();

  const {sources} = gbuffer;

  const vertexShader = instanceDrawVirtualLight;
  const fragmentShader = instanceFragmentLight;

  const [v, f] = useMemo(() => {
    const v = bindBundle(vertexShader, links, undefined);
    const f = bindBundle(fragmentShader, links, undefined);
    return [v, f];
  }, [vertexShader, fragmentShader, links]);

  return drawCall({
    vertexCount,
    instanceCount,

    vertex: v,
    fragment: f,
    renderContext,

    globalLayout,
    passLayout,
    pipeline,

    onDispatch,
    mode: 'light',
  });
}
