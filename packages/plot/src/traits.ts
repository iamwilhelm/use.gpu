import type { ArchetypeSchema, ColorLike, Ragged, TypedArray, VectorLike, VectorLikes } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import { useMemo, useOne } from '@use-gpu/live';
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
  toChunkCounts,
  makeParseEnum,
} from '@use-gpu/parse';
import { seq, isShaderBinding, toCPUDims, getUniformDims, formatToArchetype } from '@use-gpu/core';
import { getArrowSegments, getFaceSegments, getFaceSegmentsConcave, getLineSegments } from '@use-gpu/workbench';

import { useDataContext } from './providers/data-provider';

import { vec4 } from 'gl-matrix';

const EMPTY: any[] = [];
const WHITE = [1, 1, 1, 1];

const bindable = <A, B>(parse: (t: A) => B) => (t: A | ShaderSource) => isShaderBinding(t) ? undefined : parse(t);

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
    zBias: optional(parseNumber),
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
    zBias: optional(parseNumber),
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
    sizes:      optional(parseScalarArray),
    depths:     optional(parseScalarArray),
    expands:    optional(parseScalarArray),
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
    color?: VectorLike | string,
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
  const parseColorsProp = bindable(optional(composite ? parseColorMultiArray : parseColorArray));

  return (
    props: {
      color?: number,
      colors?: VectorLike | VectorLike[],
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

// Inject tensor arrays from data context if they match an existing undefined prop.
// Record formats of tensor inputs.
// Separate GPU sources from CPU-side data.

export const DataTrait = (keys: string[], canonical: string = 'positions') => {
  const match = new Set(keys);
  return (
    props: {},
    parsed: {
      formats: Record<string, string>,
      sources: Record<string, any>,
      tensor: number[],
      ragged: Ragged,
    },
  ) => {
    const dataContext = useDataContext();

    const [data, formats, sources] = useMemo(() => {
      const data: Record<string, TypedArray> = {};
      const formats: Record<string, UniformType> = {};
      const sources: Record<string, any> = {};

      let d = 0;
      let f = 0;
      let s = 0;

      for (const k in dataContext) if (match.has(k)) {
        const {array, format, dims, size, ragged, version = 0} = dataContext[k];
        if (!(props as any)[k]) {
          data[k] = array;
          formats[k] = format;
          d++;
          f++;

          if (k === canonical) {
            data.tensor = size;
            data.ragged = ragged;
          }
        }
      }

      for (const k in props) if (match.has(k)) {
        const value = (props as any)[k];
        if (value?.array) {
          formats[k] = value.format;
          f++;
        }
        if (isShaderBinding(value)) {
          sources[k] = value;
          s++;
        }
      }

      return [d ? data : null, f ? formats : null, s ? sources : null];
    }, [dataContext, props]);

    if (data) for (const k in data) parsed[k] = data[k];
    parsed.formats = useOne(() => formats, formats && formatToArchetype(formats));
    parsed.sources = sources;
  };
};

// Chunking

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

export const Loop3DTrait = trait(
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
  starts: optional(parseBooleanArray),
  end: optional(parseBoolean),
  ends: optional(parseBooleanArray),
});

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
      groups?: TypedArray,
      formats: Record<string, string>,
      schema: ArchetypeSchema,
    },
  ) => {
    const [chunks, groups] = useProp(
      props.positions ?? props.position ?? parsed.positions,
      (pos) => {
        if (parsed.ragged) return parsed.ragged;
        if (parsed.tensor) {
          const [segment, ...rest] = parsed.tensor;
          const count = rest.reduce((a, b) => a * b, 1);
          return [seq(count).map(_ => segment), null];
        }
        if (!pos || props.segments) return [];
        const f = parsed.formats?.position ?? 'vec4<f32>';
        return toChunkCounts(pos, toCPUDims(getUniformDims(f)));
      }
    );
    parsed.chunks = chunks;
    parsed.groups = groups;
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
      formats: Record<string, string>,
      schema: ArchetypeSchema,
    },
  ) => {
    const [chunks, groups] = useProp(
      props.positions ?? props.position,
      (pos) => {
        if (parsed.ragged) return parsed.ragged;
        if (parsed.tensor) {
          const [segment, group, ...rest] = parsed.tensor;
          if (rest.length === 0) {
            const chunks = seq(group).map(_ => segment);
            return [chunks, [chunks.length]];
          }
          else {
            const planes = rest.reduce((a, b) => a * b, 1);
            const chunks = seq(group * planes).map(_ => segment);
            const groups = seq(planes).map(_ => group);
            return [chunks, groups];
          }
        }
        if (!pos || props.segments || props.indices) return [];
        const f = parsed.formats?.position ?? 'vec4<f32>';
        return toChunkCounts(pos, toCPUDims(getUniformDims(f)));
      }
    );
    parsed.chunks = chunks;
    parsed.groups = groups;
  },
);

export const LineSegmentsTrait = combine(
  SegmentsTrait,
  LoopsTrait,
  (
    props: {},
    parsed: {
      chunks?: TypedArray,
      groups?: TypedArray | null,
      loop?: boolean | TypedArray,
      loops?: TypedArray,

      count?: number,
      segment?: number,
      segments?: TypedArray,
      unwelds?: TypedArray,
      slices?: TypedArray,
    },
  ) => {
    const {chunks, groups, loop, loops} = parsed;
    if (!chunks) return;

    const l = (loop || loops) as any;
    const line = useMemo(() => getLineSegments({chunks, groups, loops: l}), [chunks, l]);
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
      groups?: TypedArray | null,
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
      slices?: TypedArray,
    },
  ) => {
    const {chunks, groups, loop, loops, start, starts, end, ends} = parsed;
    if (!chunks) return;

    const l = (loop || loops) as any;
    const s = (start || starts) as any;
    const e = (end || ends) as any;

    const arrow = useMemo(() => getArrowSegments({chunks, groups, loops: l, starts: s, ends: e}), [chunks, l, s, e]);
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
      slices?: TypedArray,
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
  positions: bindable(optional(parsePositionArray)),
  depth: optional(parseNumber),
  depths: bindable(optional(parseScalarArray)),
  zBias: optional(parseNumber),
  zBiases: bindable(optional(parseScalarArray)),

  id: optional(parseNumber),
  ids: bindable(optional(parseScalarArray)),
  lookup: optional(parseNumber),
  lookups: bindable(optional(parseScalarArray)),
});

