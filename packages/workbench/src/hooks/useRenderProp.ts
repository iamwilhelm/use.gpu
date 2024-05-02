import type { LiveElement, RenderProp } from '@use-gpu/live';
import { yeet, useHooks, useNoHooks, useOne, useNoOne, formatValue } from '@use-gpu/live';

export type RenderProps<T> = {
  render?: (t: T) => LiveElement,
  children?: (t: T) => LiveElement,
};

export const useRenderProp = <T>(props: RenderProps<T>, arg: T): LiveElement => {
  const call = getRenderFunc(props);
  if (!call && props.children)  throw new Error(`Expected render function as children, got: ${formatValue(props.children)}`);

  const rendered = call ? useHooks(() => call(arg), [call, arg]) : useNoHooks();
  const returned = !call ? useOne(() => yeet(arg), arg) : useNoOne();

  return call ? rendered : returned;
};

export const getRenderFunc = <T>(props: RenderProps<T>): RenderProp => {
  const {render, children} = props;
  if (typeof children === 'function') return children;
  if (render) return render;
  return null;
};
