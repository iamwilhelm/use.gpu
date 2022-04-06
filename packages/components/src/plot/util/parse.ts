import { LineProps, TypedArray, VectorLike } from '../types';
import { mat4, vec4, vec3, vec2, quat } from 'gl-matrix';

const NO_VEC2 = vec2.fromValues(0, 0);
const NO_VEC3 = vec3.fromValues(0, 0, 0);
const NO_VEC4 = vec4.fromValues(0, 0, 0, 0);
const NO_QUAT = quat.fromValues(0, 0, 0);
const NO_MAT4 = mat4.create();

const GRAY = [0.5, 0.5, 0.5, 1];

const NO_RANGE = vec2.fromValues(-1, 1);
const NO_RANGES = [NO_RANGE, NO_RANGE, NO_RANGE, NO_RANGE];

///////////////////////////

export const makeParseInt = (def: number = 0, min?: number, max?: number) => (value?: number) => {
  if (value != null) {
    value = Math.round(value);
    if (min != null) value = Math.max(min, value);
    if (max != null) value = Math.min(max, value);
    return value;
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
  }
  return defaults;
};

const AXES = {'x': 0, 'y': 1, 'z': 2, 'w': 3} as Record<string, number>;

export const makeParseAxis = (def: number) => (s?: string) => {
  if (s != null) return AXES[s] ?? def;
  return def;
};

export const makeParseBasis = (defaults: string) => {
  const axes = defaults.split('');
  const order = [0, 0, 0, 0];

  const getOrder = (s: string) => {
    order.sort((a, b) => {
      const ai = s.indexOf(axes[a]);
      const bi = s.indexOf(axes[b]);
      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai < 0 && bi < 0) return a - b;
      return (ai < 0) ? 1 : -1;
    });
    return order.join('');
  };

  return (s?: string) => {
    if (s != null) return getOrder(s);
    return defaults;
  }
};

//////////////////

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

///////////////////

export const parseLineProps = (props: Partial<LineProps>): LineProps => {
  const {
    width = 1,
    depth = 0,
    join = 'bevel',
    loop = false,
    dash = null,
    proximity = 0,
  } = props;
  
  return { width, depth, join, loop, dash, proximity };
};

export const parseColorProps = (props: Partial<ColorProps>): vec4 => {
  const {
    color = GRAY,
    opacity = 1,
  } = props;

  if (opacity === 1) return vec4.clone(color);
  return vec4.fromValues(color[0], color[1], color[2], color[3] * opacity);
};

export const parseROPProps = (props: Partial<ROPProps>): ROPProps => {
  const {
    blending = 'normal',
    zWrite = true,
    zTest = true,
    zBias = 0,
    zIndex = 0,
  } = props;

  return { blending, zWrite, zTest, zBias, zIndex };
};

export const parseArrowProps = (props: Partial<ROPProps>): ROPProps => {
  const {
    size = 3,
    start = false,
    end = true,
  } = props;

  return { size, start, end };
};
