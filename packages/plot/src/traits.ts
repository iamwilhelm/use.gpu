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
  parseMultiScalarArray,
  parsePosition,
  parsePositionArray,
  parsePositionMultiArray,
  parsePositionMultiMultiArray,
  parseChunks,
  parseMultiChunks,
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
import { seq } from '@use-gpu/core';
import { getArrowSegments, getFaceSegments, getFaceSegmentsConcave, getLineSegments } from '@use-gpu/workbench';

import { useDataContext } from './providers/data-provider';

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
    end: true,
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

// Inject tensor arrays from data context if they match an existing undefined prop

export const DataContextTrait = (...keys: string[]) => {
  const match = new Set(keys);
  return (
    props: {},
    parsed: {
      formats: Record<string, string>,
      tensor: number[],
    },
  ) => {
    const dataContext = useDataContext();

    const data = useMemo(() => {
      const data = {formats: {}};
      let n = 0;
      for (const k in dataContext) if (match.has(k)) {
        const {array, format, dims, size} = dataContext[k];
        if (!(props as any)[k]) {
          data[k] = array;
          data.formats[k] = format;
          n++;

          if (k === 'positions') data.tensor = size;
        }
      }
      return n ? data : {};
    }, [dataContext]);

    for (const k in data) parsed[k] = data[k];
  };
};

// Chunking

export const SegmentsTrait = combine(
  trait({
    segments: optional(parseScalarArrayLike),
  }),
  (
    props: {
      position?: VectorLike | VectorLikes,
      positions?: VectorLikes | VectorLikes[],
      segments?: VectorLikes,
    },
    parsed: {
      positions?: TypedArray,
      chunks?: TypedArray,
    },
  ) => {
    parsed.chunks = useProp(
      props.positions ?? props.position,
      (pos) => {
        if (parsed.tensor) {
          const [segment, ...rest] = parsed.tensor;
          return seq(rest.reduce((a, b) => a * b, 1)).map(_ => segment);
        }
        if (!pos || props.segments) return;
        return parseChunks(pos);
      }
    );
  },
);

export const FacetedTrait = combine(
  trait({
    segments: optional(parseScalarArrayLike),
    indices: optional(parseScalarArrayLike),
  }),
  (
    props: {
      position?: VectorLike | VectorLikes,
      positions?: VectorLikes | VectorLikes[],
      segments?: VectorLikes,
      indices?: VectorLikes,
    },
    parsed: {
      positions?: TypedArray,
      chunks?: TypedArray,
      groups?: TypedArray,
    },
  ) => {
    const [chunks, groups] = useProp(
      props.positions ?? props.position,
      (pos) => {
        if (parsed.tensor) {
          const [segment, group, ...rest] = parsed.tensor;
          if (rest.length === 0) {
            const chunks = seq(group).map(_ => segment);
            return [chunks, [1]];
          }
          else {
            const planes = rest.reduce((a, b) => a * b, 1);
            const chunks = seq(group * planes).map(_ => segment);
            const groups = seq(planes).map(_ => group);
            return [chunks, groups];
          }
        }
        if (!pos || props.segments || props.indices) return;
        return parseMultiChunks(pos);
      }
    );
    parsed.chunks = chunks;
    parsed.groups = groups;
  },
);

export const ConcaveTrait = trait({
  concave: optional(parseBoolean),
});

export const LoopTrait = trait({
  loop: optional(parseBoolean),
});

export const Loop2DTrait = trait(
  {
    loopX: optional(parseBoolean),
    loopY: optional(parseBoolean),
  },
  {
    loopX: false,
    loopY: false,
  },
);

