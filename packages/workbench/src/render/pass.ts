import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';
import type { RenderPassMode } from '@use-gpu/core';

import { use, quote, yeet, memo, provide, multiGather, useContext, useMemo, useOne } from '@use-gpu/live';
import { PassContext } from '../providers/pass-provider';
import { useDeviceContext } from '../providers/device-provider';
import { useInspectable } from '../hooks/useInspectable'

import { Await } from './await';

import { DebugRender } from './forward/debug';
import { ShadedRender } from './forward/shaded';
import { SolidRender } from './forward/solid';
import { PickingRender } from './forward/picking';
import { UIRender } from './forward/ui';

import { ColorPass } from './pass/color-pass';
import { ComputePass } from './pass/compute-pass';
import { PickingPass } from './pass/picking-pass';
import { ReadbackPass } from './pass/readback-pass';

export type PassProps = {
  mode?: 'forward' | 'deferred',
  shadows?: boolean,
  picking?: boolean,
  
  components?: {
    modes: Record<string, LiveComponent<any>>,
    renderers: Record<string, LiveComponent<any>>,
  },
};

type RenderCounter = (v: number, t: number) => void;
export type RenderToPass = (
  passEncoder: GPURenderPassEncoder,
  countGeometry: RenderCounter,
) => void;

type ComputeCounter = (d: number) => void;
export type ComputeToPass = (
  passEncoder: GPUComputePassEncoder,
  countDispatch: ComputeCounter,
) => void;

export type CommandToBuffer = () => GPUCommandBuffer;

export type PassCallProps = {
  calls: {
    compute?: ComputeToPass[],
    opaque?: RenderToPass[],
    transparent?: RenderToPass[],
    debug?: RenderToPass[],
    picking?: RenderToPass[],
    shadow?: RenderToPass[],
    post?: CommandToBuffer[],
    readback?: ArrowFunction[],
  },
}

export type VirtualDraw = {
  pipeline: DeepPartial<GPURenderPipelineDescriptor>,
  defines: Record<string, any>,
  mode?: RenderPassMode | string,
  id?: number,

  vertexCount?: Lazy<number>,
  instanceCount?: Lazy<number>,
  indirect?: StorageSource, 

  passes?: LiveComponent<PassCallProps>[],
  renderer?: string,
  links?: Record<string, ShaderModule>,
};

const HOVERED_VARIANT = 'debug';

export const Pass: LC<PassProps> = memo((props: PropsWithChildren<PassProps>) => {
  const {
    mode = 'forward',
    shadows = false,
    picking = true,
    passes,
    children,
  } = props;

  const inspect = useInspectable();
  const device = useDeviceContext();

  // Provide draw call variants for sub-passes
  const context = useMemo(() => {
    const components = mode === 'deferred'
      ? getDeferredRenderer()
      : getForwardRenderer();

    const getRenderer = (mode, renderer = null) =>
      components.modes[mode] ?? components.renderers[renderer];

    const getVariants = (!shadows && !picking && !passes)
       ? (virtual, hovered) => hovered ? [getRenderer(HOVERED_VARIANT)] : getRenderer(virtual.mode, virtual.renderer)

       : (virtual, hovered) => {
          const {id, mode, renderer, links, defines} = virtual;
          if (hovered) return [getRenderer(HOVERED_VARIANT)];

          const variants = [];
          if (shadows && mode !== 'shadow' && defines?.HAS_SHADOW) {
            variants.push('shadow');
          }
          if (picking && mode !== 'picking' && links?.getPicking) {
            variants.push('picking');
          }
          if (variants.length === 0) return getRenderer(mode, renderer);

          variants.push(mode);
          return variants.map(mode => getRenderer(mode, renderer));
        };

    const useVariants = (virtual, hovered) => 
      useMemo(() => getVariants(virtual, hovered), [getVariants, virtual, hovered]);

    return {getVariants, useVariants};
  }, [shadows, picking, mode]);

  const Resume = (calls: Record<string, (ComputeToPass | RenderToPass | CommandToBuffer | ArrowFunction)[]>) =>
    useMemo(() => {
      const props = {calls};

      if (passes) {
        return passes.map(Component => use(Component, props));
      }

      return [
        calls.compute ? use(ComputePass, props) : null,
        calls.shadow ? use(ShadowPass, props) : null,
        use(ColorPass, props),
        calls.post || calls.readback ? use(ReadbackPass, props) : null,
        picking && calls.picking ? use(PickingPass, props) : null,
      ];
    }, [context, calls, passes]);

  return multiGather(provide(PassContext, context, children), Resume);
}, 'Pass');

export const getForwardRenderer = () => {
  return {
    modes: {
      shadow: null,
      debug: DebugRender,
      picking: PickingRender,
    },
    renderers: {
      solid: SolidRender,
      shaded: ShadedRender,
      ui: UIRender,
    }
  }
};

export const getDeferredRenderer = () => {
  throw new Error();
};