import type { LC, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { Rectangle, Point4 } from '@use-gpu/core';
import type { ParsedEffect, SlideInfo, SlideEase, ResolvedSlide } from './types';
import type { ColorLike } from '@use-gpu/traits';

import { fragment, reconcile, quote, gather, provide, yeet, use, wrap, keyed, useContext, useMemo, useOne, useRef, useState, useFiber } from '@use-gpu/live';
import {
  useTimeContext,
  LoopContext,
  SDFFontProvider,

  useBoundShader,
  useBoundSource,
  useShaderRef,

  Pass, RawFullScreen, RenderTarget,
} from '@use-gpu/workbench';
import { UI, UILayers } from '@use-gpu/layout';
import { bindEntryPoint, bundleToAttributes } from '@use-gpu/shader/wgsl';
import { makeParseColor, parseColor, useProp } from '@use-gpu/traits';

import { resolveSlides } from './lib/slides';
import { PresentContext, usePresentContext, PresentAPI } from './providers/present-provider';
import { SLIDE_EFFECTS } from './traits';
import { Stage } from './stage';

import { getSlideMask } from '@use-gpu/wgsl/present/mask.wgsl';
import { getSlideMotion } from '@use-gpu/wgsl/present/motion.wgsl';

const NO_VEC4: Point4 = [0, 0, 0, 0];

export type PresentProps = {
  step?: number,
  onChange?: (step: number) => void,
  backgroundColor?: ColorLike,
};

const π = Math.PI;
const τ = π*2;
const EPSILON = 1e-3;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

type SlideMap = Map<number, ResolvedSlide>;
const NO_MAP: SlideMap = new Map();

type Transition = {
  from: number,
  to: number,
  boost: number,
};

type State = {
  step: number,
  length: number,
};

type Sampler = (t: number) => number;

const parseBackground = makeParseColor(parseColor('#000000'));

export const Present: LC<PresentProps> = (props: PropsWithChildren<PresentProps>) => {
  const {
    step: initialStep = 0,
    onChange,
    children,
  } = props;
  
  const backgroundColor = useProp(props.backgroundColor, parseBackground);

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
      if (!state || !map?.size) return 0;

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
  
    const isVisible = (id: number) => Math.abs(getVisibleState(id)) !== 1;
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
          }, [slides])

          return null;
        }
      )
    )
  );
};

const ATTRIBUTES = bundleToAttributes(getSlideMotion);

// GPU-rendered slide transition
export const usePresentTransition = (
  id: number,
  layout: Rectangle,
  enter: ParsedEffect,
  exit: ParsedEffect,
  initial?: number,
) => {
  const e = useRef(0);
  const d = useRef<Point4>(NO_VEC4);
  const v = useRef(0);
  const l = useShaderRef(layout);

  const es = useBoundSource(ATTRIBUTES[0], e);
  const ds = useBoundSource(ATTRIBUTES[1], d);
  const vs = useBoundSource(ATTRIBUTES[2], v);

  const mask = useBoundShader(getSlideMask, [es, ds, vs]);
  const transform = useBoundShader(getSlideMotion, [es, ds, vs, l]);

  const useUpdateTransition = () => {
    const {useTransition, isVisible} = usePresentContext();

    const value = useTransition(id, enter, exit, initial);
    v.current = value;

    const isEnter = value <= 0;
    useOne(() => {
      const fx = isEnter ? enter : exit;
      const {type, direction} = fx;
      const index = SLIDE_EFFECTS.indexOf(type!) || 0;

      e.current = index;
      d.current = direction;
    }, isEnter);

    return isVisible(id);
  };

  return {mask, transform, useUpdateTransition};
};

// CPU-side animator for a transition.
//
// Animates a value between [-1, 0, 1] for entering vs exiting,
// either of which can happen in reverse.
//
// The animated value scrubs linearly left or right, and smoothly adapts or reverses if interrupted.
// Easing is applied last, acting between the [-1, 0] and [0, 1] points.
const makeUseTransition = (
  getVisibleState: (id: number) => number,
) => (
  id: number,
  enter: ParsedEffect,
  exit: ParsedEffect,
  initial?: number,
): number => {
  const target = getVisibleState(id);
  const timer = useTimeContext();

  const timeRef = useRef<number | null>(null);
  const samplerRef = useRef<Sampler | null>(null);

  const valueRef = useRef<number>(initial ?? target);
  const {request} = useContext(LoopContext);

  return useMemo(() => {
    // Animate in relative time
    const {delta} = timer;
    const {current: value} = valueRef;

    // Determine whether entering or exiting
    const active = (target + (value ?? 0)) / 2 < 0 ? enter : exit;
    const {duration, delay} = active;

    // Trigger animation if target changes
    if (target !== value) {
      if (value != null) {
        let boost = 0;
        let from = value;
        let to = target;

        // Sample ongoing transition to determine velocity boost
        const {current: time} = timeRef;
        const {current: sampler} = samplerRef;
        if (time != null && sampler != null) {
          from = sampler(time);

          // Boost correction is relative to linear interpolation from A to B
          // because easing is applied after sampling
          const slope = (sampler(time + EPSILON) - from) / EPSILON;
          boost = slope - (to - from) / duration;
        }

        samplerRef.current = makeSampler(from, to, boost, duration, delay);
        timeRef.current = 0;
      }
      valueRef.current = target;
    }

    const {current: time} = timeRef;
    const {current: sampler} = samplerRef;

    if (time != null) timeRef.current! += delta / 1000;
    if (time == null || sampler == null) return valueRef.current!;

    const fiber = useFiber();
    if (time < delay + duration) request(fiber);

    let offset = sampler(time);
    const {ease} = offset < 0 ? enter : exit;
    if (ease === 'cosine') offset = cosineEase(offset);

    return offset;
  }, [timer, target]);
};

// Linear sampler with non-linear interruption boost to continue the existing motion.
const makeSampler = (
  from: number,
  to: number,
  boost: number,
  duration: number,
  delay: number,
) => (
  time: number,
) => {
  let t = clamp((time - delay) / duration, 0, 1);

  let f = lerp(from, to, t);
  if (boost) {
    let i = clamp(time / duration, 0, 1);
    f += boost * duration * i * (1 - i) * (1 - i);
  }

  return f;
};

const cosineEase = (t: number) => t - Math.sin(t * τ) / τ;
