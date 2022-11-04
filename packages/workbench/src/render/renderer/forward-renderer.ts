import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';
import type { DataBounds, UseGPURenderContext, RenderPassMode } from '@use-gpu/core';
import type { AggregatedCalls } from './pass/types';

import { use, quote, yeet, memo, provide, multiGather, extend, useContext, useMemo, useOne } from '@use-gpu/live';
import { proxy } from '@use-gpu/core';

import { PassContext } from '../../providers/pass-provider';
import { useDeviceContext } from '../../providers/device-provider';
import { useInspectable } from '../../hooks/useInspectable'

import { Await } from './await';

import { DebugRender } from './forward/debug';
import { ShadedRender } from './forward/shaded';
import { SolidRender } from './forward/solid';
import { PickingRender } from './forward/picking';
import { UIRender } from './forward/ui';

import { ColorPass } from '../pass/color-pass';
import { ComputePass } from '../pass/compute-pass';
import { PickingPass } from '../pass/picking-pass';
import { ReadbackPass } from '../pass/readback-pass';

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
      shadow: null,
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

  // Provide draw call variants for sub-passes
  const context = useMemo(() => {
    const components = getComponents(props.components ?? {});

    const getRender = (mode, render = null) =>
      components.modes[mode] ?? components.renders[render];

    const getVariants = (!shadows && !picking && !passes)
       ? (virtual, hovered) => hovered ? [getRender(HOVERED_VARIANT)] : getRender(virtual.mode, virtual.renderer)

       : (virtual, hovered) => {
          const {id, mode, renderer, links, defines} = virtual;
          if (hovered) return [getRender(HOVERED_VARIANT)];

          const variants = [];
          if (shadows && mode !== 'shadow' && defines?.HAS_SHADOW) {
            variants.push('shadow');
          }
          if (picking && mode !== 'picking' && links?.getPicking) {
            variants.push('picking');
          }
          if (variants.length === 0) return getRender(mode, renderer);

          variants.push(mode);
          return variants.map(mode => getRender(mode, renderer));
        };

    const useVariants = (virtual, hovered) => 
      useMemo(() => getVariants(virtual, hovered), [getVariants, virtual, hovered]);

    return {getVariants, useVariants};
  }, [shadows, picking]);

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

  return multiGather(provide(PassContext, context, children), Resume);
}, 'ForwardRenderer');
