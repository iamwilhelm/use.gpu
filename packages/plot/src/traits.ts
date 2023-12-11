import type { ColorLike } from '@use-gpu/core';

import { trait, combine, optional, UseHooks } from '@use-gpu/traits/live';
import {
  parseNumber,
  parseInteger,
  parseBoolean,
  parseString,
  parseStringArray,
  parseStringFormatter,
  parseBooleanArray,
  parseColorArray,
  parseVec4,
  parseVec4Array,
  parseScalarArray,
  parseScalarArrayLike,
  parseScalarMultiArray,
  parsePosition,
  parsePositionArray,
  parsePositionMultiArray,
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
    width: parseNumber,
    depth: parseNumber,
    loop: parseBoolean,
  },
  {
    width: 1,
    depth: 0,
    loop: false,
  },
);

export const MarkerTrait = trait(
  {
    shape: optional(parsePointShape),
    hollow: optional(parseBoolean),
    outline: optional(parseNumber),
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
    size: parseNumber,
    depth: optional(parseNumber),
  },
  {
    size: 1,
  },
);

export const PositionTrait = trait(
  {
    position: optional(parsePosition),
  }
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

export const StrokeTrait = trait(
  {
    join:      parseJoin,
    dash:      optional(parseScalarArray),
    proximity: parseNumber,
  },
  {
    join: 'bevel',
    loop: false,
    proximity: 0,
  },
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

export const ZIndexTrait = trait(
  {
    zIndex: parseInteger,
  },
  {
    zIndex: 0,
  },
);

// Composite attributes

export const ColorTrait = (
  props: {
    color?: number,
    opacity?: number,
  },
  parsed: {
    color: TypedArray
  },
  {useMemo}: UseHooks,
) => {
  const {color, opacity = 1} = props;
  const c = useMemo(() => parseColor(color, opacity), [color, opacity]);
  parsed.color = c != null ? c : undefined;
};

export const ColorsTrait = (
  props: {
    color?: number,
    opacity?: number,
  },
  parsed: {
    color: TypedArray
  },
  {useMemo, useProp}: UseHooks,
) => {
  const {colors, opacity = 1} = props;
  const rgba = useProp(colors, optional(parseColorArray));

  parsed.colors = useMemo(() => {
    if (!colors) return null;
    if (opacity == 1) return rgba;

    const copy = rgba.slice();
    const n = copy.length;
    for (let i = 3; i < n; i += 4) copy[i] *= opacity;
    return copy;
  }, [parsed, opacity]);
};

export const PointsTrait = combine(
  ColorTrait,
  ColorsTrait,
  trait(
    {
      position: optional(parsePosition),
      positions: optional(parsePositionArray),
      size: optional(parseNumber),
      sizes: optional(parseScalarArray),
      depth: optional(parseNumber),
      depths: optional(parseScalarArray),
      zBias: optional(parseNumber),
      zBiases: optional(parseScalarArray),
    },
  ),
);

export const LinesTrait = combine(
  ColorTrait,
  ColorsTrait,
  trait({
    position: optional(parsePositionArray),
    positions: optional(parsePositionMultiArray),
    size: optional(parseScalarArrayLike),
    sizes: optional(parseScalarMultiArray),
    depth: optional(parseScalarArrayLike),
    depths: optional(parseScalarMultiArray),
    zBias: optional(parseScalarArrayLike),
    zBiases: optional(parseScalarMultiArray),
    loop: optional(parseBoolean),
    loops: optional(parseBooleanArray),
  }),
  trait({
    
  }),
);
