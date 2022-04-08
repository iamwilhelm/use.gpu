import { TypedArray } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/wgsl/types';

export type Swizzle = string;
export type Axis = 'x' | 'y' | 'z' | 'w';
export type Range = [number, number];
export type Join = 'miter' | 'round' | 'bevel';
export type Blending = 'none' | 'normal' | 'add' | 'subtract' | 'multiply' | 'custom';
export type Domain = 'linear' | 'log',

export type VectorLike = TypedArray | number[];

export type LineTrait = {
  width: number,
  depth: number,
  join: Join,
  loop: boolean,
  dash: number[] | null,
  proximity: number,
};

export type ColorTrait = {
  color: number | VectorLike,
  opacity: number,
};

export type ROPTrait = {
  blending: Blending,
  zWrite: boolean,
  zTest: boolean,
  zBias: number,
  zIndex: number,
};

export type ArrowTrait = {
  size: number,
  start: boolean,
  end: boolean,
};

export type ScaleTrait = {
  mode?: Domain,
  divide?: number,
  unit?: number,
  base?: number,
  start?: true,
  end?: true,
  zero?: true,
  factor?: number,
  nice?: boolean,
};

export type AxisTrait = {
  range?: VectorLike,
  axis?: Axis,
};

export type AxesTrait = {
  range?: VectorLike[],
  axes?: Swizzle,
};
