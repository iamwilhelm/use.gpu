import { TypedArray } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

export type Light = {
  kind: number,
  position?: TypedArray | number[],
  normal?: TypedArray | number[],
  tangent?: TypedArray | number[],
  size?: TypedArray | number[],
  color?: TypedArray | number[],
  intensity?: number,
  transform?: ShaderModule | null,
};