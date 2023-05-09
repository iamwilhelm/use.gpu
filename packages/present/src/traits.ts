import { useOne } from '@use-gpu/live';
import {
  makeUseTrait,
  useProp,
  parseInteger,
  optional,
} from '@use-gpu/traits';
import type {
  SlideTrait,
} from './types';

import { vec4 } from 'gl-matrix';

const SLIDE_TRAIT = {
  order: optional(parseInteger),
  step: optional(parseInteger),
  stay: optional(parseInteger),
};

const SLIDE_DEFAULTS = {};

export const useSlideTrait = makeUseTrait<SlideTrait>(SLIDE_TRAIT, SLIDE_DEFAULTS);
