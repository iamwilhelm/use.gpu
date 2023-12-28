import type { LC, PropsWithChildren, LiveElement } from '@use-gpu/live';
import type { UseGPURenderContext } from '@use-gpu/core';
import type { LightEnv, RenderComponents, VirtualDraw, AggregatedCalls } from '../pass/types';

import { use, yeet, provide, unquote, multiGather, memo, useMemo, useOne } from '@use-gpu/live';

import { PassContext, VirtualContext } from '../providers/pass-provider';
import { PassReconciler } from '../reconcilers';

import { DebugRender } from './forward/debug';
import { SolidRender } from './forward/solid';

import { ColorPass } from '../pass/color-pass';
import { ComputePass } from '../pass/compute-pass';
import { DispatchPass } from '../pass/dispatch-pass';
import { ReadbackPass } from '../pass/readback-pass';

const {reconcile, quote} = PassReconciler;

export type FullScreenRendererProps = {
  overlay?: boolean,
  merge?: boolean,
};

const NO_ENV: Record<string, any> = {};

const PASSES = [
  use(ColorPass, {}),
];

const COMPONENTS = {
  modes: {
    debug: DebugRender,
    opaque: SolidRender,
    transparent: SolidRender,
  },
  renders: {},
} as RenderComponents;

export const FullScreenRenderer: LC<FullScreenRendererProps> = memo((props: PropsWithChildren<FullScreenRendererProps>) => {
  const {
    overlay = false,
    merge = false,
    children,
  } = props;

  const virtualContext = useOne(() => {
    const useVariants = (virtual: VirtualDraw, hovered: boolean) =>
      useMemo(() => hovered ? [DebugRender] : COMPONENTS.modes[virtual.mode], [virtual, hovered]);

    return useVariants;
  });

  // Pass aggregrated calls to pass runners
  const Resume = (
    calls: AggregatedCalls,
  ) =>
    useMemo(() => {
      const props: Record<string, any> = {calls, env: NO_ENV};

      if (overlay) props.overlay = true;
      if (merge) props.merge = true;

      return [
        calls.dispatch ? use(DispatchPass, props) : null,
        calls.compute ? use(ComputePass, props) : null,
        use(ColorPass, props),
        calls.post || calls.readback ? use(ReadbackPass, props) : null,
      ];
    }, [calls, overlay, merge]);

  return (
    reconcile(
      quote(
        provide(PassContext, NO_ENV,
          multiGather(
            unquote(
              provide(VirtualContext, virtualContext, children)
            ),
            Resume
          )
        )
      )
    )
  );

  return provide(PassContext, context, multiGather(children, Resume));
}, 'FullScreenRenderer');
