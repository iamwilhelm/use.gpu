import { LineTrait, ColorTrait, ROPTrait, ArrowTrait, ScaleTrait, Domain, Join, Blending, TypedArray, VectorLike } from '../types';
import { mat4, vec4, vec3, vec2, quat } from 'gl-matrix';

const NO_VEC2 = vec2.fromValues(0, 0);
const NO_VEC3 = vec3.fromValues(0, 0, 0);
const NO_VEC4 = vec4.fromValues(0, 0, 0, 0);
const NO_QUAT = quat.fromValues(0, 0, 0);
const NO_MAT4 = mat4.create();

const GRAY = [0.5, 0.5, 0.5, 1];

const NO_RANGE = vec2.fromValues(-1, 1);
const NO_RANGES = [NO_RANGE, NO_RANGE, NO_RANGE, NO_RANGE];

const NO_VECTOR = [];

///////////////////////////

export const makeParseFloat = (def: number = 0, min?: number, max?: number) => (value?: number) => {
  if (value != null) {
    if (min != null) value = Math.max(min, value);
    if (max != null) value = Math.min(max, value);
    return +value;
  }
  return def;
};

export const makeParseInt = (def: number = 0, min?: number, max?: number) => (value?: number) => {
  if (value != null) {
    value = Math.round(value);
    if (min != null) value = Math.max(min, value);
    if (max != null) value = Math.min(max, value);
    return value;
  }
  return def;
};

export const makeParseBoolean = (def: boolean = false) => (value?: number | boolean) => {
  if (value != null) {
    return !!value;
  }
  return def;
};

export const makeParseVec2 = (defaults: VectorLike = NO_VEC2) => (vec?: VectorLike): vec2 => {
  if (vec != null) {
    return vec2.fromValues(vec[0] ?? defaults[0], vec[1] ?? defaults[1]);
  }
  return defaults;
};

export const makeParseVec3 = (defaults: VectorLike = NO_VEC3) => (vec?: VectorLike): vec3 => {
  if (vec != null) {
    return vec3.fromValues(vec[0] ?? defaults[0], vec[1] ?? defaults[1], vec[2] ?? defaults[2]);
  }
  return defaults;
};

export const makeParseVec4 = (defaults: VectorLike = NO_VEC4) => (vec?: VectorLike): vec4 => {
  if (vec != null) {
    return vec4.fromValues(vec[0] ?? defaults[0], vec[1] ?? defaults[1], vec[2] ?? defaults[2], vec[3] ?? defaults[3]);
  }
  return defaults;
};

export const makeParseMat4 = () => (matrix?: VectorLike): mat4 => {
  if (matrix != null) {
    return mat4.fromValues(...matrix);
  }
  return NO_MAT4;
};

export const makeParseArray = <T>(
  defaults: T[],
  parse: (v: VectorLike) => T
) => (vecs?: VectorLike[]): T[] => {
  if (vecs != null) {
    const vs = vecs.map(parse);
    const l = vs.length;
    const n = defaults.length;
    if (l < n) for (let i = l; i < n; ++i) vs.push(defaults[i]);
    return vs;
  }
  return defaults;
};

export const makeParseEnum = (
  options: string[],
) => {
  const hash = new Set(options);
  const [def] = options;

  return (s?: string): string => {
    if (s != null && hash.has(s)) return s;
    return def;
  };
};

const AXIS_NUMBERS = {'x': 0, 'y': 1, 'z': 2, 'w': 3} as Record<string, number>;
const AXIS_LETTERS = ['x', 'y', 'z', 'w'];

export const makeParseAxis = (def: number) => (s?: string) => {
  if (s != null) return AXIS_NUMBERS[s] ?? def;
  return def;
};

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

export const makeParseColor = (def: VectorLike[] = GRAY) => (c?: number | VectorLike) => {
  if (c === +c) {
    const a = ((c >> 24) & 255) / 255;
    const r = ((c >> 16) & 255) / 255;
    const g = ((c >> 8) & 255) / 255;
    const b = ((c & 255)) / 255;
    
    return [r, g, b, a];
  }
  if (c.length) {
    return [c[0] ?? def[0], c[1] ?? def[1], c[2] ?? def[2], c[3] ?? def[3] ];
  }
};

//////////////////

export const parseColor      = makeParseColor();

export const parseFloat      = makeParseFloat();
export const parseInt        = makeParseInt();
export const parseBoolean    = makeParseBoolean();

export const parseVector     = makeParseArray(NO_VECTOR, parseFloat);

export const parsePosition4  = makeParseVec4();

export const parsePosition   = makeParseVec3();
export const parseRotation   = makeParseVec3();
export const parseQuaternion = makeParseVec3();
export const parseScale      = makeParseVec3(1, 1, 1);
export const parseMatrix     = makeParseMat4();

export const parseRange      = makeParseVec2(NO_RANGE);
export const parseRanges     = makeParseArray(NO_RANGES, parseRange);

export const parseAxes       = makeParseBasis('xyzw');
export const parseAxis       = makeParseAxis(0);

export const parseDetail     = makeParseInt(1, 1, 1e8);

export const parseDomain     = makeParseEnum<Domain>(['linear', 'log']);
export const parseJoin       = makeParseEnum<Join>(['bevel', 'miter', 'round']);
export const parseBlending   = makeParseEnum<Blending>(['none', 'normal', 'add', 'subtract', 'multiply', 'custom']);

