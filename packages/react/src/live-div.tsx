import React, { useLayoutEffect, useRef } from 'react';

import { render as renderLive } from '@use-gpu/live';
import { LiveFiber, DeferredCall } from '@use-gpu/live/types';

export type LiveDivProps = {
  style?: Record<string, any>,
  render: (div: HTMLDivElement) => DeferredCall<any>,
};

export const LiveDiv: React.FC<LiveDivProps> = ({style, render}) => {
  const el = useRef<HTMLDivElement>(null);
  const fiber = useRef<LiveFiber<any>>();

  useLayoutEffect(() => {
    if (el.current) {
      const children = render(el.current);
      fiber.current = renderLive(children, fiber.current);
    }
  }, [render]);

  return <div ref={el} style={style} />;
};
