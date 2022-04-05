import { TypedArray, VectorLike } from '../types';
import { mat4, vec3, vec2, quat } from 'gl-matrix';

const NO_VEC2 = vec2.fromValues(0, 0);
const NO_VEC3 = vec3.fromValues(0, 0, 0);
const NO_QUAT = quat.fromValues(0, 0, 0);
const NO_MAT4 = mat4.create();

const NO_RANGE = vec2.fromValues(-1, 1);
const NO_RANGES = [NO_RANGE, NO_RANGE, NO_RANGE, NO_RANGE];

export const makeParseVec2 = (defaults: VectorLike) => (vec?: VectorLike): vec2 => {
  if (vec != null) {
    return vec2.fromValues(vec[0] ?? defaults[0], vec[1] ?? defaults[1]);
  }
  return defaults;
};

export const makeParseVec3 = (defaults: VectorLike) => (vec?: VectorLike): vec3 => {
  if (vec != null) {
    return vec3.fromValues(vec[0] ?? defaults[0], vec[1] ?? defaults[1], vec[2] ?? defaults[2]);
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

export const makeParseBasis = (defaults: string) => {
  const axes = defaults.split('');
  const order = axes.map((_, i) => i);

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

export const parsePosition   = makeParseVec3();
export const parseRotation   = makeParseVec3();
export const parseQuaternion = makeParseVec3();
export const parseScale      = makeParseVec3(1, 1, 1);
export const parseMatrix     = makeParseMat4();

export const parseRange      = makeParseVec2(NO_RANGE);
export const parseRanges     = makeParseArray(NO_RANGES, parseRange);

export const parseAxes       = makeParseBasis('xyzw');