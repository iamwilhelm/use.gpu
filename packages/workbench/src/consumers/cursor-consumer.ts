import { LiveFiber, LiveComponent, LiveElement } from '@use-gpu/live/types';

import { memo, consume, makeContext, useConsumer, useOne, useMemo, consumeTailValue } from '@use-gpu/live';

export const CursorContext = makeContext(undefined, 'CursorContext');

export type CursorProps = {
  cursor?: string,
};

export type CursorConsumerProps = {
  element: HTMLElement,
  children: LiveElement<any>,
};

export const CursorConsumer: LiveComponent<CursorConsumerProps> = (props) => {
  const {element, children} = props;
  
  const Resume = useOne(() => 
    (registry: Map<LiveFiber<any>, string>) => {
      const cursor = consumeTailValue(registry) ?? 'default';
      if (element.style.cursor !== cursor) element.style.cursor = cursor;
    },
    element);

  return consume(CursorContext, children, Resume);
};

export const Cursor: LiveComponent<CursorProps> = memo((props: CursorProps) => {
  useConsumer(CursorContext, props.cursor);
  return null;
}, 'Cursor');
