import type {
  ArrowFunction, TypedArray, TypedArrayConstructor,
  Blending, VectorLike, ArrayLike, ColorLike, ColorLikes, Side, VectorLikes,
} from '@use-gpu/core';
import type { Parser, Join, Placement, PointShape, Domain } from './types';
import { seq } from '@use-gpu/core';
import { mat4, vec4, vec3, vec2, quat } from 'gl-matrix';
import { toScalarArray, toVectorArray, toMultiVectorArray, toMultiScalarArray, toCompositeChunks } from './flatten';

const NO_VEC2 = vec2.fromValues(0, 0);
const NO_VEC3 = vec3.fromValues(0, 0, 0);
const NO_VEC4 = vec4.fromValues(0, 0, 0, 0);
const NO_QUAT = quat.create();
const NO_MAT4 = mat4.create();

const NO_POSITION = vec4.fromValues(0, 0, 0, 1);
const NO_SCALE = vec3.fromValues(1, 1, 1);

const GRAY = vec4.fromValues(0.5, 0.5, 0.5, 1);

const NO_VECTOR: number[] = [];
const NO_STRINGS: string[] = [];

const NO_RANGE = vec2.fromValues(-1, 1);
const NO_RANGES = [NO_RANGE, NO_RANGE, NO_RANGE, NO_RANGE];

const AXIS_NUMBERS = {'x': 0, 'y': 1, 'z': 2, 'w': 3} as Record<string, number>;

const u4ToFloat = (s: string) => parseInt(s, 16) / 15;
const u8ToFloat = (s: string) => parseInt(s, 16) / 255;
const strToFloat = (s: string) => s.match('%') ? +s / 100 : +s;

///////////////////////////

export const isTypedArray = (() => {
  const TypedArray = Object.getPrototypeOf(Uint8Array);
  return (obj: any) => obj instanceof TypedArray;
})();

///////////////////////////

export const makeParseObject = <T>() => (value?: T) => typeof value === 'object' && value != null ? value : {};

export const makeParseArray = <T>(
  defaults: T[],
  parse: (v: any) => T
) => (vecs?: ArrayLike[]): T[] => {
  if (vecs != null) {
    const vs = vecs.map(parse);
    const l = vs.length;
    const n = defaults.length;
    if (l < n) for (let i = l; i < n; ++i) vs.push(defaults[i]);
    return vs;
  }
  return defaults;
};

export const makeParseEnum = <T>(
  options: T[],
): ((s?: string) => T) => {
  const hash = new Set(options);
  const [def] = options;

  return (s?: string): T => {
    if (s != null) {
      if (hash.has(s as any)) return s as any as T;
      else console.warn(`Unknown enum value '${s}'`);
    }
    return def;
  };
};

export const makeParseMap = <T>(map: Record<string, T>, def: string) => {
  return (s?: string) => map[s as any] ?? map[def]!;
};

export const makeParseMapOrValue = <T>(map: Record<string, T>, def: string): ((s?: string | T) => T) => {
  return (s?: string | T) => map[s as any] ?? (s as any as T) ?? map[def]!;
};

///////////////////////////

export const makeParseVec2 = (defaults: vec2 = NO_VEC2) => (vec?: VectorLike): vec2 => {
  if (vec != null) {
    return vec2.fromValues(vec[0] ?? defaults[0], vec[1] ?? defaults[1]);
  }
  return defaults;
};

export const makeParseVec3 = (defaults: vec3 = NO_VEC3) => (vec?: VectorLike): vec3 => {
  if (vec != null) {
    return vec3.fromValues(vec[0] ?? defaults[0], vec[1] ?? defaults[1], vec[2] ?? defaults[2]);
  }
  return defaults;
};

export const makeParseVec4 = (defaults: vec4 = NO_VEC4) => (vec?: VectorLike): vec4 => {
  if (vec != null) {
    return vec4.fromValues(vec[0] ?? defaults[0], vec[1] ?? defaults[1], vec[2] ?? defaults[2], vec[3] ?? defaults[3]);
  }
  return defaults;
};

export const makeParseMat4 = (defaults: mat4 = NO_MAT4) => (matrix?: VectorLike): mat4 => {
  if (matrix != null) {
    // @ts-ignore
    return mat4.fromValues(...matrix);
  }
  return defaults;
};

export const makeParseScalarArray = <T extends TypedArrayConstructor>(
  constructor: T,
) => (
  vec: VectorLike
): InstanceType<T> => {
  return toScalarArray(vec, constructor) as T;
};

export const makeParseScalarArrayLike = <T extends TypedArrayConstructor>(
  constructor: T,
) => (
  vec: number | VectorLike,
): number | InstanceType<T> => {
  if (typeof vec === 'number') return vec;
  return toScalarArray(vec, constructor) as T;
};

