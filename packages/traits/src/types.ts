import { ArrowFunction } from '@use-gpu/live/types';

export type TypedArray =
  Int8Array |
  Uint8Array |
  Int16Array |
  Uint16Array |
  Int32Array |
  Uint32Array |
  Uint8ClampedArray |
  Float32Array |
  Float64Array;

export type PropParser<A, B> = (t?: A) => B;
export type PropDef = Record<string, PropParser<any, any>>;
export type PropDefTypes<T extends Record<string, ArrowFunction>> = {
  [P in keyof T]?: ReturnType<T[P]>;
};

export type UseTrait<I, O> = (props?: Partial<I>) => O;

export type Blending = 'none' | 'normal' | 'add' | 'subtract' | 'multiply' | 'custom';
export type Join = 'miter' | 'round' | 'bevel';
export type Placement = 'center' | 'left' | 'top' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export type Domain = 'linear' | 'log';

export type Color = [number, number, number, number];
export type ColorLike = number | VectorLike | {rgb: VectorLike} | {rgba: VectorLike} | string;

export type VectorLike = TypedArray | number[];
export type ArrayLike<T = any> = TypedArray | T[];
