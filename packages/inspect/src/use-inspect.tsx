import { LiveFiber, LiveComponent, LiveElement } from '@use-gpu/live/types';
import { use } from '@use-gpu/live';
import { HTML } from '@use-gpu/react';

import React from 'react';
import { Inspect } from './components/inspect';

export type UseInspectProps = {
  fiber: LiveFiber<any>,
  canvas: HTMLCanvasElement,
};

const STYLE = {
  position: 'absolute',
  inset: '0',
  pointerEvents: 'none',
  zIndex: 10000,
};

export const UseInspect: LiveComponent<UseInspectProps> = ({fiber, canvas}) =>
  use(HTML, {
    container: canvas.parentElement,
    style: STYLE,
    children: <Inspect fiber={fiber} />,
  });
