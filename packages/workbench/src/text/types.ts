import { TypedArray } from '@use-gpu/core/types';
import { FontProps } from '@use-gpu/text/types';

export type Alignment = 'start' | 'center' | 'end' | 'justify' | 'justify-start' | 'justify-center' | 'justify-end' | 'between' | 'evenly';

export type FontSource = FontProps & {
  src: string,
};

export type SDFGlyphData = {
  id: number,
  indices: TypedArray,
  layouts: TypedArray,
  rectangles: TypedArray,
  uvs: TypedArray,
  sdf: [number, number, number, number],
};