export const makeParseMultiScalarArray = <T extends TypedArrayConstructor>(
  constructor: T,
) => (
  vecs: VectorLikes
): InstanceType<T> => {
  return toMultiScalarArray(vecs, constructor) as T;
};

export const makeParseVectorArray = <T extends TypedArrayConstructor>(
  dims: number,
  w: number = 0,
  constructor: T,
) => (
  vecs: VectorLikes
): InstanceType<T> => {
  return toVectorArray(vecs, dims, w, constructor) as T;
};

export const makeParseMultiVectorArray = <T extends TypedArrayConstructor>(
  dims: number,
  w: number = 0,
  constructor: T,
) => (
  vecs: VectorLikes
): InstanceType<T> => {
  return toMultiVectorArray(vecs, dims, w, constructor) as T;
};

export const makeParseBasis = (defaults: string) => {
  const axes = defaults.split('');
  const order = seq(axes.length);

  const getOrder = (s: string) => {
    // Fill out incomplete basis, e.g. 'yx' -> 'yxzw'
    order.sort((a, b) => {
      const ai = s.indexOf(axes[a]);
      const bi = s.indexOf(axes[b]);
      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai < 0 && bi < 0) return a - b;
      return (ai < 0) ? 1 : -1;
    });
    return order.map(x => axes[x]).join('');
  };

  return (s?: string) => {
    if (s != null) return getOrder(s);
    return defaults;
  };
};

export const parseRotation = (vec?: VectorLike | number): vec3 => {
  if (vec != null) {
    if (typeof vec === 'number') return vec3.fromValues(0, 0, vec);
    return vec3.fromValues(vec[0] ?? 0, vec[1] ?? 0, vec[2] ?? 0);
  }
  return defaults;
};

///////////////////////////

export const clampNumber = (
  min: number | null,
  max: number | null,
) => (
  parse: Parser<number | undefined, number>,
) => (
  value?: number,
) => {
  let v = parse(value);
  if (min != null) v = Math.max(min, v);
  if (max != null) v = Math.min(max, v);
  return v;
};

///////////////////////////

export const parseObject = <T>(value?: T) => typeof value === 'object' && value != null ? value : {};
export const parseString = (s?: string) => s ?? '';
export const parseNumber = (value?: number) => +(value || 0);
export const parseInteger = (value?: number) => Math.round(+(value || 0));
export const parseBoolean = (value?: boolean) => !!value;

export const parseNumberUnsigned = clampNumber(0, null)(parseNumber);
export const parseNumberPositive = clampNumber(1, null)(parseNumber);
export const parseIntegerPositive = clampNumber(1, null)(parseInteger);

export const parseVec2 = makeParseVec2();
export const parseVec3 = makeParseVec3();
export const parseVec4 = makeParseVec4();

export const parseStringFormatter = (s: ArrowFunction | string): ArrowFunction => {
  if (typeof s === 'function') return s;
  return (s?: string) => '' + s;
};

export const parseAxis = (s?: string) => {
  if (s != null) return AXIS_NUMBERS[s] ?? 0;
  return 0;
};

export const parseColorOpacity = (color?: ColorLike, opacity: number = 1): vec4 => {
  const def = GRAY;

  const c = color as any;
  if (c == null) {}
  else if (typeof c === 'string') {
    if (c[0] === '#') {
      if (c.length === 4) {
        const r = u4ToFloat(c[1]);
        const g = u4ToFloat(c[2]);
        const b = u4ToFloat(c[3]);
        return vec4.fromValues(r, g, b, opacity);
      }
      if (c.length === 7) {
        const r = u8ToFloat(c.slice(1, 3));
        const g = u8ToFloat(c.slice(3, 5));
        const b = u8ToFloat(c.slice(5, 7));
        return vec4.fromValues(r, g, b, opacity);
      }
      if (c.length === 9) {
        const r = u8ToFloat(c.slice(1, 3));
        const g = u8ToFloat(c.slice(3, 5));
        const b = u8ToFloat(c.slice(5, 7));
        const a = u8ToFloat(c.slice(7, 9));
        return vec4.fromValues(r, g, b, a * opacity);
      }
    }
    if (c[0] === 'r') {
      const cs = c.split('(')[1].split(')')[0].split(',').map(strToFloat);
      if (c[3] === 'a') return vec4.fromValues(cs[0] / 255, cs[1] / 255, cs[2] / 255, cs[3] * opacity);
      else return vec4.fromValues(cs[0] / 255, cs[1] / 255, cs[2] / 255, opacity);
    }
  }
  else if (c.rgba ?? c.rgb) {
    const [r, g, b, a] = c.rgba ?? c.rgb;
    return vec4.fromValues(r / 255, g / 255, b / 255, (a ? a / 255 : 1) * opacity);
  }
  else if (c.length) {
    return vec4.fromValues(c[0] ?? def[0], c[1] ?? def[1], c[2] ?? def[2], (c[3] ?? def[3]) * opacity);
  }
  else {
    throw new Error(`Cannot parse color ${color}`);
  }

  if (opacity === 1) return def;
  return vec4.fromValues(def[0], def[1], def[2], def[3] * opacity);
};

