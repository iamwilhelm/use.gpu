import React, { useLayoutEffect, useRef } from 'react';

import { render as renderLive } from '@use-gpu/live';
import { LiveFiber, DeferredCall } from '@use-gpu/live/types';

export type LiveCanvasProps = {
  style?: Record<string, any>,
  render: (canvas: HTMLCanvasElement) => DeferredCall<any>,
};

export const LiveCanvas: React.FC<LiveCanvasProps> = ({style, render}) => {
  const el = useRef<HTMLCanvasElement>(null);
  const fiber = useRef<LiveFiber<any>>();

  useLayoutEffect(() => {
    if (el.current) {
      const children = render(el.current);
      fiber.current = renderLive(children, fiber.current);
    }
  }, [render]);

  return <canvas ref={el} style={style} />;
};
