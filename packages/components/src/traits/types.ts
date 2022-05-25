import { TypedArray, Point4 } from '@use-gpu/core/types';

export type PropParser<A, B> = (t?: A) => B;
export type PropDef = Record<string, PropParser<any, any>>;

export type Color = Point4;
export type ColorLike = number | VectorLike | {rgb: VectorLike} | {rgba: VectorLike} | string;

export type VectorLike = TypedArray | number[];
export type ArrayLike<T = any> = TypedArray | T[];
