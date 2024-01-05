import type { LiveComponent, LiveElement, DeferredCall, PropsWithChildren, RefObject } from '@use-gpu/live';
import type { TypedArray } from '@use-gpu/core';
import type { Keyframe } from './types';

import { clamp, lerp } from '@use-gpu/core';
import { use, extend, fence, useCallback, useDouble, useMemo, useOne } from '@use-gpu/live';
import { useTimeContext } from '../providers/time-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';
import { getRenderFunc } from '../hooks/useRenderProp';

import mapValues from 'lodash/mapValues';

const π = Math.PI;

export type AnimateProps<T> = {
  loop?: boolean,
  mirror?: boolean,
  repeat?: number,
  ease?: 'ease' | 'cosine' | 'linear' | 'bezier',

  delay?: number,
  rest?: number,
  duration?: number,
  speed?: number,

  tracks?: Record<string, Keyframe<T>[]>,
  keyframes?: Keyframe<T>[],
  prop?: string,

  paused?: boolean,

  render?: (value: any) => LiveElement,
  children?: LiveElement | ((value: any) => LiveElement),
};

// causes typescript docgen to crash if defined as recursive
type NestedNumberArray = any[];
type Numberish = number | TypedArray | NestedNumberArray;

export const Animate: LiveComponent<AnimateProps<Numberish>> = <T extends Numberish>(props: PropsWithChildren<AnimateProps<T>>) => {
  const {
    loop = false,
    mirror = false,
    repeat = Infinity,
    ease = 'cosine',

    delay = 0,
    rest = 0,
    speed = 1,
    paused = false,
    duration = null,

    tracks,
    keyframes,
    prop,

    children,
  } = props;

  const script = useMemo(() => (
    tracks ??
    ((keyframes && prop) ? {[prop]: keyframes} : null)
  ), [tracks, keyframes, prop]);
  if (!script) return null;

  const startedRef = useOne(() => ({current: -1}), script);
  const pausedRef = useOne(() => ({current: 0}), script);
  const length = useMemo(() => {
    if (duration) return duration;
    const tracks = Array.from(Object.values(script));
    return tracks.reduce((length, keyframes) => Math.max(length, keyframes[keyframes.length - 1][0]), 0)
  }, [script, duration]);

  const render = getRenderFunc(props);
  const swapValues = useDouble(() => mapValues(script, keyframes => makeValueRef(keyframes[0][1])), Object.keys(script));
  const swapElements = useDouble(() => children ? extend(children, swapValues()) : null, [children, swapValues]);

  const Run = useCallback(() => {
    const {
      timestamp,
      elapsed,
      delta,
    } = useTimeContext();

    let {current: started} = startedRef;
    if (started < 0) started = startedRef.current = elapsed;
    if (paused && !pausedRef.current) pausedRef.current = elapsed;
    
    if (!paused) {
      // Deduct pause time from elapsed on resume
      if (pausedRef.current) {
        startedRef.current += elapsed - pausedRef.current;
        pausedRef.current = 0;
      }
    }
    
    const time = Math.max(0, (elapsed - started) / 1000 - delay) * speed;
    const [t, max] = getLoopedTime(time, length, rest, repeat, mirror);

    const values = swapValues();
    for (let k in values) evaluateKeyframe(values[k], script[k], t, ease);

    // Run if not paused, not on first frame, or not past end
    if (!paused || pausedRef.current === elapsed && time < max) useAnimationFrame();
    else useNoAnimationFrame();

    if (render) return tracks ? render(values) : (prop ? render(values[prop]) : null);
    else if (typeof children === 'object') return swapElements();

    return null;
  }, [script, swapValues, swapElements, render, children]);

  // Fence so that continuation can change closure state
  return fence(null, Run);
};

const makeValueRef = (v: TypedArray | number) => new Float32Array(v.length || 1);

const evaluateKeyframe = <T>(
  target: T extends number ? RefObject<number> : T,
  keyframes: Keyframe<T>[],
  time: number,
  ease: string,
) => {
  const i = getActiveKeyframe(keyframes, time);
  const a = keyframes[i];
  const b = keyframes[i + 1] ?? a;

  const [start] = a;
  const [end] = b;
  const dt = end - start;

  let fraction = clamp(dt ? (time - start) / dt : 0, 0, 1);

  if (ease === 'bezier') {
    interpolateValue(target, a[1], b[1], fraction);
    //value = interpolateValueBezier(a[1], b[1], a[2], a[3], b[2], b[3], r);
  }
  else {
    if (ease === 'cosine') fraction = .5 - Math.cos(fraction * π) * .5;
    interpolateValue(target, a[1], b[1], fraction);
  }
};

const interpolateValue = (
  target: Float32Array | RefObject<number>,
  a: Float32Array | number,
  b: Float32Array | number,
  t: number,
) => {
  if (typeof a === 'number') target[0] = lerp(a as number, b as number, t);
  else {
    const n = target.length;
    for (let i = 0; i < n; ++i) target[i] = lerp(a[i], b[i], t);
  }
};

const getActiveKeyframe = <T>(keyframes: Keyframe<T>[], time: number) => {
  const n = keyframes.length;
  let i = 0;
  for (; i < n - 2; ++i) {
    if (time < keyframes[i + 1][0]) break;
  }
  return i;
};

const getLoopedTime = (time: number, duration: number, rest: number, repeat: number, mirror: boolean) => {
  const max = duration * (repeat + 1);
  let t = Math.min(max, time);

  let dp = duration + rest;
  if (mirror) {
    t = time % (dp * 2);
    if (t < dp) t = Math.min(duration, t);
    else t = duration - Math.min(duration, t - dp);
  }
  else {
    t = Math.min(duration, time % dp);
  }

  return [t, max];
}