export const CompositeVerticesTrait = trait({
  positions: bindable(optional(parsePositionMultiMultiArray)),
  depth: optional(parseScalarArrayLike),
  depths: bindable(optional(parseMultiScalarArray)),
  zBias: optional(parseScalarArrayLike),
  zBiases: bindable(optional(parseMultiScalarArray)),

  id: optional(parseScalarArrayLike),
  ids: bindable(optional(parseMultiScalarArray)),
  lookup: optional(parseScalarArrayLike),
  lookups: bindable(optional(parseMultiScalarArray)),
});

export const FacetedVerticesTrait = trait({
  positions: bindable(optional(parsePositionMultiMultiArray)),
  depth: optional(parseScalarArrayLike),
  depths: bindable(optional(parseMultiScalarArray)),
  zBias: optional(parseScalarArrayLike),
  zBiases: bindable(optional(parseMultiScalarArray)),

  id: optional(parseScalarArrayLike),
  ids: bindable(optional(parseMultiScalarArray)),
  lookup: optional(parseScalarArrayLike),
  lookups: bindable(optional(parseMultiScalarArray)),
});

export const PointTraits = combine(
  ColorsTrait(),
  trait({
    size: optional(parseNumber),
    sizes: bindable(optional(parseScalarArray)),
  }),
  VerticesTrait,
  DataTrait(['positions', 'colors', 'depths', 'zBiases', 'ids', 'lookups', 'sizes']),

  MarkerTrait,
  PointTrait,
  ROPTrait,
  ZIndexTrait,
);

export const LineTraits = combine(
  ColorsTrait({ composite: true }),
  trait({
    width: optional(parseScalarArrayLike),
    widths: bindable(optional(parseMultiScalarArray)),
  }),
  CompositeVerticesTrait,
  DataTrait(['positions', 'colors', 'depths', 'zBiases', 'ids', 'lookups', 'widths']),
  LineSegmentsTrait,

  ROPTrait,
  StrokeTrait,
  ZIndexTrait,
);

export const ArrowTraits = combine(
  ColorsTrait({ composite: true }),
  trait({
    width: optional(parseScalarArrayLike),
    widths: bindable(optional(parseMultiScalarArray)),
    size: optional(parseScalarArrayLike),
    sizes: bindable(optional(parseMultiScalarArray)),
  }),
  CompositeVerticesTrait,
  DataTrait(['positions', 'colors', 'depths', 'zBiases', 'ids', 'lookups', 'widths', 'sizes']),
  ArrowSegmentsTrait,

  ArrowTrait,
  ROPTrait,
  StrokeTrait,
  ZIndexTrait,
);

export const FaceTraits = combine(
  ColorsTrait({ composite: true }),
  FacetedVerticesTrait,
  DataTrait(['positions', 'colors', 'depths', 'zBiases', 'ids', 'lookups']),
  FaceSegmentsTrait,

  FaceTrait,
  ROPTrait,
  ZIndexTrait,
);

export const LabelTraits = combine(
  ColorsTrait(),
  trait({
    size: optional(parseNumber),
    sizes: bindable(optional(parseScalarArray)),

    values: bindable(optional(parseScalarArray)),
    formatter: optional(parseStringFormatter),
    precision: optional(parseNumber),
  }),
  VerticesTrait,
  DataTrait(['positions', 'values', 'colors', 'depths', 'zBiases', 'ids', 'lookups', 'sizes']),

  AnchorTrait,
  StringTrait,
  StringsTrait,
  LabelTrait,
  LabelsTrait,
  ROPTrait,
  ZIndexTrait,
);

export const TickTraits = combine(
  ColorsTrait(),
  trait({
    width: optional(parseScalarArrayLike),
    widths: bindable(optional(parseMultiScalarArray)),

    tangent: optional(parsePosition),
    tangents: optional(parsePositionArray),
  }),
  VerticesTrait,
  DataTrait(['positions', 'colors', 'depths', 'zBiases', 'ids', 'lookups', 'widths', 'tangents']),

  LineTrait,
  ROPTrait,
  ZIndexTrait,
);

export const SurfaceTraits = combine(
  ColorsTrait({ composite: true }),
  Loop2DTrait,
  CompositeVerticesTrait,
  DataTrait(['positions', 'colors', 'zBiases', 'ids', 'lookups']),
  trait({
    size: optional(parseScalarArray),
  }),

  ColorTrait,
  FaceTrait,
  ROPTrait,
  StrokeTrait,
  ZIndexTrait,
);

export const ImplicitSurfaceTraits = combine(
  ColorTrait,
  DataTrait(['values', 'normals'], 'values'),
  FaceTrait,
  Loop3DTrait,
  ROPTrait,
  ZIndexTrait,
  trait({
    range: optional(parseRanges),
    values: optional(parseScalarArray),
    normals: optional(parseVec4Array),
    size: optional(parseScalarArray),
    method: makeParseEnum(['linear', 'quadratic']),
    level: parseNumber,
    padding: parseNumber,
    id: parseNumber,
    zBias: parseNumber,
  })
);

