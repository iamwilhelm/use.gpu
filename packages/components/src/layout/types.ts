import { TextureSource, Tuples } from '@use-gpu/core/types';
import { LiveElement, Key } from '@use-gpu/live/types';
import { FontMetrics } from '@use-gpu/text/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { mat4 } from 'gl-matrix';

export type Point = [number, number];
export type Point4 = [number, number, number, number];

export type AutoPoint = [number | null, number | null];

export type Dimension = number | string;

export type Gap = Point;
export type Sizing = Point4;
export type Margin = Point4;
export type Rectangle = Point4;
export type Direction = 'x' | 'y' | 'lr' | 'rl' | 'tb' | 'bt';
export type Alignment = 'start' | 'center' | 'end' | 'justify' | 'justify-start' | 'justify-center' | 'justify-end' | 'between' | 'evenly';
export type Anchor = 'start' | 'center' | 'end';
export type Base = 'start' | 'base' | 'center' | 'end';

export type MarginLike = number | number[];

export type Fit = 'contain' | 'cover' | 'scale' | 'none';
export type Repeat = 'x' | 'y' | 'xy' | 'none';

export type ImageAttachment = {
  texture: TextureSource,
  width?: Dimension,
  height?: Dimension,
  fit?: Fit,
  repeat?: Repeat,
  align?: Anchor | [Anchor, Anchor],
};

export type LayoutRenderer = (box: Rectangle, transform?: ShaderModule) => LiveElement<any>;
export type InlineRenderer = (lines: InlineLine[], transform?: ShaderModule) => LiveElement<any>;

export type LayoutScroller = (x: number, y: number) => void;
export type LayoutPicker = (x: number, y: number, ox: number, oy: number, scroll: boolean) => [number, Rectangle, LayoutScroller] | null;

export type LayoutFit = {
  size: Point,
  render: LayoutRenderer,
  pick: LayoutPicker,
  transform?: ShaderModule,
};

export type LayoutElement = {
  sizing: Sizing,
  margin: Margin,

  ratioX?: number,
  ratioY?: number,

  grow?: number,
  shrink?: number,
  absolute?: boolean,
  under?: boolean,

  fit: (size: Point) => LayoutFit,
};

export type InlineElement = {
  spans: Tuples<4>,
  height: FontMetrics,
  absolute?: boolean,
  render: InlineRenderer,
};

export type InlineLine = {
  layout: Rectangle,
  start: number,
  end: number,
  gap: number,
};

export type UIAggregate = {
  id: number,
  count: number,

  rectangles?: number[],
  colors?: number[],
  uvs?: number[],
  repeats?: number[],

  rectangle?: number[],
  color?: number[],
  uv?: number[],
  repeat?: number,

  texture?: TextureSource,
  transform?: any,
  bounds: Rectangle,
};
