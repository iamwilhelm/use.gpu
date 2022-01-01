import { LiveFiber, LiveComponent, LiveElement } from '@use-gpu/live/types';

import { memo, consume, resume, makeContext, useConsumer, useOne, useMemo, getTailValue } from '@use-gpu/live';

export const CursorContext = makeContext(null, 'CursorContext');

export type CursorProps = {
  cursor?: string,
};

export type CursorConsumerProps = {
  element: HTMLElement,
  children: LiveElement<any>,
};

export const CursorConsumer: LiveComponent<CursorConsumerProps> = (fiber) => (props) => {
  const {element, children} = props;
  
  const Resume = useOne(() => 
    resume((fiber: LiveFiber<any>) => (registry: Map<LiveFiber<any>, string>) => {
      const cursor = getTailValue(registry) ?? 'default';
      if (element.style.cursor !== cursor) element.style.cursor = cursor;
    }, 'CursorConsumer'),
    element);

  return consume(CursorContext, children, Resume);
};

export const Cursor: LiveComponent<CursorProps> = memo((fiber) => (props) => {
  useConsumer(CursorContext, props.cursor);
  return null;
}, 'Cursor');