export const Looped3DTrait = trait(
  {
    loopX: optional(parseBoolean),
    loopY: optional(parseBoolean),
    loopZ: optional(parseBoolean),
  },
  {
    loopX: false,
    loopY: false,
    loopZ: false,
  },
);

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
      segment?: number,
      segments?: TypedArray,
      unwelds?: TypedArray,
      slices?: TypedArray,
    },
  ) => {
    const {chunks, loop, loops} = parsed;
    if (!chunks) return;

    const l = loop || loops;

    const line = useMemo(() => getLineSegments({chunks, loops: l}), [chunks, l]);
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
    },
  ) => {
    const {chunks, loop, loops, start, starts, end, ends} = parsed;
    if (!chunks) return;

    const l = loop || loops;
    const s = start || starts;
    const e = end || ends;

    const arrow = useMemo(() => getArrowSegments({chunks, loops: l, starts: s, ends: e}), [chunks, l, s, e]);
    for (const k in arrow) parsed[k] = arrow[k];
  },
);

export const FaceSegmentsTrait = combine(
  FacetedTrait,
  ConcaveTrait,
  (
    _,
    parsed: {
      chunks?: TypedArray,
      groups?: TypedArray,
      concave?: boolean,

      position?: TypedArray,
      positions?: TypedArray,

      count?: number,
      indexed?: number,
      segments?: TypedArray,
      indices?: TypedArray,
    },
  ) => {
    const {chunks, groups, concave, position, positions} = parsed;
    if (!chunks) return;

    if (concave && (position || positions)) {
      const face = useProp(position ?? positions, (v) => getFaceSegmentsConcave({chunks, groups, positions: v, dims: 4}));
      for (const k in face) parsed[k] = face[k];
    }
    else {
      const face = useProp(chunks, () => getFaceSegments({chunks}));
      for (const k in face) parsed[k] = face[k];
    }
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

export const CompositeVerticesTrait = trait({
  position: optional(parsePositionArray),
  positions: optional(parsePositionMultiArray),
  depth: optional(parseScalarArrayLike),
  depths: optional(parseMultiScalarArray),
  zBias: optional(parseScalarArrayLike),
  zBiases: optional(parseMultiScalarArray),

  id: optional(parseScalarArrayLike),
  ids: optional(parseMultiScalarArray),
  lookup: optional(parseScalarArrayLike),
  lookups: optional(parseMultiScalarArray),
});

export const FacetedVerticesTrait = trait({
  position: optional(parsePositionArray),
  positions: optional(parsePositionMultiMultiArray),
  depth: optional(parseScalarArrayLike),
  depths: optional(parseMultiScalarArray),
  zBias: optional(parseScalarArrayLike),
  zBiases: optional(parseMultiScalarArray),

  id: optional(parseScalarArrayLike),
  ids: optional(parseMultiScalarArray),
  lookup: optional(parseScalarArrayLike),
  lookups: optional(parseMultiScalarArray),
});

export const PointsTrait = combine(
  ColorsTrait(),
  trait({
    size: optional(parseNumber),
    sizes: optional(parseScalarArray),
  }),
  VerticesTrait,
  DataContextTrait('positions', 'colors', 'depths', 'zBiases', 'ids', 'lookups', 'sizes'),
);

export const LinesTrait = combine(
  ColorsTrait({ composite: true }),
  trait({
    width: optional(parseScalarArrayLike),
    widths: optional(parseMultiScalarArray),
  }),
  CompositeVerticesTrait,
  DataContextTrait('positions', 'colors', 'depths', 'zBiases', 'ids', 'lookups', 'widths'),
  LineSegmentsTrait,
);

export const ArrowsTrait = combine(
  ColorsTrait({ composite: true }),
  trait({
    width: optional(parseScalarArrayLike),
    widths: optional(parseMultiScalarArray),
    size: optional(parseScalarArrayLike),
    sizes: optional(parseMultiScalarArray),
  }),
  CompositeVerticesTrait,
  DataContextTrait('positions', 'colors', 'depths', 'zBiases', 'ids', 'lookups', 'widths', 'sizes'),
  ArrowSegmentsTrait,
);

export const FacesTrait = combine(
  ColorsTrait({ composite: true }),
  FacetedVerticesTrait,
  DataContextTrait,
  FaceSegmentsTrait,
);

export const SurfaceTrait = combine(
  ColorsTrait({ composite: true }),
  Loop2DTrait,
  CompositeVerticesTrait,
  DataContextTrait('positions', 'colors', 'zBiases', 'ids', 'lookups'),
  trait({
    size: optional(parseScalarArray),
  }),
);