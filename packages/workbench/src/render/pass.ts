import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { UseGPURenderContext } from '@use-gpu/core';

import { use, gather, memo } from '@use-gpu/live';

import { ForwardRenderer } from './renderer/forward-renderer';
import { DeferredRenderer } from './renderer/deferred-renderer';
import { GBuffer } from './gbuffer';

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
  if (mode === 'deferred') {
    return use(GBuffer, {
      render: (gbuffer: UseGPURenderContext) =>
        use(DeferredRenderer, {gbuffer, shadows, picking, overlay, merge, children})
    });
  }

  return null;
}, 'Pass');
