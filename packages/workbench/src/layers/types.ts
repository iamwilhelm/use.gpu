import type { LiveFunction, LiveElement } from '@use-gpu/live';
import type { PointShape } from '@use-gpu/parse';
import type { LineLayerFlags } from '../line-layer';
import type { FaceLayerFlags } from '../face-layer';
import type { PointLayerFlags } from './point-layer';

export type LayerType = 'point' | 'line' | 'face';

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

export type ShapeAggregate = {
  archetype: number,
  count: number,
  indices?: number,
  transform?: any,
  zIndex?: number,
};

type ShapeAttributes = {
  positions?: number[],
  colors?: number[],
  depths?: number[],
  zBiases?: number[],
  ids?: number[],
  lookups?: number[],

  position?: number[],
  color?: number[],
  depth?: number,
  zBias?: number,
  id?: number,
  lookup?: number,
};

export type PointAggregate = ShapeAggregate & {
  flags: PointLayerFlags,
  attributes: ShapeAttributes & {
    sizes?: number[],

    size?: number,
  },
};

export type LineAggregate = ShapeAggregate & {
  flags: LineLayerFlags,
  attributes: {
    segments?: number[],
    sizes?: number[],

    segment?: number,
    size?: number,
  },
};

export type FaceAggregate = ShapeAggregate & {
  flags: FaceLayerFlags,
  attributes: {
    indices?: number[],
    segments?: number[],

    index?: number,
    segment?: number,
  },
};

export type LayerAggregate = {
  point: PointAggregate | PointAggregate[],
  line: LineAggregate | LineAggregate[],
  face: FaceAggregate | FaceAggregate[],
};
