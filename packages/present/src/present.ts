import type { LC, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { EffectTrait, TransitionTrait, SlideEase, ResolvedSlides } from './types';

import { fragment, reconcile, quote, gather, provide, useContext, useNoContext, useMemo, useOne, useRef, useState } from '@use-gpu/live';
import { useAnimationFrame, useNoAnimationFrame, useShaderRef, useTimeContext, LoopContext, KeyboardContext } from '@use-gpu/workbench';
import { useBoundShader } from '@use-gpu/workbench';

import { resolveSlides } from './lib/slides';
import { PresentContext, usePresentContext } from './providers/present-provider';
import { useTransitionTrait, SLIDE_EFFECTS } from './traits';

import { getSlideMask } from '@use-gpu/wgsl/mask/slide.wgsl';
import { getSlidePosition } from '@use-gpu/wgsl/transform/slide.wgsl';

const NO_VEC4 = [0, 0, 0, 0];

export type PresentProps = {
  step?: number,
  keys?: boolean,
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

export const Present: LC<PresentProps> = (props: PropsWithChildren<PresentProps>) => {
  const {
    step: initialStep = 0,
    keys = false,
    children,
  } = props;
  
  const [state, setState] = useState(() => ({
    step: initialStep,
    length: 0,
    direction: 0,
  }));

  const [map, setMap] = useState<SlideMap>(NO_MAP);

  const stateRef = useRef(state);
  const mapRef = useRef(map);
  stateRef.current = state;
  mapRef.current = map;
  
  useOne(() => {
    if (state.step !== initialStep) setState(s => ({...s, step: initialStep}));
  }, initialStep);
  
  const api = useOne(() => {
    const goTo = (step: number) => setState(s => {
      step = clamp(step, 0, s.length);
      const direction = (s.step !== step) ? Math.sign(step - s.step) : s.direction;
      return {...s, step, direction};
    });

    const goForward = () => {
      const {current: {step}} = stateRef;
      goTo(step + 1);
    };
    const goBack = () => {
      const {current: {step}} = stateRef;
      goTo(step - 1);
    };

    const getVisibleState = (id: number) => {
      const {current: {step}} = stateRef;
      const {current: map} = mapRef;
      
      if (!map.size) return null;

      const slide = map.get(id);
      if (!slide) return -1;

      return step < slide.from ? -1 : step >= slide.to ? 1 : 0;
    };
    
    const isVisible = (id: number) => Math.abs(getVisibleState(id)) !== -1;
    const useTransition = makeUseTransition(getVisibleState);

    return {goTo, goForward, goBack, isVisible, getVisibleState, useTransition};
  });

  const {keyboard} = keys ? useContext(KeyboardContext) : (useNoContext(KeyboardContext), {});
  useOne(() => {
    if (!keys) return;

    const {keys: {arrowLeft, arrowRight, arrowUp, arrowDown}} = keyboard;
    if (arrowRight || arrowDown) {
      api.goForward();
    }
    if (arrowLeft || arrowUp) {
      api.goBack();
    }
  }, keyboard);

  const context = useOne(() => {
    return {
      state,
      ...api,
    };
  }, [api, state]);

  return reconcile(
    gather(
      quote(
        provide(PresentContext, context, children)
      ), (slides: SlideInfo[]) => {
        
        useMemo(() => {
          const {resolved, length} = resolveSlides(slides);
          setState(s => ({...s, length}));

          const map = new Map();
          for (const slide of resolved) map.set(slide.id, slide);
          setMap(map);
        }, [slides])
        
      }
    )
  );
};

const merge = (a, b) => {
  const o = {...a};
  for (const k in b) if (b[k] != null) o[k] = b[k];
  return o;
};

export const usePresentTransition = (id: number, props: Partial<TransitionTrait>, origin: Rectangle) => {
  const {effect, enter, exit} = useTransitionTrait(props);

  const e = useRef(0);
  const d = useRef(NO_VEC4);
  const v = useRef(0);
  const o = useShaderRef(origin);

  const mask = useBoundShader(getSlideMask, [e, d, v]);
  const transform = useBoundShader(getSlidePosition, [e, d, v, o]);

  const enterEffect = useOne(() => merge(effect, enter), [effect, enter]);
  const exitEffect = useOne(() => merge(effect, exit), [effect, exit]);

  const useUpdateTransition = () => {
    const {useTransition, isVisible} = usePresentContext();

    const value = useTransition(id, enterEffect, exitEffect);
    v.current = value;
    
    const isEnter = value <= 0;
    useOne(() => {
      const fx = isEnter ? enterEffect : exitEffect;
      const {type, direction} = fx;
      const index = SLIDE_EFFECTS.indexOf(type) || 0;

      e.current = index;
      d.current = direction;
    }, isEnter);

    return isVisible(id);
  };

  return {mask, transform, useUpdateTransition};
};

const makeUseTransition = (
  getVisibleState: (id: string) => number,
) => (
  id: number,
  enter: EffectTrait,
  exit: EffectTrait,
) => {
  const target = getVisibleState(id);
  const timer = useTimeContext();

  const timeRef = useRef<number | null>(null);
  const samplerRef = useRef<Sampler | null>(null);

  const valueRef = useRef<number>(target);
  const {request} = useContext(LoopContext);

  return useMemo(() => {
    const {delta} = timer;

    const {current: value} = valueRef;
    const active = (target + value) / 2 < 0 ? enter : exit;
    const {duration, delay} = active;

    if (target !== value) {
      if (value == null) return valueRef.current = target;
      
      let boost = 0;
      let from = value;
      let to = target;

      const {current: time} = timeRef;
      const {current: sampler} = samplerRef;
      if (time != null && sampler != null) {
        const slope = (sampler(time + EPSILON) - sampler(time)) / EPSILON;
        boost = slope - (to - from) / duration;
      }
      
      samplerRef.current = makeSampler(from, to, boost, duration, delay);
      valueRef.current = target;
      timeRef.current = 0;
    }
    
    const {current: time} = timeRef;
    const {current: sampler} = samplerRef;

    if (time != null) timeRef.current += delta / 1000;
    if (time == null || sampler == null) return valueRef.current;
    
    if (time < delay + duration) request();

    let offset = sampler(time);
    const {ease} = offset < 0 ? enter : exit;
    if (ease === 'cosine') offset = cosineEase(offset);

    return offset;
  }, [timer, target]);
};

const cosineEase = (t: number) => t - Math.sin(t * τ) / τ;

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
