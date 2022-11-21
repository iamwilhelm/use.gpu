import type { LC, PropsWithChildren } from '@use-gpu/live';

import { use, memo } from '@use-gpu/live';

import { ForwardRenderer } from './renderer/forward-renderer';

export type PassProps = {
  mode?: 'forward' | 'deferred',
  shadows?: boolean,
  lights?: boolean,
  picking?: boolean,
  overlay?: boolean,
  merge?: boolean,
};

export const Pass: LC<PassProps> = memo((props: PropsWithChildren<PassProps>) => {
  const {
    mode = 'forward',
    lights = false,
    shadows = false,
    picking = true,

    overlay = false,
    merge = false,

    children,
  } = props;

  if (mode === 'forward') {
    return use(ForwardRenderer, {lights, shadows, picking, overlay, merge, children});
  }

  return null;
}, 'Pass');
