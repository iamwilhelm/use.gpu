import type { LC, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { ColorLike, Rectangle, XYZW } from '@use-gpu/core';
import type { ParsedEffect, SlideInfo, SlideEase, ResolvedSlide } from './types';

import { reconcile, quote, gather, provide, use, keyed, useMemo, useOne, useRef, useState } from '@use-gpu/live';
import {
  useTimeContext,
  LoopContext,
  SDFFontProvider,
  Pass, RawFullScreen, RenderTarget,
} from '@use-gpu/workbench';
import { UI, UILayers } from '@use-gpu/layout';
import { makeParseColor, parseColor, useProp } from '@use-gpu/traits/live';
import { clamp } from '@use-gpu/core';

import { resolveSlides } from './lib/slides';
import { PresentContext, PresentAPI } from './providers/present-provider';
import { makeUseTransition } from './hooks';
import { Stage } from './stage';

export type PresentProps = {
  step?: number,
  onChange?: (step: number) => void,
  backgroundColor?: ColorLike,
};

type SlideMap = Map<number, ResolvedSlide>;
const NO_MAP: SlideMap = new Map();

type State = {
  step: number,
  length: number,
};

export const Present: LC<PresentProps> = (props: PropsWithChildren<PresentProps>) => {
  const {
    step: initialStep = 0,
    onChange,
    children,
  } = props;

  const backgroundColor = useProp(props.backgroundColor, parseBackground, '#000000');

  // Presentation state starts out empty
  const [state, setState] = useState(() => ({
    step: initialStep,
    length: 0,
  }));

  const [map, setMap] = useState<SlideMap>(NO_MAP);

  const stateRef = useRef<State>(state);
  const mapRef = useRef<SlideMap>(map);
  stateRef.current = state;
  mapRef.current = map;

  // Respond to external step change
  useOne(() => {
    if (state.step !== initialStep) setState(s => ({...s, step: initialStep}));
  }, initialStep);

  // Navigation API
  const api: PresentAPI = useOne(() => {
    const goTo = (step: number) => setState(s => {
      step = clamp(step, 0, s.length);
      onChange?.(step);
      return {...s, step};
    });

    const goForward = () => {
      const {current: state} = stateRef;
      if (!state) return;

      goTo(state.step + 1);
    };
    const goBack = () => {
      const {current: state} = stateRef;
      if (!state) return;

      goTo(state.step - 1);
    };

    const getVisibleState = (id: number) => {
      const {current: state} = stateRef;
      const {current: map} = mapRef;
      if (!state || !map?.size) return null;

      const slide = map.get(id);
      if (!slide) return -1;

      const {step} = state;
      return step < slide.from ? -1 : step >= slide.to ? 1 : 0;
    };

    const isThread = (id: number) => {
      const {current: map} = mapRef;
      if (!map) return true;

      const slide = map.get(id);
      return !!slide?.thread;
    };

    const isVisible = (id: number) => Math.abs(getVisibleState(id) ?? -1) !== 1;
    const useTransition = makeUseTransition(getVisibleState);

    return {goTo, goForward, goBack, isThread, isVisible, getVisibleState, useTransition};
  }, onChange);

  const context = useOne(() => {
    return {
      state,
      ...api,
    };
  }, [api, state]);

  const view = use(Stage, {
    step: state.step,
    api,
    backgroundColor,
    children,
    version: map.size,
  });

  return (
    // Reconcile the quoted presentation to extract a gather reduction over only the <Slide> and <Step> nodes, which unquote.
    reconcile(
      gather(
        quote(
          // Provide presentation state to future slides/step Resume(Fences)
          // and render view inside
          provide(PresentContext, context, view),
        ), (slides: SlideInfo[]) => {

          // Resolve gathered slides/steps into an ordered sequence
          useMemo(() => {
            const {resolved, length} = resolveSlides(slides);
            setState(s => ({...s, length}));

            // Build fiber to slide map
            const map = new Map();
            for (const slide of resolved) map.set(slide.id, slide);
            setMap(map);
          }, [slides]);

          return null;
        }
      )
    )
  );
};


