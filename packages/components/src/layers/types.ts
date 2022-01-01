export enum LayerType {
  Point = 'point',
  Line = 'line',
  Rectangle = 'rectangle',
};

export type RectangleAggregate = {
  count: number,

  rectangles?: number[],
  colors?: number[],

  rectangle?: number[],
  color?: number[],
};

export type PointAggregate = {
  count: number,

  positions?: number[],
  colors?: number[],
  sizes?: number[],
  depths?: number[],

  position?: number[],
  color?: number[],
  size?: number[],
  depth?: number,
};

export type LineAggregate = {
  count: number,
  isLoop?: boolean,

  positions?: number[],
  segments?: number[],
  colors?: number[],
  sizes?: number[],
  depths?: number[],

  position?: number[],
  segment?: number[],
  color?: number[],
  size?: number[],
  depth?: number,
};

export type LayerAggregate =
  | PointAggregate
  | LineAggregate
  | RectangleAggregate;