import type { LiveFunction, LiveElement } from '@use-gpu/live';
import type { PointShape } from '@use-gpu/parse';
import type { LineLayerFlags } from '../line-layer';
import type { FaceLayerFlags } from '../face-layer';
import type { PointLayerFlags } from './point-layer';
import type { ArrowLayerFlags } from './arrow-layer';
import type { TransformContextProps } from '../providers/transform-provider';
import type { MaterialContextProps } from '../providers/material-provider';

export type VirtualLayerType = 'point' | 'line' | 'arrow' | 'face' | 'layer';

export type VirtualLayerAggregator = (
  device: GPUDevice,
  items: VirtualLayerAggregate[],
  count: number,
  indices?: number,
) => (
  items: VirtualLayerAggregate[],
  count: number,
  indices?: number,
) => LiveElement;

export type ShapeAggregate = {
  archetype: number,
  count: number,
  indices?: number,
  transform?: TransformContextProps,
  material?: MaterialContextProps,
  zIndex?: number,
};

export type PointAggregate = ShapeAggregate & {
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

export type LineAggregate = ShapeAggregate & {
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

export type ArrowAggregate = ShapeAggregate & {
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

export type FaceAggregate = ShapeAggregate & {
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
  transform?: TransformContextProps,
  material?: MaterialContextProps,
  element: LiveElement,
};

export type VirtualLayerAggregate = {
  point: PointAggregate | PointAggregate[],
  line: LineAggregate | LineAggregate[],
  arrow: ArrowAggregate | ArrowAggregate[],
  face: FaceAggregate | FaceAggregate[],
  layer: LayerAggregate | LayerAggregrate[],
};
