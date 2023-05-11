import { useOne } from '@use-gpu/live';
import {
  makeUseTrait,
  makeParseTrait,
  makeParseEnum,
  useProp,
  parseInteger,
  parseNumber,
  optional,
} from '@use-gpu/traits';
import type {
  EffectTrait,
  SlideTrait,
  TransitionTrait,
  SlideEase,
  SlideEffect,
} from './types';

import { vec4 } from 'gl-matrix';
import mapValues from 'lodash/mapValues';

export const SLIDE_EFFECTS = ['none', 'fade', 'wipe', 'move'];

export const SLIDE_DIRECTIONS = {
  left: [-1, 0, 0, 0],
  right: [1, 0, 0, 0],
  up: [0, -1, 0, 0],
  down: [0, 1, 0, 0],
  forward: [0, 0, -1, 0],
  back: [0, 0, 1, 0],
};

export type SlideDirection = 'left' | 'right' | 'up' | 'down' | 'forward' | 'back';

const parseSlideDirection = (s: any) => {
  if (s in SLIDE_DIRECTIONS) return SLIDE_DIRECTIONS[s];
  if (s.length) return s;
};

const EFFECT_TRAIT = {
  type: makeParseEnum<SlideEffect>(SLIDE_EFFECTS),
  ease: makeParseEnum<SlideEase>(['cosine', 'linear']),
  direction: parseSlideDirection,
  delay: parseNumber,
  duration: parseNumber,
};

const EFFECT_DEFAULTS = {
  effect: 'fade',
  direction: 'right',
  ease: 'cosine',
  delay: 0,
  duration: 0.15,
};

const PARTIAL_EFFECT_TRAIT = mapValues(EFFECT_TRAIT, t => optional(t));

const parseEffectTrait = makeParseTrait(EFFECT_TRAIT, EFFECT_DEFAULTS);
const parsePartialEffectTrait = makeParseTrait(PARTIAL_EFFECT_TRAIT, {});

const SLIDE_TRAIT = {
  order: optional(parseInteger),
  step: optional(parseInteger),
  stay: optional(parseInteger),
};

const SLIDE_DEFAULTS = {};

const TRANSITION_TRAIT = {
  effect: parseEffectTrait,
  enter: optional(parsePartialEffectTrait),
  exit: optional(parsePartialEffectTrait),
};

const TRANSITION_DEFAULTS = {
  effect: {},
};

export const useEffectTrait = makeUseTrait<EffectTrait>(EFFECT_TRAIT, EFFECT_DEFAULTS);
export const useSlideTrait = makeUseTrait<SlideTrait>(SLIDE_TRAIT, SLIDE_DEFAULTS);
export const useTransitionTrait = makeUseTrait<TransitionTrait>(TRANSITION_TRAIT, TRANSITION_DEFAULTS);
