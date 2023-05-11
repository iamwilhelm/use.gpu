export type SlideEffect = 'none' | 'fade' | 'wipe' | 'move';
export type SlideEase = 'cosine' | 'linear';

export type SlideDirection = 'left' | 'right' | 'up' | 'down' | 'forward' | 'back';

export type EffectTrait = {
  type: SlideEffect,
  direction: string,
  delay: number,
  duration: number,
  ease: 'cosine' | 'linear',
};

export type TransitionTrait = {
  effect?: EffectTrait,
  enter?: Partial<EffectTrait>,
  exit?: Partial<EffectTrait>,
};

export type SlideTrait = {
  order?: number,
  steps?: number,
  stay?: number,
};
export type SlideInfo = SlideTrait & {
  id: number,
  slides?: ResolvedSlide[],
};

export type ResolvedSlide = {
  id: number,
  from: number,
  to: number,
};
