import { StorageSource } from '@use-gpu/core/types';

export type SDFGlyphData = {
  id: number,
  indices: StorageSource,
  layouts: StorageSource,
  rectangles: StorageSource,
  uvs: StorageSource,
  sdf: [number, number],
};
