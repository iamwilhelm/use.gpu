import type { LiveComponent, LiveElement, Lazy, TextureSource } from '@use-gpu/live';
import type { ShaderModule } from '@use-gpu/shader/wgsl';
import type { VirtualDraw } from '../pass';
import type { BoundLight } from '../../light/types';

import { memo, use, yeet, keyed, useCallback, useMemo, useOne, useRef } from '@use-gpu/live';
import { resolve, uploadBuffer } from '@use-gpu/core';
import { bindBundle, bindEntryPoint, bundleToAttributes } from '@use-gpu/shader/wgsl';

import { drawCall } from '../../queue/draw-call';
import { useBufferedSize } from '../../hooks/useBufferedSize';
import { useBoundShader } from '../../hooks/useBoundShader';
import { useRawSource } from '../../hooks/useRawSource';

import { useDeviceContext } from '../../providers/device-provider';
import { useRenderContext } from '../../providers/render-provider';
import { useViewContext } from '../../providers/view-provider';
import { usePassContext } from '../../providers/pass-provider';

import { makeSphereGeometry } from '../../primitives/geometry/sphere';

import { POINT_LIGHT } from '../../light/types';
import { SHADOW_PAGE } from './light-data';
import { PointLightRender } from './point';

import lightUniforms from '@use-gpu/wgsl/use/light.wgsl';
import shadowBindings from '@use-gpu/wgsl/use/shadow.wgsl';

import instanceDrawVirtualLight from '@use-gpu/wgsl/render/vertex/virtual-light.wgsl';
import instanceFragmentLight from '@use-gpu/wgsl/render/fragment/deferred-light.wgsl';

import { Light as WGSLLight } from '@use-gpu/wgsl/use/types.wgsl';
import { applyLight as applyLightWGSL } from '@use-gpu/wgsl/material/light.wgsl';
import { applyPBRMaterial as applyMaterial } from '@use-gpu/wgsl/material/pbr-apply.wgsl';
import { applyDirectionalShadow as applyDirectionalShadowWGSL } from '@use-gpu/wgsl/shadow/directional.wgsl';
import { applyPointShadow as applyPointShadowWGSL } from '@use-gpu/wgsl/shadow/point.wgsl';

const getLight = bindEntryPoint(lightUniforms, 'getLight');
const sampleShadow = bindEntryPoint(shadowBindings, 'sampleShadow');

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

  getLight: ShaderModule,
  applyLight: ShaderModule,
};

export const GEOMETRY_PIPELINE = {
  primitive: {
    cullMode: 'front',
  },
  depthStencil: {
    depthCompare: 'less',
    depthWriteEnabled: false,
  },
};

export const GEOMETRY_DEFS = {
  IS_FULLSCREEN: false,
};

export const FULLSCREEN_DEFS = {
  IS_FULLSCREEN: true,
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

  const applyLight = useOne(() => {
    const applyDirectionalShadow = shadows ? bindBundle(applyDirectionalShadowWGSL, {sampleShadow}) : null;
    const applyPointShadow = shadows ? bindBundle(applyPointShadowWGSL, {sampleShadow}) : null;
    
    return bindBundle(applyLightWGSL, {
      applyMaterial,
      applyDirectionalShadow,
      applyPointShadow,
    }, {SHADOW_PAGE});
  }, shadows);

  return [...subranges.keys()].map(kind => {
    const [start, end] = subranges.get(kind);
    if (kind === POINT_LIGHT) return keyed(PointLightRender, kind, {lights, shadows, order, start, end, gbuffer: sources, getLight, applyLight});
    return null;
  });
}, 'LightRender');

export const useLightRender = (
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
