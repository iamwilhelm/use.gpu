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
