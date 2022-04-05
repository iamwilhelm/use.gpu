import { TypedArray } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/wgsl/types';

export type Swizzle = string;

export type Range = [number, number];

export type VectorLike = TypedArray | number[];

export type TransformContextProps = {
  range: Range[],
  transform: ShaderModule | null,
};
