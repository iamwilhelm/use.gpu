import { useOne } from '@use-gpu/live';
import {
  parseNumber,
} from '@use-gpu/parse';
import {
  optional, trait, makeUseTrait,
} from '@use-gpu/traits/live';

import { vec4 } from 'gl-matrix';

export const GeographicTrait = trait({
  long: parseNumber,
  lat: parseNumber,
  zoom: parseNumber,
}, {
  zoom: 1,
});

export const useGeographicTrait = makeUseTrait(GeographicTrait);
