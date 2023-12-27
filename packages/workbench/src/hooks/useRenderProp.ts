import type { LiveElement } from '@use-gpu/live';
import { yeet, useHooks, useNoHooks, useOne, useNoOne } from '@use-gpu/live';

export type RenderProp<T> = {
  render?: (t: T) => LiveElement,
  children?: (t: T) => LiveElement,
};

export const useRenderProp = <T>(props: RenderProp<T>, arg: T): LiveElement => {
  const call = getRenderFunc(props);

  const rendered = call ? useHooks(() => call(arg), [call, arg]) : useNoHooks();
  const returned = !call ? useOne(() => yeet(arg), arg) : useNoOne();

  return call ? rendered : returned;
};

export const getRenderFunc = <T>(props: RenderProp<T>): LiveElement => {
  const {render, children} = props;
  return typeof children === 'function' ? children : render;
};
