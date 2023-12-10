import type { LiveFunction, LiveElement } from '@use-gpu/live';

export type LayerType = 'point' | 'line';

export type LayerAggregator = (
  device: GPUDevice,
  items: LayerAggregate[],
  keys: Set<string>,
  count: number,
  indices?: number,
) => (
  items: LayerAggregate[],
  count: number,
  indices?: number,
) => LiveElement;

export type PointAggregate = {
  id: number,
  count: number,
  archetype?: number,
  transform?: any,

  shape?: PointShape,

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
  id: number,
  count: number,
  isLoop?: boolean,
  archetype?: number,
  transform?: any,

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

export type FaceAggregate = {
  id: number,
  count: number,
  archetype?: number,
  transform?: any,

  cullMode?: 'front' | 'back' | 'none',

  positions?: number[],
  indices?: number[],
  colors?: number[],
  sizes?: number[],
  depths?: number[],

  position?: number[],
  index?: number[],
  color?: number[],
  size?: number[],
  depth?: number,
};

export type LayerAggregate =
  | PointAggregate
  | LineAggregate
  | FaceAggregate;
