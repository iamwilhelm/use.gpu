import { TypedArray } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/wgsl/types';

export type Swizzle = string;
export type Axis = 'x' | 'y' | 'z' | 'w';
export type Range = [number, number];
export type Join = 'miter' | 'round' | 'bevel';
export type Blending = 'no' | 'normal' | 'add' | 'subtract' | 'multiply' | 'custom';

export type VectorLike = TypedArray | number[];

export type LineProps = {
  width: number,
  depth: number,
  join: Join,
  loop: boolean,
  dash: number[] | null,
  proximity: number,
};

export type ColorProps = {
  color: number | VectorLike,
  opacity: number,
};

export type ROPProps = {
  blending: Blending,
  zWrite: boolean,
  zTest: boolean,
  zBias: number,
  zIndex: number,
};

export type ArrowProps = {
  size: number,
  start: boolean,
  end: boolean,
};

export type TransformContextProps = {
  range: Range[],
  transform: ShaderModule | null,
};
