import type { LiveFunction, LiveElement } from '@use-gpu/live';
import type { PointShape } from '@use-gpu/parse';
import type { LineLayerFlags } from '../line-layer';
import type { FaceLayerFlags } from '../face-layer';
import type { PointLayerFlags } from './point-layer';
import type { ArrowLayerFlags } from './arrow-layer';
import type { TransformContextProps } from '../providers/transform-provider';

export type LayerType = 'point' | 'line' | 'face';

export type LayerAggregator = (
  device: GPUDevice,
  items: LayerAggregate[],
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
  transform?: TransformContextProps,
  zIndex?: number,
};

export type PointAggregate = {
  flags: PointLayerFlags,
  attributes: {
    position?: TypedArray,
    positions?: TypedArray,
    color?: TypedArray,
    colors?: TypedArray,
    size?: number,
    sizes?: TypedArray,
    depth?: number,
    depths?: TypedArray,
    zBias?: number,
    zBiases?: TypedArray,
    zIndex: number,

    id?: number,
    ids?: TypedArray,
    lookup?: number,
    lookups?: TypedArray,
  },
};

export type LineAggregate = {
  flags: LineLayerFlags,
  attributes: {
    position?: TypedArray,
    positions?: TypedArray,
    color?: TypedArray,
    colors?: TypedArray,
    size?: number | TypedArray,
    sizes?: TypedArray,
    depth?: number | TypedArray,
    depths?: TypedArray,
    zBias?: number | TypedArray,
    zBiases?: TypedArray,
    zIndex: number,

    segments?: TypedArray,
    unweld?: TypedArray,

    id?: number | TypedArray,
    ids?: TypedArray,
    lookup?: number | TypedArray,
    lookups?: TypedArray,
  },
};

export type ArrowAggregate = {
  flags: ArrowLayerFlags,
  attributes: {
    position?: TypedArray,
    positions?: TypedArray,
    color?: TypedArray,
    colors?: TypedArray,
    size?: number | TypedArray,
    sizes?: TypedArray,
    depth?: number | TypedArray,
    depths?: TypedArray,
    zBias?: number | TypedArray,
    zBiases?: TypedArray,
    zIndex: number,

    segments?: TypedArray,
    unweld?: TypedArray,
    anchors?: TypedArray,
    trims?: TypedArray,

    id?: number | TypedArray,
    ids?: TypedArray,
    lookup?: number | TypedArray,
    lookups?: TypedArray,
  },
};

export type FaceAggregate = {
  flags: FaceLayerFlags,
  attributes: {
    position?: TypedArray,
    positions?: TypedArray,
    color?: TypedArray,
    colors?: TypedArray,
    size?: number | TypedArray,
    sizes?: TypedArray,
    depth?: number | TypedArray,
    depths?: TypedArray,
    zBias?: number | TypedArray,
    zBiases?: TypedArray,
    zIndex: number,

    segments?: TypedArray,
    indices?: number[],

    id?: number | TypedArray,
    ids?: TypedArray,
    lookup?: number | TypedArray,
    lookups?: TypedArray,
  },
};

export type LayerAggregate = {
  point: PointAggregate | PointAggregate[],
  line: LineAggregate | LineAggregate[],
  arrow: ArrowAggregate | ArrowAggregate[],
  face: FaceAggregate | FaceAggregate[],
  layer: LiveElement,
};
