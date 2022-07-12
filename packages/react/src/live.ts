import React, { useLayoutEffect, useMemo, useRef } from 'react';

import { LiveFiber, LiveElement } from '@use-gpu/live/types';
import { render as renderLive, use, morph, resolveRootNode } from '@use-gpu/live';

export type LiveProps = {
  /** Live child to render (must be 1) */
  children: LiveElement<any>,
};

/**
 * Run bare Live fiber inside React. Portal from React to Live.
 */
export const Live: React.FunctionComponent<LiveProps> = ({children}) => {
  const fiber = useRef<LiveFiber<any>>();

  const rootNode = useMemo(() => resolveRootNode(children), [children]);
  fiber.current = renderLive(rootNode, fiber.current);

  return null;
};
