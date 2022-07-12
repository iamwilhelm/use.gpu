import React, { useLayoutEffect, useRef } from 'react';

import { LiveFiber, LiveElement } from '@use-gpu/live/types';
import { render as renderLive, resolveRootNode } from '@use-gpu/live';

export type LiveDivProps = {
  style?: Record<string, any>,
  render?: (div: HTMLDivElement) => LiveElement<any>,
  children?: (div: HTMLDivElement) => LiveElement<any>,
};

/**
 * Render a `<div>`. Portal from React to Live.
 */
export const LiveDiv: React.FunctionComponent<LiveDivProps> = ({style, render, children}) => {
  const el = useRef<HTMLDivElement>(null);
  const fiber = useRef<LiveFiber<any>>();

  useLayoutEffect(() => {
    if (el.current) {
      const content = (render ?? children);
      if (!content) return;
      
      const element = (typeof content === 'function') ? content(el.current) : content;
      const rootNode = resolveRootNode(element);
      fiber.current = renderLive(rootNode, fiber.current);
    }
  }, [render]);

  return <div ref={el} style={style} />;
};
