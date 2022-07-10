import React, { useLayoutEffect, useMemo, useRef } from 'react';

import { render as renderLive, use, morph, resolveRootNode } from '@use-gpu/live';
import { LiveFiber, LiveElement } from '@use-gpu/live/types';

export type LiveProps = {
  children: LiveElement<any>,
};

/**
 * Naked portal from React to Live.
 *
 * @category React Component
 */
export const Live: React.FC<LiveProps> = ({children}) => {
  const fiber = useRef<LiveFiber<any>>();

  const resolved = useMemo(() => resolveRootNode(children), [children]);
  fiber.current = renderLive(resolved, fiber.current);

  return null;
};
