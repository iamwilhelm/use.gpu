import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';
import type { DataBounds, UseGPURenderContext, RenderPassMode, StorageSource, TextureSource } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';
import type { AggregatedCalls } from './pass/types';
import type { UseLight } from './light-data';

import { use, quote, yeet, memo, provide, multiGather, extend, useContext, useMemo, useOne } from '@use-gpu/live';
import { bindBundle, bundleToAttributes, bindEntryPoint, getBundleKey } from '@use-gpu/shader/wgsl';
import { makeBindGroupLayout, makeBindGroup, makeDataBindingsEntries, makeTextureView } from '@use-gpu/core';

import { LightContext } from '../../providers/light-provider';
import { PassContext } from '../../providers/pass-provider';
import { useDeviceContext } from '../../providers/device-provider';
import { useInspectable } from '../../hooks/useInspectable'
import { getBoundShader } from '../../hooks/useBoundShader';

import { Await } from './await';

import { LightData } from './light-data';

import { DebugRender } from './forward/debug';
import { DepthRender } from './forward/depth';
import { ShadedRender } from './forward/shaded';
import { SolidRender } from './forward/solid';
import { PickingRender } from './forward/picking';
import { UIRender } from './forward/ui';

import { ColorPass } from '../pass/color-pass';
import { ComputePass } from '../pass/compute-pass';
import { PickingPass } from '../pass/picking-pass';
import { ReadbackPass } from '../pass/readback-pass';
import { ShadowPass } from '../pass/shadow-pass';

import lightUniforms from '@use-gpu/wgsl/use/light.wgsl';
import { Light as WGSLLight } from '@use-gpu/wgsl/use/types.wgsl';
import { applyLight as applyLightWGSL } from '@use-gpu/wgsl/material/light.wgsl';
import { applyLights as applyLightsWGSL } from '@use-gpu/wgsl/material/lights.wgsl';

const LIGHT_BINDINGS = bundleToAttributes(applyLightWGSL);
const LIGHTS_BINDINGS = bundleToAttributes(applyLightsWGSL);

const getLightCount = bindEntryPoint(lightUniforms, 'getLightCount');
const getLight = bindEntryPoint(lightUniforms, 'getLight');
const sampleShadow = bindEntryPoint(lightUniforms, 'sampleShadow');

type RenderComponents = {
  modes: Record<string, LiveComponent<any>>,
  renders: Record<string, LiveComponent<any>>,
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

export const getComponents = ({modes = {}, renders = {}}: RenderComponents) => {
  return {
    modes: {
      shadow: DepthRender,
      debug: DebugRender,
      picking: PickingRender,
      ...modes,
    },
    renders: {
      solid: SolidRender,
      shaded: ShadedRender,
      ui: UIRender,
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

  const context = useMemo(() => {

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
      components.modes[mode] ?? components.renders[render];

    const getVariants = (!shadows && !picking && !passes)
       ? (virtual, hovered) => hovered ? [getRender(HOVERED_VARIANT)] : getRender(virtual.mode, virtual.renderer)

       : (virtual, hovered) => {
          const {id, mode, renderer, links, defines} = virtual;

          const variants = [];
          if (shadows && mode !== 'shadow' && defines?.HAS_SHADOW) {
            variants.push('shadow');
          }
          if (picking && mode !== 'picking' && links?.getPicking) {
            variants.push('picking');
          }
          if (variants.length === 0) return getRender(hovered ? HOVERED_VARIANT : mode, renderer);

          variants.push(hovered ? HOVERED_VARIANT : mode);
          return variants.map(mode => getRender(mode, renderer));
        };

    const useVariants = (virtual, hovered) => 
      useMemo(() => getVariants(virtual, hovered), [getVariants, virtual, hovered]);

    return {useVariants, layout, bind};
  }, [lights, shadows, picking]);

  const Resume = (
    calls: AggregatedCalls,
  ) =>
    useMemo(() => {
      const props = {calls};

      if (overlay) props.overlay = true;
      if (merge) props.merge = true;

      if (passes) {
        return passes.map(element => extend(element, props));
      }
      
      return [
        calls.compute ? use(ComputePass, props) : null,
        shadows && calls.shadow ? use(ShadowPass, props) : null,
        use(ColorPass, props),
        calls.post || calls.readback ? use(ReadbackPass, props) : null,
        picking && calls.picking ? use(PickingPass, props) : null,
      ];
    }, [context, calls, passes, overlay, merge]);

  const view = lights ? use(LightData, {
    render: (
      useLight: UseLight,
    ) => {
      const context = useMemo(() => {
        const bindMaterial = (applyMaterial: ShaderModule) => {
          const applyLight = bindBundle(applyLightWGSL, {applyMaterial});
          return getBoundShader(applyLightsWGSL, LIGHTS_BINDINGS, [applyLight, getLightCount, getLight, sampleShadow]);
        };

        const useMaterial = (applyMaterial: ShaderModule) =>
          useMemo(() => bindMaterial(applyMaterial), [bindMaterial, applyMaterial]);

        return {useLight, useMaterial};
      }, [useLight]);

      return provide(LightContext, context, children);
    },
  }) : children;

  return provide(PassContext, context, multiGather(view, Resume));
}, 'ForwardRenderer');
