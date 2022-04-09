import { useOne } from '@use-gpu/live';
import { PropDef } from './types';
import {
  parseFloat,
  parseInt,
  parseBoolean,
  parseString,
  parseStringArray,
  parseStringFormatter,
  parseVector,
  parsePosition4,
  parsePosition,
  parseRotation,
  parseQuaternion,
  parseColor,
  parseScale,
  parseMatrix,
  parseRange,
  parseRanges,
  parseAxes,
  parseAxis,
  parseDetail,
  parseDomain,
  parseJoin,
  parseBlending,
  parsePlacement,
  parseFlip,
  optional,
} from './util/parse';

import { vec4 } from 'gl-matrix';

const EMPTY: any[] = [];
const WHITE = [1, 1, 1, 1];

const ANCHOR_TRAIT = {
  placement:  parsePlacement,
  flip:       parseFlip,
  offset:     parseFloat,
};

const ANCHOR_DEFAULTS = {
  placement: 'center',
  flip: 'none',
  offset: 5,
};

const ARROW_TRAIT = {
  size: parseFloat,
  start: parseBoolean,
  end: parseBoolean,
};

const ARROW_DEFAULTS = {
  size: 4,
  start: false,
  end: true,
};

const AXES_TRAIT = {
  axes:  parseAxes,
  range: parseRanges,
};

const AXES_DEFAULTS = {
  axes: 'xyzw',
  range: null,
};

const AXIS_TRAIT = {
  axis:  parseAxis,
  range: optional(parseRange),
};

const AXIS_DEFAULTS = {
  axis: 'x',
};

const LABEL_TRAIT = {
  data:       parseStringArray,
  format:     optional(parseStringFormatter),
  size:       parseFloat,
  depth:      parseFloat,
  outline:    parseFloat,
  background: parseColor,
  box:        optional(parseFloat),
};

const LABEL_DEFAULTS = {
  size: 16,
  background: WHITE,
};

const LINE_TRAIT = {
  width:     parseFloat,
  depth:     parseFloat,
  join:      parseJoin,
  loop:      parseBoolean,
  dash:      parseVector,
  proximity: parseFloat,
};

const LINE_DEFAULTS = {
  width: 1,
  depth: 0,
  join: 'bevel',
  loop: false,
  proximity: 0,
};

const OBJECT_TRAIT = {
  position:   optional(parsePosition),
  scale:      optional(parseScale),
  quaternion: optional(parseQuaternion),
  rotation:   optional(parseRotation),
  matrix:     optional(parseMatrix),
};

const OBJECT_DEFAULTS = {};

const ROP_TRAIT = {
  blending: parseBlending,
  zWrite:   parseBoolean,
  zTest:    parseBoolean,
  zBias:    parseFloat,
  zIndex:   parseInt,
};

const ROP_DEFAULTS = {
  blending: 'normal',
  zWrite: true,
  zTest: true,
  zBias: 0,
  zIndex: 0,
};

const SCALE_TRAIT = {
  mode:   parseDomain,
  divide: parseFloat,
  unit:   parseFloat,
  base:   parseFloat,
  start:  parseBoolean,
  end:    parseBoolean,
  zero:   parseBoolean,
  factor: parseFloat,
  nice:   parseBoolean,
};

const SCALE_DEFAULTS = {
  divide: 10,
  unit: 1,
  base: 10,
  mode: 'linear',
  start: true,
  end: false,
  zero: true,
  factor: 1,
  nice: true,
};

export const useProp = <T>(value?: T, parse: (t?: T) => T, def?: T): T =>
  useOne(() => def !== undefined && value === undefined ? def : parse(value), value);

const useTrait = <T extends Record<string, any>>(props: Partial<T>, propDef: PropDef, defaults: Record<string, any>): T => {
  const parsed: Record<string, any> = useOne(() => ({}));

  for (let k in propDef) {
    const v = props[k];
    parsed[k] = useProp(v, propDef[k], defaults ? defaults[k] : undefined);
  }

  return parsed as T;
};

export const useColorTrait = (props: Partial<ColorTrait>): vec4 => {
  const {
    color = [0.5, 0.5, 0.5, 1],
    opacity = 1,
  } = props;

  const vec = useOne(() => vec4.create());
  const c = useProp(color, parseColor);
  const o = useProp(opacity, parseFloat);

  if (o === 1) return vec4.copy(vec, c);
  return vec4.set(vec, c[0], c[1], c[2], c[3] * o);
};

export const useAnchorTrait = (props: Partial<AnchorTrait>): AnchorTrait => useTrait(props, ANCHOR_TRAIT, ANCHOR_DEFAULTS);
export const useArrowTrait  = (props: Partial<ArrowTrait>):  ArrowTrait  => useTrait(props, ARROW_TRAIT, ARROW_DEFAULTS);
export const useAxesTrait   = (props: Partial<AxesTrait>):   AxesTrait   => useTrait(props, AXES_TRAIT, AXES_DEFAULTS);
export const useAxisTrait   = (props: Partial<AxisTrait>):   AxisTrait   => useTrait(props, AXIS_TRAIT, AXIS_DEFAULTS);
export const useLabelTrait  = (props: Partial<LabelTrait>):  LabelTrait  => useTrait(props, LABEL_TRAIT, LABEL_DEFAULTS);
export const useLineTrait   = (props: Partial<LineTrait>):   LineTrait   => useTrait(props, LINE_TRAIT, LINE_DEFAULTS);
export const useObjectTrait = (props: Partial<ObjectTrait>): ObjectTrait => useTrait(props, OBJECT_TRAIT, OBJECT_DEFAULTS);
export const useROPTrait    = (props: Partial<ROPTrait>):    ROPTrait    => useTrait(props, ROP_TRAIT, ROP_DEFAULTS);
export const useScaleTrait  = (props: Partial<ScaleTrait>):  ScaleTrait  => useTrait(props, SCALE_TRAIT, SCALE_DEFAULTS);