export const parseColor = (color?: ColorLike) => parseColorOpacity(color);

//////////////////

export const parseStringArray = makeParseArray(NO_STRINGS, parseString);

export const parseBooleanArray = (vec: VectorLike): Uint8Array =>
  vec ? toScalarArray(vec, Uint8Array) as Uint8Array : new Uint8Array();

export const parseBooleanArrayLike = (vec: VectorLike): Uint8Array =>
typeof 
  vec ? toScalarArray(vec, Uint8Array) as Uint8Array : new Uint8Array();

export const parseColorArray = (colors?: ColorLikes): Float32Array => {
  if (isTypedArray(colors)) return colors as Float32Array;
  const parsed = (colors as any[]).map(parseColor);
  return parseVec4Array(parsed);
};

export const parseColorArrayLike = (colors?: ColorLikes): Float32Array => {
  if (isTypedArray(colors)) return colors as Float32Array;
  if (Array.isArray(colors) && typeof colors[0] !== 'number') {
    return parseVec4Array(colors.map(parseColor));
  } 
  return parseColor(colors);
};

export const parseColorMultiArray = (colors?: ColorLikes | ColorLikes[]): Float32Array => {
  if (isTypedArray(colors)) return colors as Float32Array;
  if (Array.isArray(colors[0]) && typeof colors[0][0] !== 'number') {
    return parseVec4MultiArray(colors.map(cs => cs.map(parseColor)));
  }
  return parseVec4Array((colors as any[]).map(parseColor));
};

export const parseIntegerArray    = makeParseScalarArray(Int32Array);

export const parseScalarArray     = makeParseScalarArray(Float32Array)
export const parseScalarArrayLike = makeParseScalarArrayLike(Float32Array);
export const parseScalarMultiArray = makeParseMultiScalarArray(Float32Array);

export const parseVec2Array = makeParseVectorArray(2, 0, Float32Array);
export const parseVec3Array = makeParseVectorArray(3, 0, Float32Array);
export const parseVec4Array = makeParseVectorArray(4, 0, Float32Array);

export const parseVec4MultiArray = makeParseVectorArray(4, 0, Float32Array);

export const parseChunks = toCompositeChunks;

//////////////////

export const parsePosition   = makeParseVec4(NO_POSITION);
export const parseQuaternion = makeParseVec4(NO_QUAT);
export const parseScale      = makeParseVec3(NO_SCALE);
export const parseMatrix     = makeParseMat4();

export const parsePositionArray = makeParseVectorArray(4, 1, Float32Array);
export const parsePositionMultiArray = makeParseMultiVectorArray(4, 1, Float32Array);

export const parseSide       = makeParseEnum<Side>(['front', 'back', 'both']);

export const parseJoin       = makeParseEnum<Join>(['bevel', 'miter', 'round']);
export const parseBlending   = makeParseEnum<Blending>(['none', 'premultiply', 'alpha', 'add', 'subtract', 'multiply']);

export const parsePlacement  = makeParseMap({
  'center':      vec2.fromValues( 0,  0),
  'left':        vec2.fromValues( 1,  0),
  'top':         vec2.fromValues( 0,  1),
  'right':       vec2.fromValues(-1,  0),
  'bottom':      vec2.fromValues( 0, -1),
  'topLeft':     vec2.fromValues( 1,  1),
  'topRight':    vec2.fromValues(-1,  1),
  'bottomLeft':  vec2.fromValues( 1, -1),
  'bottomRight': vec2.fromValues(-1, -1),
}, 'center');

export const parseWeight = makeParseMapOrValue({
  'thin': 100,
  'extra-light': 200,
  'light': 300,
  'normal': 400,
  'medium': 500,
  'semi-bold': 600,
  'bold': 700,
  'extra-bold': 800,
  'black': 900,
  'extra-black': 900,
}, 'normal');

export const parseAxes   = makeParseBasis('xyzw');
export const parseRange  = makeParseVec2(NO_RANGE);
export const parseRanges = makeParseArray(NO_RANGES, parseRange);

export const parseDomain = makeParseEnum<Domain>(['linear', 'log']);
export const parsePointShape = makeParseEnum<PointShape>([
  'circle',
  'diamond',
  'square',
  'up',
  'down',
  'left',
  'right',
]);
