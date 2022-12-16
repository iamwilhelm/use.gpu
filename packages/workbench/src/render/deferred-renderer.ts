import type { LC, PropsWithChildren, LiveFiber, LiveElement, LiveComponent, ArrowFunction } from '@use-gpu/live';
import type { DataBounds, RenderPassMode, StorageSource, TextureSource, UseGPURenderContext } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';
import type { AggregatedCalls, LightEnv, VirtualDraw } from '../pass/types';
import type { UseLight } from './light/light-data';

import { use, yeet, memo, provide, multiGather, extend, useMemo, useOne } from '@use-gpu/live';
import {
  makeBindGroupLayout, makeBindGroup, makeDataBindingsEntries, makeDepthStencilState,
} from '@use-gpu/core';

import { PassContext } from '../providers/pass-provider';
import { useDeviceContext } from '../providers/device-provider';
import { useRenderContext } from '../providers/render-provider';
import { usePickingContext, useNoPickingContext } from '../providers/picking-provider';
import { useInspectable } from '../hooks/useInspectable'

import { DebugRender } from './forward/debug';
import { DepthRender } from './forward/depth';
import { PickingRender } from './forward/picking';
import { ShadedRender } from './forward/shaded';
import { SolidRender } from './forward/solid';
import { UIRender } from './forward/ui';

import { DeferredShadedRender } from './deferred/shaded';
import { DeferredSolidRender } from './deferred/solid';
import { DeferredUIRender } from './deferred/ui';

import { LightRender } from './light/light';
import { LightMaterial } from './light/light-material';
import { SHADOW_FORMAT } from './light/light-data';

import { ComputePass } from '../pass/compute-pass';
import { DeferredPass } from '../pass/deferred-pass';
import { DispatchPass } from '../pass/dispatch-pass';
import { PickingPass } from '../pass/picking-pass';
import { ReadbackPass } from '../pass/readback-pass';
import { ShadowPass } from '../pass/shadow-pass';

type RenderComponents = {
  modes: Record<string, LiveComponent<any>>,
  renders: Record<string, Record<string, LiveComponent<any>>>,
};

export type DeferredRendererProps = {
  shadows?: boolean,
  picking?: boolean,
  overlay?: boolean,
  merge?: boolean,

  gbuffer: UseGPURenderContext,
  passes?: LiveElement[],
  components?: RenderComponents,
};

const getComponents = ({modes = {}, renders = {}}: Partial<RenderComponents>): RenderComponents => {
  return {
    modes: {
      shadow: DepthRender,
      debug: DebugRender,
      picking: PickingRender,
      ...modes,
    },
    renders: {
      solid: {opaque: DeferredSolidRender, transparent: SolidRender},
      shaded: {opaque: DeferredShadedRender, transparent: ShadedRender},
      ui: {opaque: DeferredUIRender, transparent: UIRender},
      ...renders,
    }
  }
};

const HOVERED_VARIANT = 'debug';

export const DeferredRenderer: LC<DeferredRendererProps> = memo((props: PropsWithChildren<DeferredRendererProps>) => {
  const {
    shadows = false,
    picking = true,

    overlay = false,
    merge = false,

    gbuffer,
    passes,
    children,
  } = props;

  const inspect = useInspectable();
  const device = useDeviceContext();

  const renderContext = useRenderContext();
  const pickingContext = picking ? usePickingContext() : useNoPickingContext();

  const context = useMemo(() => {

    // Provide render context for depth-only shadow passes
    const depthContext = {
      ...renderContext,
      pixelRatio: 1,
      samples: 1,
      colorSpace: 'native',
      colorInput: 'native',
      colorStates: [],
      colorAttachments: [],
      depthStencilState: makeDepthStencilState(SHADOW_FORMAT),
      swap: () => {},
    };

    const renderContexts = {
      gbuffer,
      depth: depthContext,
      picking: pickingContext?.renderContext,
    };

    // Prepare shared bind group for forward/deferred lighting
    const entries: GPUBindGroupLayoutEntry[] = [];
    entries.push({binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: {type: 'read-only-storage'}});
    if (shadows) {
      entries.push({binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {viewDimension: '2d-array', sampleType: 'depth'}});
      entries.push({binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'comparison'}});
    }

    const layout = makeBindGroupLayout(device, entries);
    const bind = (storage: StorageSource, texture: TextureSource) => {
      const bindings = [];
      bindings.push({storage});
      if (shadows) bindings.push({texture});

      const entries = makeDataBindingsEntries(device, bindings);
      const bindGroup = makeBindGroup(device, layout, entries);

      return (passEncoder: GPURenderPassEncoder) => {
        passEncoder.setBindGroup(1, bindGroup);
      };
    };

    // Provide draw call variants for sub-passes
    const components = getComponents(props.components ?? {});

    const getRender = (mode: string, render: string | null = null) =>
      components.modes[mode] ?? components.renders[render!][mode];

    const getVariants = (!shadows && !picking && !passes)
       ? (virtual: VirtualDraw, hovered: boolean) => hovered ? [getRender(HOVERED_VARIANT)] : getRender(virtual.mode, virtual.renderer)

       : (virtual: VirtualDraw, hovered: boolean) => {
          const {mode, renderer, links, defines} = virtual;

          const variants = [];
          if (shadows && mode === 'opaque' && defines?.HAS_SHADOW) {
            variants.push('shadow');
          }
          if (picking && mode !== 'picking' && links?.getPicking) {
            variants.push('picking');
          }
          if (variants.length === 0) return hovered ? [getRender(HOVERED_VARIANT)] : getRender(mode, renderer);

          variants.push(hovered ? HOVERED_VARIANT : mode);
          return variants.map(mode => getRender(mode, renderer));
        };

    const useVariants = (virtual: VirtualDraw, hovered: boolean) => 
      useMemo(() => getVariants(virtual, hovered), [getVariants, virtual, hovered]);

    return {useVariants, renderContexts, layout, bind};
  }, [shadows, picking, device, gbuffer, renderContext, pickingContext]);

  // Pass aggregrated calls to pass runners
  const Resume = (
    calls: AggregatedCalls,
  ) =>
    useMemo(() => {
      const env = (calls.env ?? []).reduce((env: Record<string, any>, data: Record<string, any>) => {
        for (let k in data) env[k] = data[k];
        return env;
      }, {});

      const props: Record<string, any> = {calls, env};

      if (overlay) props.overlay = true;
      if (merge) props.merge = true;

      if (passes) {
        return passes.map(element => extend(element, props));
      }
      
      return [
        calls.dispatch ? use(DispatchPass, props) : null,
        calls.compute ? use(ComputePass, props) : null,
        shadows && calls.shadow ? use(ShadowPass, props) : null,
        use(DeferredPass, props),
        calls.post || calls.readback ? use(ReadbackPass, props) : null,
        picking && calls.picking ? use(PickingPass, props) : null,
      ];
    }, [context, calls, passes, overlay, merge]);

  // Provide forward-lit material + deferred light renderer
  const view = lights ? use(LightMaterial, {
    children,
    then: (light: LightEnv) => 
      useMemo(() => [
        yeet({ env: { light }}),
        use(LightRender, {...light, shadows}),
      ], [light, shadows]),
  }) : children;

  return provide(PassContext, context, multiGather(view, Resume));
}, 'DeferredRenderer');
