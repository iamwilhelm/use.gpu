import { TextureSource, Tuples, Point, Point4, Rectangle } from '@use-gpu/core/types';
import { LiveElement, Key } from '@use-gpu/live/types';
import { FontMetrics } from '@use-gpu/text/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { mat4 } from 'gl-matrix';

export type AutoPoint = [number | null, number | null];
export type Gap = Point;
export type Margin = Point4;
export type Sizing = Point4;

export type Alignment = 'start' | 'center' | 'end' | 'justify' | 'justify-start' | 'justify-center' | 'justify-end' | 'between' | 'evenly';
export type Anchor = 'start' | 'center' | 'end';
export type Base = 'start' | 'base' | 'center' | 'end';
export type Dimension = number | string;
export type Direction = 'x' | 'y' | 'lr' | 'rl' | 'tb' | 'bt';
export type Fit = 'contain' | 'cover' | 'scale' | 'none';
export type Overflow = 'visible' | 'scroll' | 'hidden' | 'auto';
export type Repeat = 'x' | 'y' | 'xy' | 'none';

export type MarginLike = number | number[];
export type GapLike = number | number[];
export type AlignmentLike = Alignment | Alignment[]

export type BoxTrait = {
  grow: number,
  shrink: number,
  margin: MarginLike,
};

export type ElementTrait = {
  width: Dimension,
  height: Dimension,

  radius: MarginLike,
  border: MarginLike,
  stroke: Color,
  fill: Color,
  image: ImageTrait,
};

export type ImageTrait = {
  texture: TextureSource,
  width: Dimension,
  height: Dimension,
  fit: Fit,
  repeat: Repeat,
  align: AnchorLike,
};

export type OverflowTrait = {
  x: Overflow,
  y: Overflow,
  scrollX: number,
  scrollY: number,
};

export type LayoutRenderer = (box: Rectangle, clip?: ShaderModule, transform?: ShaderModule) => LiveElement<any>;
export type InlineRenderer = (lines: InlineLine[], clip?: ShaderModule, transform?: ShaderModule) => LiveElement<any>;

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
  stretch?: boolean,

  fit: (size: AutoPoint) => LayoutFit,
};

export type InlineElement = {
  spans: Tuples<4>,
  height: FontMetrics,
  margin?: Margin,
  anchor?: Base,
  block?: LayoutFit,
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
  clip?: ShaderModule,
  transform?: ShaderModule,
  bounds: Rectangle,
};
