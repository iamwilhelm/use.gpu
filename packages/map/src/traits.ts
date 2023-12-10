import { useOne } from '@use-gpu/live';
import {
  parseNumber,
  parseInteger,
  parseBoolean,
  parseString,
  parseStringArray,
  parseStringFormatter,
  parseVector,
  parseVec4,
  parsePosition,
  parseRotation,
  parseQuaternion,
  parseColor,
  parseScale,
  parseMatrix,
  parseJoin,
  parseBlending,
  parsePlacement,
  parseWeight,
  parseRange,
  parseRanges,
  parseAxes,
  parseAxis,
  parseIntegerPositive,
  parseDomain,
  parsePointShape,
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
  origin: [0, 0, 0],
  zoom: 1,
});

export const useGeographicTrait = makeUseTrait(GeographicTrait);
