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
