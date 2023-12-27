import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ShaderModule } from '@use-gpu/shader';
import type { Lazy, TextureSource } from '@use-gpu/core';
import type { Update } from '@use-gpu/state';
import type { VirtualDraw } from '../../pass/types';
import type { BoundLight } from '../../light/types';

import { memo, use, yeet, keyed, useCallback, useMemo, useOne, useRef } from '@use-gpu/live';
import { resolve, uploadBuffer, BLEND_ADD } from '@use-gpu/core';
import { bindBundle } from '@use-gpu/shader/wgsl';
import { $delete } from '@use-gpu/state';

import { drawCall } from '../../queue/draw-call';
import { useBufferedSize } from '../../hooks/useBufferedSize';
import { useShader } from '../../hooks/useShader';
import { useRawSource } from '../../hooks/useRawSource';

import { useDeviceContext } from '../../providers/device-provider';
import { useRenderContext } from '../../providers/render-provider';
import { useViewContext } from '../../providers/view-provider';
import { usePassContext } from '../../providers/pass-provider';

import { AMBIENT_LIGHT, DIRECTIONAL_LIGHT, DOME_LIGHT, POINT_LIGHT } from '../../light/types';
import { SHADOW_PAGE } from './light-data';

import { EmissiveLightRender } from './emissive';
import { FullScreenLightRender } from './full-screen';
import { PointLightRender } from './point';

import { getLight } from '@use-gpu/wgsl/use/light.wgsl';
import { sampleShadow } from '@use-gpu/wgsl/use/shadow.wgsl';

import instanceDrawVirtualLight from '@use-gpu/wgsl/render/vertex/virtual-light.wgsl';
import instanceFragmentLight from '@use-gpu/wgsl/render/fragment/deferred-light.wgsl';

import { applyLight as applyLightWGSL } from '@use-gpu/wgsl/material/light.wgsl';
import { applyPBRMaterial as applyMaterial } from '@use-gpu/wgsl/material/pbr-apply.wgsl';
import { applyDirectionalShadow as applyDirectionalShadowWGSL } from '@use-gpu/wgsl/shadow/directional.wgsl';
import { applyPointShadow as applyPointShadowWGSL } from '@use-gpu/wgsl/shadow/point.wgsl';

export type LightRenderProps = {
  lights: Map<number, BoundLight>,
  order: number[],
  subranges: Map<number, [number, number]>,
};

export type LightKindProps = {
  gbuffer: TextureSource[],
  stencil: boolean,
  shadows: boolean,

  lights: Map<number, BoundLight>,

  order: number[],
  start: number,
  end: number,

  getLight: ShaderModule,
  applyLight: ShaderModule,
};

export const FULLSCREEN_PIPELINE = {
  primitive: {
    cullMode: 'none',
  },
  depthStencil: {
    depthCompare: 'always',
    depthWriteEnabled: false,
  },
  fragment: {
    targets: {
      0: {
        blend: BLEND_ADD,
      },
    },
  },
} as Update<GPURenderPipelineDescriptor>;

export const GEOMETRY_PIPELINE = {
  primitive: {
    cullMode: 'back',
  },
  depthStencil: {
    depthCompare: 'greater-equal',
    depthWriteEnabled: false,
  },
  fragment: {
    targets: {
      0: {
        blend: BLEND_ADD,
      },
    },
  },
} as Update<GPURenderPipelineDescriptor>;

export const STENCIL_PIPELINE = {
  primitive: {
    cullMode: 'front',
  },
  depthStencil: {
    depthCompare: 'less',
    depthWriteEnabled: false,
    stencilBack: {
      compare: 'always',
      passOp: 'increment-clamp',
    },
  },
  fragment: $delete(),
} as Update<GPURenderPipelineDescriptor>;

export const FULLSCREEN_STENCIL_PIPELINE = {
  primitive: {
    cullMode: 'none',
  },
  depthStencil: {
    depthCompare: 'always',
    depthWriteEnabled: false,
    stencilFront: {
      compare: 'less',
    },
  },
  fragment: {
    targets: {
      0: {
        blend: BLEND_ADD,
      },
    },
  },
} as Update<GPURenderPipelineDescriptor>;

