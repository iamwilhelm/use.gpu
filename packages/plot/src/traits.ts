import type { ColorLike } from '@use-gpu/core';

import { trait, optional, UseHooks } from '@use-gpu/traits/live';
import {
  parseNumber,
  parseInteger,
  parseBoolean,
  parseString,
  parseStringArray,
  parseStringFormatter,
  parseBooleanArray,
  parseScalarArray,
  parseVector,
  parseVec4,
  parseVec4Array,
  parsePosition,
  parseRotation,
  parseQuaternion,
  parseColor,
  parseColorArray,
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

import { vec4 } from 'gl-matrix';

const EMPTY: any[] = [];
const WHITE = [1, 1, 1, 1];

export const AnchorTrait = trait(
  {
    placement:  parsePlacement,
    offset:     parseNumber,
  },
  {
    placement: 'center',
    offset: 5,
  },
);

export const ArrowTrait = trait(
  {
    size: parseNumber,
    start: parseBoolean,
    end: parseBoolean,
    detail: parseIntegerPositive,
  },
  {
    size: 3,
    start: false,
    end: true,
    detail: 12,
  },
);

export const ArrowsTrait = trait(
  {
    sizes: optional(parseScalarArray),
    starts: optional(parseBooleanArray),
    ends: optional(parseBooleanArray),
  },
);

export const AxesTrait = trait(
  {
    axes:  parseAxes,
    range: parseRanges,
  },
  {
    axes: 'xyzw',
  },
);

export const AxisTrait = trait(
  {
    axis:  parseAxis,
    range: optional(parseRange),
  },
  {
    axis: 'x',
  }
);

export const ColorTrait = (
  props: {color?: ColorLike, opacity?: number},
  parsed: {color: vec4},
  {useMemo, useProp}: UseHooks,
) => {
  const {color, opacity} = props;

  const c = useProp(color, parseColor);
  const o = useProp(opacity, parseNumber);

  const rgba = useMemo(() => (
    o === 1
      ? c
      : vec4.set(vec4.create(), c[0], c[1], c[2], c[3] * o)
  ), [c, o]);

  parsed.color = rgba;
};

export const ColorsTrait = trait(
  {
    colors: optional(parseScalarArray),
  },
);
  
export const FontTrait = trait(
  {
    family: optional(parseString),
    weight: optional(parseWeight),
    style: optional(parseString),
  },
);

export const GridTrait = trait(
  {
    axes:  parseAxes,
    range: optional(parseRanges),
  },
  {
    axes: 'xy',
  },
);

export const LabelTrait = trait(
  {
    size:   parseNumber,
    depth:  parseNumber,
    expand: parseNumber,
  },
  {
    size: 16,
  },
);

export const LabelsTrait = trait(
  {
    format:     optional(parseStringFormatter),
    sizes:      optional(parseScalarArray),
    depths:     optional(parseScalarArray),
  },
);

export const LineTrait = trait(
  {
    width:     parseNumber,
    depth:     parseNumber,
    loop:      parseBoolean,
    join:      parseJoin,
    dash:      parseVector,
    proximity: parseNumber,
  },
  {
    width: 1,
    depth: 0,
    join: 'bevel',
    loop: false,
    proximity: 0,
  },
);

export const LinesTrait = trait(
  {
    widths: optional(parseScalarArray),
    depths: optional(parseScalarArray),
    loops:  optional(parseBooleanArray),
  },
);

export const ObjectTrait = trait(
  {
    position:   optional(parsePosition),
    scale:      optional(parseScale),
    quaternion: optional(parseQuaternion),
    rotation:   optional(parseRotation),
    matrix:     optional(parseMatrix),
  },
);

export const PointTrait = trait(
  {
    size:  parseNumber,
    depth: parseNumber,
    shape: parsePointShape,
    hollow: parseBoolean,
    outline: parseNumber,
  },
  {
    size: 1,
    depth: 0,
    shape: 'circle',
    hollow: false,
    outline: 0,
  },
);

export const PointsTrait = trait(
  {
    sizes: optional(parseScalarArray),
    depths: optional(parseScalarArray),
  },
);

export const PositionTrait = trait(
  {
    position: optional(parseVec4),
  }
);

export const PositionsTrait = trait(
  {
    positions: optional(parseVec4Array),
  },
);

export const ROPTrait = trait(
  {
    alphaToCoverage: optional(parseBoolean),
    blend:           optional(parseBlending),
    depthWrite:      optional(parseBoolean),
    depthTest:       optional(parseBoolean),
    mode:            optional(parseString),
  },
);

export const ScaleTrait = trait(
  {
    mode:   parseDomain,
    divide: parseNumber,
    unit:   parseNumber,
    base:   parseNumber,
    start:  parseBoolean,
    end:    parseBoolean,
    zero:   parseBoolean,
    factor: parseNumber,
    nice:   parseBoolean,
  },
  {
    mode: 'linear',
    divide: 10,
    unit: 1,
    base: 10,
    start: true,
    end: false,
    zero: true,
    factor: 1,
    nice: true,
  },
);

export const StringTrait = trait(
  {
    label: optional(parseString),
  }
);

export const StringsTrait = trait(
  {
    labels: optional(parseStringArray),
  }
);

export const SurfaceTrait = trait(
  {
    loopX: parseBoolean,
    loopY: parseBoolean,
    shaded: parseBoolean,
  },
  {
    loopX: false,
    loopY: false,
    shaded: true,
  },
);

export const VolumeTrait = trait(
  {
    loopX: parseBoolean,
    loopY: parseBoolean,
    loopZ: parseBoolean,
    shaded: parseBoolean,
  },
  {
    loopX: false,
    loopY: false,
    loopZ: false,
    shaded: true,
  },
);

export const ZBiasTrait = trait(
  {
    zBias:  parseNumber,
    zIndex: parseInteger,
  },
  {
    zIndex: 0,
    zBias: 0,
  },
);

export const ZBiasesTrait = trait(
  {
    zBiases: optional(parseScalarArray),
  },
);
