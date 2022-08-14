import type { LiveFiber, LC, PropsWithChildren, LiveElement, ArrowFunction, DeferredCall } from '@use-gpu/live';

import {
  gather, provide, yeet, reconcile, quote, unquote,
  makeContext, useContext, useNoContext,
} from '@use-gpu/live';
import { RenderContext } from '../providers/render-provider';
import { PickingContext } from './picking';

export type QueueProps = {
  live?: boolean,
  render?: () => LiveElement,
};

export const Queue: LC<QueueProps> = (props: PropsWithChildren<QueueProps>): DeferredCall<any> => {
  const {render, children} = props;
  return reconcile(quote(gather(unquote(render ? render() : children), Resume)));
};

const Resume = (ts: ArrowFunction[]) => {
  const children: LiveElement = [];
  for (const task of ts) {
    const c = task();
    if (c) children.push(c);
  }

  return children.length ? children : null;
};
