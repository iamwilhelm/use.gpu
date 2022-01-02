import { Key } from '@use-gpu/live/types';

export type Margin = [number, number, number, number];
export type Rectangle = [number, number, number, number];
export type Point = [number, number];

export type LayoutState = Rectangle;
export type LayoutResult = {
  box: Rectangle,
  margin: Margin,
  size: Point,
  grow: number,
  shrink: number,

  results?: LayoutResult[],
  render?: (layout: LayoutState) => LiveElement<any>,
  key?: Key,
};

export type LayoutGenerator = (layout: LayoutState) => LayoutResult;
export type LayoutResolver = (layout: LayoutState, ls: LayoutHandler[]) => LayoutResult;
