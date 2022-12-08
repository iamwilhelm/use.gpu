import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';
import type { DataBounds, RenderPassMode, StorageSource, TextureSource } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';
import type { AggregatedCalls, LightEnv } from './pass/types';
import type { UseLight } from './light-data';

import { use, quote, yeet, memo, provide, multiGather, extend, useContext, useMemo, useOne } from '@use-gpu/live';
import { bindBundle, bundleToAttributes, getBundleKey } from '@use-gpu/shader/wgsl';
import { makeBindGroupLayout, makeBindGroup, makeDataBindingsEntries, makeDepthStencilState } from '@use-gpu/core';

import { LightContext } from '../providers/light-provider';
import { PassContext } from '../providers/pass-provider';
import { useDeviceContext } from '../providers/device-provider';
import { useRenderContext } from '../providers/render-provider';
import { usePickingContext, useNoPickingContext } from '../providers/picking-provider';
import { useInspectable } from '../hooks/useInspectable'

import { Await } from './await';

import { DebugRender } from './forward/debug';
import { DepthRender } from './forward/depth';
import { ShadedRender } from './forward/shaded';
import { SolidRender } from './forward/solid';
import { PickingRender } from './forward/picking';
import { UIRender } from './forward/ui';

import { ColorPass } from '../pass/color-pass';
import { ComputePass } from '../pass/compute-pass';
import { DispatchPass } from '../pass/dispatch-pass';
import { PickingPass } from '../pass/picking-pass';
import { ReadbackPass } from '../pass/readback-pass';
import { ShadowPass } from '../pass/shadow-pass';

import { LightData, SHADOW_FORMAT, SHADOW_PAGE } from './light/light-data';

import { getLight, getLightCount } from '@use-gpu/wgsl/use/light.wgsl';
import { sampleShadow } from '@use-gpu/wgsl/use/shadow.wgsl';

import { applyLight as applyLightWGSL } from '@use-gpu/wgsl/material/light.wgsl';
import { applyLights as applyLightsWGSL } from '@use-gpu/wgsl/material/lights.wgsl';
import { applyDirectionalShadow as applyDirectionalShadowWGSL } from '@use-gpu/wgsl/shadow/directional.wgsl';
import { applyPointShadow as applyPointShadowWGSL } from '@use-gpu/wgsl/shadow/point.wgsl';

const LIGHT_BINDINGS = bundleToAttributes(applyLightWGSL);
const LIGHTS_BINDINGS = bundleToAttributes(applyLightsWGSL);

const NO_ENV: Record<string, any> = {};

type RenderComponents = {
  modes: Record<string, LiveComponent<any>>,
  renders: Record<string, Record<string, LiveComponent<any>>>,
};

export type ForwardRendererProps = {
  lights?: boolean,
  shadows?: boolean,
  picking?: boolean,
  overlay?: boolean,
  merge?: boolean,
  
  passes?: LiveElement[],
  components?: RenderComponents,
};

const getComponents = ({modes = {}, renders = {}}: RenderComponents) => {
  return {
    modes: {
      shadow: DepthRender,
      debug: DebugRender,
      picking: PickingRender,
      ...modes,
    },
    renders: {
      solid: {opaque: SolidRender, transparent: SolidRender},
      shaded: {opaque: ShadedRender, transparent: ShadedRender},
      ui: {opaque: UIRender, transparent: UIRender},
      ...renders,
    }
  }
};

const HOVERED_VARIANT = 'debug';

