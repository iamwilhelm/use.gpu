import { makeParseEnum, makeParseInt, makeParseVec2, makeParseArray } from '@use-gpu/workbench/traits/parse';
import { Domain }  from './types';
import { vec2 } from 'gl-matrix';

const NO_RANGE = vec2.fromValues(-1, 1);
const NO_RANGES = [NO_RANGE, NO_RANGE, NO_RANGE, NO_RANGE];

const AXIS_NUMBERS = {'x': 0, 'y': 1, 'z': 2, 'w': 3} as Record<string, number>;
const AXIS_LETTERS = ['x', 'y', 'z', 'w'];

/** @category Parsers */
export const makeParseAxis = (def: number) => (s?: string) => {
  if (s != null) return AXIS_NUMBERS[s] ?? def;
  return def;
};

/** @category Parsers */
export const makeParseBasis = (defaults: string) => {
  const axes = defaults.split('');
  const order = [0, 1, 2, 3];

  const getOrder = (s: string) => {
    order.sort((a, b) => {
      const ai = s.indexOf(axes[a]);
      const bi = s.indexOf(axes[b]);
      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai < 0 && bi < 0) return a - b;
      return (ai < 0) ? 1 : -1;
    });
    return order.map(x => AXIS_LETTERS[x]).join('');
  };

  return (s?: string) => {
    if (s != null) return getOrder(s);
    return defaults;
  }
};

/** @category Parsers */
export const parseAxes   = makeParseBasis('xyzw');
/** @category Parsers */
export const parseAxis   = makeParseAxis(0);

/** @category Parsers */
export const parseRange  = makeParseVec2(NO_RANGE);
/** @category Parsers */
export const parseRanges = makeParseArray(NO_RANGES, parseRange);

/** @category Parsers */
export const parseDetail = makeParseInt(1, 1, 1e8);
/** @category Parsers */
export const parseDomain = makeParseEnum<Domain>(['linear', 'log']);
