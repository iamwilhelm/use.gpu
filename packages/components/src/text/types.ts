import { TypedArray } from '@use-gpu/core/types';
import { FontProps } from '@use-gpu/text/types';

export type FontSource = FontProps & {
  src: string,
};

export type SDFGlyphData = {
  id: number,
  indices: TypedArray,
  layouts: TypedArray,
  rectangles: TypedArray,
  uvs: TypedArray,
  sdf: [number, number],
};


