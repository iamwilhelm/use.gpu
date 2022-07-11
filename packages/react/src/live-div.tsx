import React, { useLayoutEffect, useRef } from 'react';

import { render as renderLive, resolveRootNode } from '@use-gpu/live';
import { LiveFiber, LiveElement } from '@use-gpu/live/types';

export type LiveDivProps = {
  style?: Record<string, any>,
  render: (div: HTMLDivElement) => LiveElement<any>,
};

/**
 * Render <div> for Live. Acts as a portal from React to Live.
 *
 * @category React Components
 */
export const LiveDiv: React.FC<LiveDivProps> = ({style, render}) => {
  const el = useRef<HTMLDivElement>(null);
  const fiber = useRef<LiveFiber<any>>();

  useLayoutEffect(() => {
    if (el.current) {
      const children = resolveRootNode(render(el.current));
      fiber.current = renderLive(children, fiber.current);
    }
  }, [render]);

  return <div ref={el} style={style} />;
};
