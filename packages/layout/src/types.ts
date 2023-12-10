import type { Tuples, XY, XYZW, Rectangle } from '@use-gpu/core';
import type { LiveElement, Key } from '@use-gpu/live';
import type { FontMetrics } from '@use-gpu/glyph';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';
import type { Color, ColorLike } from '@use-gpu/traits';
import { mat4 } from 'gl-matrix';

export type AutoXY = [number | null, number | null];
export type AutoRectangle = [number | null, number | null, number | null, number | null];
export type Gap = XY;
export type Margin = XYZW;
export type Sizing = [number | null, number | null, number, number];

export type Alignment = 'start' | 'center' | 'end' | 'justify' | 'justify-start' | 'justify-center' | 'justify-end' | 'between' | 'evenly';
export type Anchor = 'start' | 'center' | 'end';
export type Base = 'start' | 'base' | 'base-center' | 'center' | 'end';
export type Dimension = number | string;
export type Direction = 'x' | 'y' | 'lr' | 'rl' | 'tb' | 'bt';
export type Fit = 'contain' | 'cover' | 'scale' | 'none';
export type OverflowMode = 'visible' | 'scroll' | 'hidden' | 'auto';
export type Repeat = 'x' | 'y' | 'xy' | 'none';

export type FitInto = [number | null, number | null, number, number];

export type MarginLike = number | number[];
export type GapLike = number | number[];
export type AlignmentLike = Alignment | Alignment[];
export type AnchorLike = Anchor | Anchor[];

export type BoxTrait = {
  grow: number,
  shrink: number,
  margin: MarginLike,
  inline: Base,
  flex: Anchor,
};

export type RefTrait = {
  ref: (rectangle: Rectangle, origin: XY) => void,
};

export type ElementTrait = {
  width: Dimension,
  height: Dimension,
  aspect: number | null,

  radius: MarginLike,
  border: MarginLike,
  stroke: ColorLike,
  fill: ColorLike,
  image: Partial<ImageTrait>,
};

export type ImageTrait = {
  texture: ShaderSource,
  width: Dimension,
  height: Dimension,
  fit: Fit,
  repeat: Repeat,
  align: AnchorLike,
};

export type LayoutRenderer = (
  box: Rectangle,
  origin: Rectangle,
  clip: ShaderModule | null,
  mask: ShaderModule | null,
  transform: ShaderModule | null,
) => LiveElement;

export type RenderInside = {
  sizes: XY[],
  offsets: XY[],
  renders: LayoutRenderer[],
  clip?: ShaderModule | null,
  mask?: ShaderModule | null,
  transform?: ShaderModule | null,
  inverse?: ShaderModule | null,
};

export type RenderInline = {
  ranges: XY[],
  sizes: XY[],
  offsets: [number, number, number][],
  renders: InlineRenderer[],
  key?: number,
};

export type RenderOutside = {
  box: Rectangle,
  origin: Rectangle,
  clip?: ShaderModule | null,
  mask?: ShaderModule | null,
  transform?: ShaderModule | null,
  ref?: (rectangle: Rectangle, origin: Rectangle) => LiveElement,
};

export type InlineRenderer = (
  lines: InlineLine[],
  origin: Rectangle,
  clip: ShaderModule | null,
  mask: ShaderModule | null,
  transform: ShaderModule | null,
  version?: number
) => LiveElement;

export type LayoutShaders = {
  texture?: ShaderModule | null,
  transform?: ShaderModule | null,
  clip?: ShaderModule | null,
  mask?: ShaderModule | null,
};

export type LayoutScroller = (x: number, y: number) => void;
export type LayoutPicker = (x: number, y: number, l: number, t: number, r: number, b: number, scroll: boolean) => [number, Rectangle, LayoutScroller] | null;

export type LayoutFit = {
  size: XY,
  render: LayoutRenderer,
  pick?: LayoutPicker | null,
  transform?: ShaderModule,
};

export type LayoutElement = {
  size?: AutoXY,

  sizing: Sizing,
  margin: Margin,

  ratioX?: number,
  ratioY?: number,

  grow?: number,
  shrink?: number,
  absolute?: boolean,
  under?: boolean,
  stretch?: boolean,
  inline?: Base,
  flex?: Anchor,

  fit: (size: FitInto) => LayoutFit,
  prefit: (size: FitInto) => LayoutFit,
};

export type InlineElement = {
  spans: Tuples<4>,
  height: FontMetrics,
  margin?: Margin,
  inline?: Base,
  block?: LayoutFit,
  absolute?: boolean,
  render: InlineRenderer,
  pick?: LayoutPicker | null,
};

export type InlineLine = {
  layout: Rectangle,
  start: number,
  end: number,
  gap: number,
};

export const ARCHETYPES = {
  glyphs: 1,
  textured: 2,
  solid: 3,
};

export type UIAggregate = {
  id: string | number,
  count: number,

  rectangles?: number[],
  colors?: number[],
  uvs?: number[],
  sts?: number[],
  repeats?: number[],
  borders?: number[],
  strokes?: number[],
  fills?: number[],
  radiuses?: number[],
  sdfs?: number[],

  rectangle?: number[],
  color?: number[],
  uv?: number[],
  st?: number[],
  repeat?: number,
  border?: number[],
  stroke?: number[],
  fill?: number[],
  radius?: number[],
  sdf?: number[],

  archetype?: number,
  bounds: Rectangle,
} & LayoutShaders;
