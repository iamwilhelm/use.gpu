import { VectorLike, ColorLike } from '../traits/types';

export type Axis = 'x' | 'y' | 'z' | 'w';
export type Blending = 'none' | 'normal' | 'add' | 'subtract' | 'multiply' | 'custom';
export type Dimension = string | number;
export type Domain = 'linear' | 'log';
export type Join = 'miter' | 'round' | 'bevel';
export type Placement = 'center' | 'left' | 'top' | 'right' | 'bottom';
export type Swizzle = string;
export type PointShape = 'circle' | 'diamond' | 'square' | 'circleOutlined' | 'diamondOutlined' | 'squareOutlined';

export type AnchorTrait = {
  placement: Placement,
  offset: number,
};

export type AxisTrait = {
  range: VectorLike,
  axis: Axis,
};

export type AxesTrait = {
  range: VectorLike[],
  axes: Swizzle,
};

export type ArrowTrait = {
  size: number,
  start: boolean,
  end: boolean,
  detail: number,
};

export type ColorTrait = {
  color: ColorLike,
  opacity: number,
};

export type FontTrait = {
  family: string,
  weight: string | number,
  style: string,
};

export type GridTrait = {
  range?: VectorLike[],
  axes: Swizzle,
};

export type LabelTrait = {
  labels?: string[],
  expr?: (v: number, i: number) => string,
  size: number,
  depth: number,
  expand: number,
  background: ColorLike,
  box: number | [number, number],
};

export type LineTrait = {
  width: number,
  depth: number,
  join: Join,
  loop: boolean,
  dash: number[] | null,
  proximity: number,
};

export type ObjectTrait = {
  position: VectorLike,
  scale: VectorLike,
  quaternion: VectorLike,
  rotation: VectorLike,
  matrix: VectorLike,
};

export type PointTrait = {
  size: number,
  depth: number,
  shape: PointShape,
};

export type ROPTrait = {
  blending: Blending,
  zWrite: boolean,
  zTest: boolean,
  zBias: number,
  zIndex: number,
};

export type ScaleTrait = DomainOptions & {
  mode: Domain,
};

export type DomainOptions = {
  divide: number,
  unit: number,
  base: number,
  start: boolean,
  end: boolean,
  zero: boolean,
  factor: number,
  nice: boolean,
};

export type SurfaceTrait = {
  loopX: boolean,
  loopY: boolean,
};

