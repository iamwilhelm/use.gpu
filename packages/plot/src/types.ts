import type { VectorLike, VectorLikes, ColorLike, Blending } from '@use-gpu/core';
import type { PointShape, Placement, Domain, Join } from '@use-gpu/parse';

export type Axis4 = 'x' | 'y' | 'z' | 'w';
export type Swizzle = string;

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

/*
export type AnchorTrait = {
  placement: Placement,
  offset: number,
};

export type AxisTrait = {
  range: VectorLike,
  axis: Axis4,
};

export type AxesTrait = {
  range: VectorLike[],
  axes: Swizzle,
};

export type ArrowTrait = {
  size: number,
  start: boolean,
  end: boolean,
};

export type ArrowsTrait = {
  sizes: number[],
  starts: boolean[],
  ends: boolean[],
};

export type ColorTrait = {
  color: ColorLike,
  opacity: number,
};

export type ColorsTrait = {
  colors: ColorLike[],
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
  label?: string,
  format?: (v: number, i: number) => string,

  size: number,
  depth: number,

  background: ColorLike,
  expand: number,
  box: number | [number, number],
};

export type LabelsTrait = {
  labels?: string[],
};

export type LineTrait = {
  width: number,
  depth: number,
  loop: boolean,

  join: Join,
  dash: number[] | null,
  proximity: number,
};

export type LinesTrait = {
  line?: VectorLikes,
  lines?: VectorLikes[],
  widths: number[],
  depths: number[],
  loops: boolean[],
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
  sizes: number[],
  depth: number,
  depths: number[],

  shape: PointShape,
};

export type PointsTrait = {
  point?: VectorLike,
  points?: VectorLikes,

  sizes: number[],
  depths: number[],
};

export type ROPTrait = {
  alphaToCoverage: boolean,
  blend:           Blending,
  depthWrite:      boolean,
  depthTest:       boolean,
  mode:            string,
};

export type ScaleTrait = DomainOptions & {
  mode: Domain,
};

export type SurfaceTrait = {
  loopX: boolean,
  loopY: boolean,
  shaded: boolean,
};

export type VolumeTrait = {
  loopX: boolean,
  loopY: boolean,
  loopZ: boolean,
  shaded: boolean,
};

export type ZBiasTrait = {
  zBias: number,
  zIndex: number,
};

export type ZBiasesTrait = {
  zBiases: VectorLike,
};
*/
