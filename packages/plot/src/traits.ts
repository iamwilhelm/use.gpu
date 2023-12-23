import type { ColorLike, VectorLike, VectorLikes } from '@use-gpu/core';

import { useMemo } from '@use-gpu/live';
import { trait, combine, optional, useProp } from '@use-gpu/traits/live';
import {
  parseNumber,
  parseInteger,
  parseBoolean,
  parseString,
  parseStringArray,
  parseStringFormatter,
  parseBooleanArray,
  parseColor,
  parseColorOpacity,
  parseColorArray,
  parseColorArrayLike,
  parseColorMultiArray,
  parseVec4,
  parseVec4Array,
  parseScalarArray,
  parseScalarArrayLike,
  parseScalarMultiArray,
  parsePosition,
  parsePositionArray,
  parsePositionMultiArray,
  parseChunks,
  parseRotation,
  parseQuaternion,
  parseScale,
  parseMatrix,
  parseSide,
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
import { generateChunkSegments2 } from '@use-gpu/core';
import { useArrowSegments, useFaceSegments, useLineSegments } from '@use-gpu/workbench';

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
    flat: optional(parseBoolean),
  },
  {
    size: 3,
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

export const FaceTrait = trait(
  {
    flat: optional(parseBoolean),
    fragDepth: optional(parseBoolean),
    shaded: optional(parseBoolean),
    side: optional(parseSide),
    shadow: optional(parseBoolean),
  },
  {
    side: 'both',
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
    size:   optional(parseNumber),
    depth:  optional(parseNumber),
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
    width: optional(parseNumber),
    depth: optional(parseNumber),
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
    join:      optional(parseJoin),
    dash:      optional(parseScalarArray),
    proximity: optional(parseNumber),
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
) => {
  const {color, opacity = 1} = props;
  const rgba = useMemo(() => parseColorOpacity(color, opacity), [color, opacity]);
  parsed.color = rgba != null ? rgba : undefined;
};

export const ColorsTrait = ({composite}: {composite?: boolean} = {}) => {
  const parseColorProp = optional(composite ? parseColorArrayLike : parseColor);
  const parseColorsProp = optional(composite ? parseColorMultiArray : parseColorArray);

  return (
    props: {
      color?: number,
      colors?: number,
      opacity?: number,
    },
    parsed: {
      color?: TypedArray,
      colors?: TypedArray
    },
  ) => {
    const {color, colors, opacity = 1} = props;

    const c = useProp(color, parseColorProp);
    const cs = useProp(colors, parseColorsProp);

    const rgba = useMemo(() => applyOpacity(c, opacity), [c, opacity]);
    const rgbas = useMemo(() => applyOpacity(cs, opacity), [cs, opacity]);

    parsed.color = rgba != null ? rgba : undefined;
    parsed.colors = rgbas != null ? rgbas : undefined;
  };
}

const applyOpacity = (colors?: TypedArray, opacity: number = 1) => {
  if (!colors) return undefined;
  if (opacity == 1) return colors;

  const copy = colors.slice();
  const n = copy.length;
  for (let i = 3; i < n; i += 4) copy[i] *= opacity;
  return copy;
}

// Chunking

export const SegmentsTrait = combine(
  trait({
    segments: optional(parseScalarArray),
  }),
  (
    props: {
      position?: VectorLike | VectorLikes,
      positions?: VectorLikes | VectorLikes[],
      segments?: VectorLikes | VectorLikes[],
    },
    parsed: {
      chunks?: TypedArray,
    },
  ) => {
    parsed.chunks = useProp(
      props.positions ?? props.position,
      (pos) => !props.segments ? parseChunks(pos) : undefined,
    );
  },
);

export const LoopTrait = trait({
  loop: optional(parseBoolean),
});

export const LoopsTrait = trait({
  loop: optional(parseBoolean),
  loops: optional(parseBooleanArray),
});

export const DirectedTrait = trait({
  start: optional(parseBoolean),
  end: optional(parseBoolean),
});

export const DirectedsTrait = trait({
  start: optional(parseBoolean),
  end: optional(parseBoolean),
  starts: optional(parseBooleanArray),
  ends: optional(parseBooleanArray),
});

export const LineSegmentsTrait = combine(
  SegmentsTrait,
  LoopsTrait,
  (
    props: {},
    parsed: {
      chunks?: TypedArray,
      loop?: boolean | TypedArray,
      loops?: TypedArray,

      count?: number,
      segments?: TypedArray,
      unwelds?: TypedArray,
      slices?: TypedArray,
    },
  ) => {
    const {chunks, loop, loops} = parsed;
    if (!chunks) return;

    const line = useLineSegments(chunks, loop || loops);
    for (const k in line) parsed[k] = line[k];
  },
);

export const ArrowSegmentsTrait = combine(
  SegmentsTrait,
  LoopsTrait,
  DirectedsTrait,
  (
    props: {},
    parsed: {
      chunks?: TypedArray,
      loop?: boolean | TypedArray,
      loops?: TypedArray,
      start?: boolean | TypedArray,
      starts?: TypedArray,
      end?: boolean | TypedArray,
      ends?: TypedArray,

      count?: number,
      sparse?: number,
      segments?: TypedArray,
      anchors?: TypedArray,
      trims?: TypedArray,
      unwelds?: TypedArray,
      lookups?: TypedArray,
    },
  ) => {
    const {chunks, loop, loops, start, starts, end, ends} = parsed;
    console.log({chunks, loop, loops, start, starts, end, ends})
    if (!chunks) return;

    const arrow = useArrowSegments(chunks, loop || loops, start || starts, end || ends);
    for (const k in arrow) parsed[k] = arrow[k];
  },
);

export const FaceSegmentsTrait = combine(
  SegmentsTrait,
  LoopsTrait,
  DirectedsTrait,
  (
    props: {},
    parsed: {
      chunks?: TypedArray,
      loop?: boolean | TypedArray,
      loops?: TypedArray,
      start?: boolean | TypedArray,
      starts?: TypedArray,
      end?: boolean | TypedArray,
      ends?: TypedArray,

      count?: number,
      sparse?: number,
      segments?: TypedArray,
      anchors?: TypedArray,
      trims?: TypedArray,
      unwelds?: TypedArray,
      lookups?: TypedArray,
    },
  ) => {
    const {chunks, loop, loops, start, starts, end, ends} = parsed;
    console.log({chunks, loop, loops, start, starts, end, ends})
    if (!chunks) return;

    const face = useFaceSegments(chunks, loop || loops, start || starts, end || ends);
    for (const k in face) parsed[k] = face[k];
  },
);

export const VerticesTrait = trait({
  position: optional(parsePosition),
  positions: optional(parsePositionArray),
  depth: optional(parseNumber),
  depths: optional(parseScalarArray),
  zBias: optional(parseNumber),
  zBiases: optional(parseScalarArray),

  id: optional(parseNumber),
  ids: optional(parseScalarArray),
  lookup: optional(parseNumber),
  lookups: optional(parseScalarArray),
});

export const SegmentedVerticesTrait = trait({
  position: optional(parsePositionArray),
  positions: optional(parsePositionMultiArray),
  depth: optional(parseScalarArrayLike),
  depths: optional(parseScalarMultiArray),
  zBias: optional(parseScalarArrayLike),
  zBiases: optional(parseScalarMultiArray),

  id: optional(parseNumber),
  ids: optional(parseScalarArray),
  lookup: optional(parseNumber),
  lookups: optional(parseScalarArray),
});

export const PointsTrait = combine(
  ColorsTrait(),
  VerticesTrait,
  trait({
    size: optional(parseNumber),
    sizes: optional(parseScalarArray),
  }),
);

export const LinesTrait = combine(
  ColorsTrait({ composite: true }),
  SegmentedVerticesTrait,
  trait({
    width: optional(parseScalarArrayLike),
    widths: optional(parseScalarMultiArray),
  }),
  LineSegmentsTrait,  
);

export const ArrowsTrait = combine(
  ColorsTrait({ composite: true }),
  SegmentedVerticesTrait,
  trait({
    size: optional(parseScalarArrayLike),
    sizes: optional(parseScalarMultiArray),
  }),
  ArrowSegmentsTrait,  
);

export const FacesTrait = combine(
  ColorsTrait({ composite: true }),
  SegmentedVerticesTrait,
  FaceSegmentsTrait,  
);