export const GEOMETRY_STENCIL_PIPELINE = {
  primitive: {
    cullMode: 'back',
  },
  depthStencil: {
    depthCompare: 'greater',
    depthWriteEnabled: false,
    stencilFront: {
      compare: 'less',
    },
  },
  fragment: {
    targets: {
      0: {
        blend: BLEND_ADD,
      },
    },
  },
} as Update<GPURenderPipelineDescriptor>;

export const FULLSCREEN_DEFS = {
  IS_FULLSCREEN: true,
};

export const GEOMETRY_DEFS = {
  IS_FULLSCREEN: false,
};

const LIGHT_RENDERERS = {
  [AMBIENT_LIGHT]: FullScreenLightRender,
  [DIRECTIONAL_LIGHT]: FullScreenLightRender,
  [DOME_LIGHT]: FullScreenLightRender,
  [POINT_LIGHT]: PointLightRender,
} as Record<number, LiveComponent<any>>;

export const LightRender: LiveComponent<LightRenderProps> = memo((props: LightRenderProps) => {
  let {
    lights,
    order,
    subranges,
  } = props;

  const {buffers: {gbuffer: [gbuffer], shadow: [shadow]}} = usePassContext();
  const {depthStencilState, sources} = gbuffer;

  const shadows = !!shadow;
  const stencil = !!depthStencilState?.format.match(/stencil/);

  const applyLight = useOne(() => {
    const applyDirectionalShadow = shadows ? bindBundle(applyDirectionalShadowWGSL, {sampleShadow}) : null;
    const applyPointShadow = shadows ? bindBundle(applyPointShadowWGSL, {sampleShadow}) : null;

    return bindBundle(applyLightWGSL, {
      applyMaterial,
      applyDirectionalShadow,
      applyPointShadow,
    }, {SHADOW_PAGE});
  }, shadows);

  const out = [...subranges.keys()].map(kind => {
    const [start, end] = subranges.get(kind)!;
    const props = {lights, order, start, end, stencil, gbuffer: sources!, getLight, applyLight};

    const Component = LIGHT_RENDERERS[kind];
    return Component ? keyed(Component, kind, props) : null;
  });

  out.push(keyed(EmissiveLightRender, -1, {gbuffer: sources!, getLight}));

  return out;
}, 'LightRender');

export const LightDraw = (
  vertexCount: Lazy<number>,
  instanceCount: Lazy<number>,
  firstInstance: Lazy<number>,
  links: Record<string, ShaderModule>,
  pipeline?: Update<GPURenderPipelineDescriptor>,
  mode?: string,
) => yeet(useLightDraw(vertexCount, instanceCount, firstInstance, links, pipeline, mode));

export const useLightDraw = (
  vertexCount: Lazy<number>,
  instanceCount: Lazy<number>,
  firstInstance: Lazy<number>,
  links: Record<string, ShaderModule>,
  pipeline?: Update<GPURenderPipelineDescriptor>,
  mode = 'light',
) => {
  const device = useDeviceContext();
  const renderContext = useRenderContext();

  const {layout: globalLayout, uniforms: viewUniforms} = useViewContext();
  const {layout: passLayout, buffers: {gbuffer: [gbuffer]}} = usePassContext();

  const {sources} = gbuffer;

  const vertexShader = instanceDrawVirtualLight;
  const fragmentShader = instanceFragmentLight;

  const [v, f] = useMemo(() => {
    const v = bindBundle(vertexShader, links, undefined);
    const f = links.getFragment ? bindBundle(fragmentShader, links, undefined) : null;
    return [v, f];
  }, [vertexShader, fragmentShader, links]);

  return drawCall({
    vertexCount,
    instanceCount,
    firstInstance,

    vertex: v,
    fragment: f,
    renderContext,

    globalLayout,
    passLayout,
    pipeline,

    mode,
  });
}
