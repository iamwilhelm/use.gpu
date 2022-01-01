import { Key } from '@use-gpu/live/types';

export type Rectangle = [number, number, number, number];
export type Point = [number, number];

export type LayoutState = Rectangle;
export type LayoutResult = {
  box: Rectangle,
  size: Point,
  grow: number,
  shrink: number,

  results?: LayoutResult[],
  element?: LiveElement<any>,
  key?: Key,
};

export type LayoutGenerator = (layout: LayoutState) => LayoutResult;
export type LayoutResolver = (layout: LayoutState, ls: LayoutHandler[]) => LayoutResult;
