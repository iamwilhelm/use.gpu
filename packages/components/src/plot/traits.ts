import { useOne } from '@use-gpu/live';
import { useProp, useOptional } from './prop';
import {
  parseFloat,
  parseInt,
  parseBoolean,
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
} from './util/parse';

import { vec4 } from 'gl-matrix';

export const useLineTrait = (props: Partial<LineTrait>): LineTrait => {
  const {
    width = 1,
    depth = 0,
    join = 'bevel',
    loop = false,
    dash,
    proximity = 0,
  } = props;
  
  const parsed = useOne(() => ({}));

  parsed.width     = useProp(width, parseFloat);
  parsed.depth     = useProp(depth, parseFloat);
  parsed.join      = useProp(join,  parseJoin);
  parsed.loop      = useProp(loop,  parseBoolean);
  parsed.dash      = useProp(dash, parseVector);
  parsed.proximity = useProp(proximity, parseFloat);

  return parsed;
};

export const useColorTrait = (props: Partial<ColorTrait>): vec4 => {
  const {
    color = [0.5, 0.5, 0.5, 1],
    opacity = 1,
  } = props;

  const c = useProp(color, parseColor);
  const o = useProp(opacity, parseFloat);

  if (o === 1) return vec4.clone(c);
  return vec4.fromValues(c[0], c[1], c[2], c[3] * o);
};

export const useROPTrait = (props: Partial<ROPTrait>): ROPTrait => {
  const {
    blending = 'normal',
    zWrite = true,
    zTest = true,
    zBias = 0,
    zIndex = 0,
  } = props;

  const parsed = useOne(() => ({}));

  parsed.blending = useProp(blending, parseBlending);
  parsed.zWrite   = useProp(zWrite, parseBoolean);
  parsed.zTest    = useProp(zTest, parseBoolean);
  parsed.zBias    = useProp(zBias, parseFloat);
  parsed.zIndex   = useProp(zIndex, parseInt);

  return parsed;
};

export const useArrowTrait = (props: Partial<ArrowTrait>): ArrowTrait => {
  const {
    size = 4,
    start = false,
    end = true,
  } = props;

  const parsed = useOne(() => ({}));

  parsed.size  = useProp(size, parseFloat);
  parsed.start = useProp(start, parseBoolean);
  parsed.end   = useProp(end, parseBoolean);

  return parsed;
};

export const useAxesTrait = (props: Partial<AxesTrait>): AxesTrait => {
  const {
    axes = 'xyzw',
    range = null,
  } = props;

  const parsed = useOne(() => ({}));

  parsed.axes  = useProp(axes, parseAxes);
  parsed.range = useOptional(range, parseRanges);

  return parsed;
};

export const useAxisTrait = (props: Partial<AxisTrait>): AxisTrait => {
  const {
    axis = 'x',
    range = null,
  } = props;

  const parsed = useOne(() => ({}));

  parsed.axis  = useProp(axis, parseAxis);
  parsed.range = useOptional(range, parseRange);

  return parsed;
};

export const useScaleTrait = (props: Partial<ScaleTrait>): ScaleTrait => {
  const {
    divide = 10,
    unit = 1,
    base = 10,
    mode = 'linear',
    start = true,
    end = true,
    zero = true,
    factor = 1,
    nice = true,
  } = props;

  const parsed = useOne(() => ({}));

  parsed.mode   = useProp(mode, parseDomain);
  parsed.divide = useProp(divide, parseFloat);
  parsed.unit   = useProp(unit, parseFloat);
  parsed.base   = useProp(base, parseFloat);
  parsed.start  = useProp(start, parseBoolean);
  parsed.end    = useProp(end, parseBoolean);
  parsed.zero   = useProp(zero, parseBoolean);
  parsed.factor = useProp(factor, parseFloat);
  parsed.nice   = useProp(nice, parseBoolean);
  
  return parsed;
};
