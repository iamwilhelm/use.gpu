import type { LC, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { EffectTrait, SlideEase, ResolvedSlides } from './types';
import type { ColorLike } from '@use-gpu/traits';

import { fragment, reconcile, quote, gather, provide, yeet, use, wrap, keyed, useContext, useMemo, useOne, useRef, useState, useFiber } from '@use-gpu/live';
import {
  useTimeContext,
  LoopContext,
  KeyboardContext,
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
import { Screen } from './screen';

import { getSlideMask } from '@use-gpu/wgsl/mask/slide.wgsl';
import { getSlidePosition } from '@use-gpu/wgsl/transform/slide.wgsl';

const NO_VEC4 = [0, 0, 0, 0];

export type PresentProps = {
  step?: number,
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
    children,
  } = props;
  
  const backgroundColor = useProp(props.backgroundColor, parseBackground);

  // Presentation state starts out empty
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

  // Respond to external step change
  useOne(() => {
    if (state.step !== initialStep) setState(s => ({...s, step: initialStep}));
  }, initialStep);

  // Navigation API
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

    const isThread = (id: number) => {
      const {current: map} = mapRef;
      const slide = map.get(id);
      return !!slide?.thread;
    };
  
    const isVisible = (id: number) => Math.abs(getVisibleState(id)) !== 1;
    const useTransition = makeUseTransition(getVisibleState);

    return {goTo, goForward, goBack, isThread, isVisible, getVisibleState, useTransition};
  });
  
  console.log('step', state.step)

  const context = useOne(() => {
    return {
      state,
      ...api,
    };
  }, [api, state]);
  
  const view = useViewRenderer(state.step, api, backgroundColor, children);

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

        }
      )
    )
  );
};

const ATTRIBUTES = bundleToAttributes(getSlidePosition);

// Presentation view renderer
const useViewRenderer = (
  step: number,
  api: PresentAPI,
  backgroundColor: ColorLike,
  children: LiveElement,
) => {
  return useMemo(
    () => {

      // Render keyed layers for entering and exiting
      const renderLayer = ({id, ops}: ResolvedLayer, effect: EffectTrait, opaque: boolean = false) => (
        keyed(RenderTarget, id, {
          format: 'rgba16float',
          colorSpace: 'linear',
          depthStencil: null,
          samples: 1,
          children: wrap(Pass, use(UILayers, {items: ops})),
          then: (texture) => use(Screen, {id, texture, effect, opaque, fill: opaque ? [1, 0, 1, 1] : [0, 1, 1, 1]})
        })
      );
      
      return gather(
        wrap(SDFFontProvider, children),
        (layers: ResolvedLayer[]) => {
          // Find main slide thread + extra floats
          const threads = layers.filter(({id}) =>  api.isThread(id));
          const floats  = layers.filter(({id}) => !api.isThread(id));

          const threadIds = threads.map(({id}) => id);
          const floatIds  = floats.map(({id}) => id);
        
          // Get entering slide (only one at a time)
          const entering = threadIds.filter((id) => api.isVisible(id))[0] ?? null;

          // Track exiting state
          const exitingRef = useRef<number | null>(null);
          const lastEnteringRef = useRef<number | null>(null);

          let {current: exiting} = exitingRef;
          let {current: lastEntering} = lastEnteringRef;

          if (lastEntering !== entering) {
            exitingRef.current = exiting = lastEntering;
            lastEnteringRef.current = lastEntering = entering;
          }

          // Merge exit / entering effects
          const enteringIndex = threadIds.indexOf(entering);
          const exitingIndex = threadIds.indexOf(exiting);

          const enteringLayer = threads[enteringIndex];
          const exitingLayer = threads[exitingIndex];
          
          const effect = threads[Math.max(enteringIndex, exitingIndex)]?.enter;

          // Layer pair
          return useMemo(() => [
            (exitingLayer && exitingLayer !== enteringLayer) ? renderLayer(exitingLayer, effect, !!enteringLayer) : null,
            enteringLayer ? renderLayer(enteringLayer, effect) : null,
          ], [enteringLayer, exitingLayer, effect]);
        }
      );
    },
    [step, api, backgroundColor]
  );
};

// GPU-rendered slide transition
export const usePresentTransition = (
  id: number,
  layout: Rectangle,
  enter: Partial<EffectTrait>,
  exit: Partial<EffectTrait>,
) => {
  const e = useRef(0);
  const d = useRef(NO_VEC4);
  const v = useRef(0);
  const l = useShaderRef(layout);

  const es = useBoundSource(ATTRIBUTES[0], e);
  const ds = useBoundSource(ATTRIBUTES[1], d);
  const vs = useBoundSource(ATTRIBUTES[2], v);

  const mask = useBoundShader(getSlideMask, [es, ds, vs]);
  const transform = useBoundShader(getSlidePosition, [es, ds, vs, l]);

  const useUpdateTransition = () => {
    const {useTransition, isVisible} = usePresentContext();

    const value = useTransition(id, enter, exit);
    v.current = value;

    const isEnter = value <= 0;
    useOne(() => {
      const fx = isEnter ? enter : exit;
      const {type, direction} = fx;
      const index = SLIDE_EFFECTS.indexOf(type) || 0;

      e.current = index;
      d.current = direction;
    }, isEnter);

    return isVisible(id);
  };

  return {mask, transform, useUpdateTransition};
};

// CPU-side animator for a transition
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
        from = sampler(time);
        const slope = (sampler(time + EPSILON) - from) / EPSILON;
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

// Linear sampler with non-linear interruption boost
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
