import { LiveComponent, LiveElement, DeferredCall } from '@use-gpu/live/types';
import { TypedArray } from '@use-gpu/core/types';

import { useOne, reactInterop } from '@use-gpu/live';
import { useTimeContext } from '../providers/time-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';

import { Keyframe } from './types';

export type AnimationProps<T> = {
  loop?: boolean,
  mirror?: boolean,
  repeat?: number,
  ease?: 'cosine' | 'linear' | 'bezier',

  delay?: number,
  pause?: number,
  frames?: Keyframe<T>[],

  prop?: string,
  children?: LiveElement<any>,
  render?: (value: T) => LiveElement<any>,
};

const getActiveFrames = <T>(frames: Keyframe<T>[], time: number) => {
  const n = frames.length;
  let i = 0;
  for (; i < n - 1; ++i) {
    if (time < frames[i + 1][0]) break;
  }
  return [frames[i], frames[i + 1]];
};

const getLoopedTime = (time: number, duration: number, pause: number, repeat: number, mirror: boolean) => {
  const max = duration * (repeat + 1);
  let t = Math.min(max, time);

  let dp = duration + pause;
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

interface Interpolator {
  (a: number, b: number, t: number): number,
  <T extends Array<any>>(a: T, b: T, t: number): T,
  (a: TypedArray, b: TypedArray, t: number): number[],
};

const interpolateValue: Interpolator = <T>(a: any, b: any, t: number) => {
  if (a === +a && b === +b) {
    return (a * (1 - t) + b * t) as any as T;
  }
  if (a.length != null && b.length !== null) {
    let aa = a as T[];
    let bb = b as T[];
    let n = Math.min(aa.length, bb.length);
    let out: T[] = [];
    for (let i = 0; i < n; ++i) out.push(interpolateValue(aa[i] as any, bb[i] as any, t));
    return out;
  }
  return a;
};

const injectProp = (prop: string, value: any) => (call: LiveElement<any>): LiveElement<any> => {
  if (typeof call === 'string') return null;
  if (!call) return call;

  const c = reactInterop(call);
  if (Array.isArray(c)) return c.map(injectProp(prop, value)) as any as LiveElement<any>;
  if (c?.args) {
    const [props] = c.args;
    if (props) {
      c.args = [{
        ...props,
        [prop]: value,
      }];
    }
  }

  return c;
};

type NestedNumberArray = (number | NestedNumberArray)[];
type Numberish = number | TypedArray | NestedNumberArray;

export const Animation: LiveComponent<AnimationProps<Numberish>> = <T extends Numberish>(props: AnimationProps<T>) => {
  const {
    loop = false,
    mirror = false,
    repeat = Infinity,
    ease = 'cosine',

    delay = 0,
    pause = 0,
    frames,

    prop,
    render,
    children,
  } = props;

  const {
    timestamp,
    elapsed,
    delta,
  } = useTimeContext();

  if (!frames) return null;

  const started = useOne(() => elapsed, frames);
  const duration = useOne(() => frames[frames.length - 1][0], frames);

  let time = Math.max(0, (elapsed - started) / 1000 - delay);
  let [t, max] = getLoopedTime(time, duration, pause, repeat, mirror);

  const [a, b] = getActiveFrames(frames, t);
  const [start] = a;
  const [end] = b;

  const dt = end - start;

  let r = Math.max(0, Math.min(1, dt ? (t - start) / dt : 0));

  let value: any = null;

  if (ease === 'bezier') {
    value = interpolateValue(a[1] as any, b[1] as any, r);
    //value = interpolateValueBezier(a[1], b[1], a[2], a[3], b[2], b[3], r);
  }
  else {
    if (ease === 'cosine') r = .5 - Math.cos(r * Math.PI) * .5;
    value = interpolateValue(a[1] as any, b[1] as any, r);
  }

  if (time < max) useAnimationFrame();
  else useNoAnimationFrame();

  if (value == null) return null;
  if (render) return render(value);
  if (children && prop) {
    const list = Array.isArray(children) ? children.slice() : [children];
    list.map(injectProp(prop, value));
    return list;
  }

  return children ?? null;
};
