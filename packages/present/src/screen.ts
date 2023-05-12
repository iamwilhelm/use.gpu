import type { LC } from '@use-gpu/live';
import type { TextureSource } from '@use-gpu/core';
import type { SlideEffect } from './types';
import type { ColorLike } from '@use-gpu/traits';

import { use, useOne } from '@use-gpu/live';
import { useBoundSource, useLayoutContext, UIRectangles } from '@use-gpu/workbench';
import { usePresentTransition } from './present';

export type ScreenProps = {
  id: number,
  texture: TextureSource,
  effect: SlideEffect,
  fill: ColorLike,
  opaque: boolean,
};

const NO_EFFECT: any = {};

export const Screen: LC<ScreenProps> = (props: ScreenProps) => {
  const {
    id,
    texture,
    effect,
    fill,
    opaque,
  } = props;

  const layout = useLayoutContext();
  const {useUpdateTransition, transform, mask} = usePresentTransition(id, layout, effect, effect);

  const copyTexture = useOne(() => ({...texture, absolute: true}), texture);

  useUpdateTransition();
  
  return use(UIRectangles, {
    count: 1,
    rectangle: layout,
    texture: copyTexture,
    fill,
    transform,
    mask: opaque ? null : mask,
    copyOnly: true,
  });
};

