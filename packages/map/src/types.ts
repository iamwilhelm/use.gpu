import type { VectorLike, ColorLike, Placement, Blending, Domain, Join } from '@use-gpu/traits';
import type { PointShape } from '@use-gpu/workbench';

export type GeographicTrait = {
  origin: VectorLike,
  zoom: number,
};

export type ObjectTrait = {
  position: VectorLike,
  scale: VectorLike,
  quaternion: VectorLike,
  rotation: VectorLike,
  matrix: VectorLike,
};

export type MVTStyleProperties = {
  face: {
    stroke?: ColorLike,
    fill?: ColorLike,
    zBias?: any,
  },
  line: {
    color?: ColorLike,
    width?: number,
    depth?: number,
    zBias?: any,
  },
  point?: {
    color?: ColorLike,
    size?: number,
    shape?: any,
    zBias?: any,
  },
  font?: {
    family?: string,
    style?: string,
    weight?: string | number,
    lineHeight?: number,
    size?: number,
  },  
};

