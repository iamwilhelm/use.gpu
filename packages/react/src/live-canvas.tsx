import React, { useLayoutEffect, useRef } from 'react';

import { LiveFiber, LiveElement } from '@use-gpu/live/types';
import { render as renderLive, resolveRootNode } from '@use-gpu/live';

export type LiveCanvasProps = {
  style?: Record<string, any>,
  render: (canvas: HTMLCanvasElement) => LiveElement<any>,
};

/**
 * Render <canvas> for Live. Acts as a portal from React to Live.
 */
export const LiveCanvas: React.FC<LiveCanvasProps> = ({style, render}) => {
  const el = useRef<HTMLCanvasElement>(null);
  const fiber = useRef<LiveFiber<any>>();

  useLayoutEffect(() => {
    if (el.current) {
      const children = resolveRootNode(render(el.current));
      fiber.current = renderLive(children, fiber.current);
    }
  }, [render]);

  return <canvas ref={el} style={style} />;
};