export const ForwardRenderer: LC<ForwardRendererProps> = memo((props: PropsWithChildren<ForwardRendererProps>) => {
  const {
    lights = true,
    shadows = false,
    picking = true,

    overlay = false,
    merge = false,

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
      depth: depthContext,
      picking: pickingContext?.renderContext,
    };

    // Prepare shared bind group for forward lighting
    const entries = [];
    if (lights) {
      entries.push({binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'read-only-storage'}});
      if (shadows) {
        entries.push({binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {viewDimension: '2d-array', sampleType: 'depth'}});
        entries.push({binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'comparison'}});
      }
    }

    const layout = lights ? makeBindGroupLayout(device, entries) : null;
    const bind = lights ? (storage: StorageSource, texture: TextureSource) => {
      const bindings = [];
      if (lights) {
        bindings.push({storage});
        if (shadows) bindings.push({texture});
      }

      const entries = makeDataBindingsEntries(device, bindings);
      const bindGroup = makeBindGroup(device, layout, entries);

      return (passEncoder: RenderPassEncoder) => {
        passEncoder.setBindGroup(1, bindGroup);
      };
    } : null;

    // Provide draw call variants for sub-passes
    const components = getComponents(props.components ?? {});

    const getRender = (mode, render = null) =>
      components.modes[mode] ?? components.renders[render][mode];

    const getVariants = (!shadows && !picking && !passes)
       ? (virtual, hovered) => hovered ? [getRender(HOVERED_VARIANT)] : getRender(virtual.mode, virtual.renderer)

       : (virtual, hovered) => {
          const {id, mode, renderer, links, defines} = virtual;

          const variants = [];
          if (shadows && mode === 'opaque' && defines?.HAS_SHADOW) {
            variants.push('shadow');
          }
          if (picking && mode !== 'picking' && links?.getPicking) {
            variants.push('picking');
          }
          if (variants.length === 0) return hovered ? [getRender(HOVERED_VARIANT, renderer)] : getRender(mode, renderer);

          variants.push(hovered ? HOVERED_VARIANT : mode);
          return variants.map(mode => getRender(mode, renderer));
        };

    const useVariants = (virtual, hovered) => 
      useMemo(() => getVariants(virtual, hovered), [getVariants, virtual, hovered]);

    return {useVariants, renderContexts, layout, bind};
  }, [lights, shadows, picking, device, renderContext, pickingContext]);

  // Pass aggregrated calls to pass runners
  const Resume = (
    calls: AggregatedCalls,
  ) =>
    useMemo(() => {
      const env = (calls.env ?? []).reduce((env, data) => {
        for (let k in data) env[k] = data[k];
        return env;
      }, {});

      const props = {calls, env};

      if (overlay) props.overlay = true;
      if (merge) props.merge = true;

      if (passes) {
        return passes.map(element => extend(element, props));
      }
      
      return [
        calls.dispatch ? use(DispatchPass, props) : null,
        calls.compute ? use(ComputePass, props) : null,
        shadows && calls.shadow ? use(ShadowPass, props) : null,
        use(ColorPass, props),
        calls.post || calls.readback ? use(ReadbackPass, props) : null,
        picking && calls.picking ? use(PickingPass, props) : null,
      ];
    }, [calls, passes, overlay, merge]);

  // Provide forward-lit material
  const view = lights ? use(LightData, {
    render: (
      useLight: UseLight,
    ) => {
      const context = useMemo(() => {
        const bindMaterial = (applyMaterial: ShaderModule) => {

          const applyDirectionalShadow = shadows ? bindBundle(applyDirectionalShadowWGSL, {sampleShadow}) : null;
          const applyPointShadow = shadows ? bindBundle(applyPointShadowWGSL, {sampleShadow}) : null;

          const applyLight = bindBundle(applyLightWGSL, {
            applyMaterial,
            applyDirectionalShadow,
            applyPointShadow,
          }, {SHADOW_PAGE});

          return bindBundle(applyLightsWGSL, {applyLight, getLightCount, getLight});
        };

        const useMaterial = (applyMaterial: ShaderModule) =>
          useMemo(() => bindMaterial(applyMaterial), [bindMaterial, applyMaterial]);

        return {useLight, useMaterial};
      }, [useLight]);

      return provide(LightContext, context, children);
    },
    then: (light: LightEnv) => 
      useOne(() => yeet({ env: { light }}), light),
  }) : children;

  return provide(PassContext, context, multiGather(view, Resume));
}, 'ForwardRenderer');
