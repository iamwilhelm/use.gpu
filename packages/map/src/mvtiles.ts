import type { LiveComponent, LiveElement } from '@use-gpu/live';

import { use, keyed, memo, useAsync, useCallback, useOne } from '@use-gpu/live';
import { useLayoutContext } from '@use-gpu/workbench';
import { useRangeContext } from '@use-gpu/plot';

import { useTileContext } from './providers/tile-provider';
import { MVTile } from './mvtile';
import LRU from 'lru-cache';

import { VectorTile } from 'mapbox-vector-tile';

export type MVTilesProps = {
  detail?: number,
  children?: LiveElement,
};

export const MVTiles: LiveComponent<MVTilesProps> = (props) => {
  const {
    minLevel = 2,
    detail = 2,
    children,
  } = props;

  const cache = useOne(() => new LRU({ max: 200 }));

  const layout = useLayoutContext();
  let [[minX, maxX], [minY, maxY]] = useRangeContext();

  const flipY = layout[1] > layout[3];
  if (flipY) {
    [minY, maxY] = [-maxY, -minY];
  }

  const dx = Math.abs(maxX - minX) / 2;
  const dy = Math.abs(maxY - minY) / 2;
  
  const zoom = Math.max(minLevel, Math.ceil(-Math.log2(Math.min(dx, dy) / 1)));
  const tile = Math.pow(2, zoom);

  const minIX = Math.floor((minX * .5 + .5) * tile);
  const minIY = Math.floor((minY * .5 + .5) * tile);

  const maxIX = Math.ceil((maxX * .5 + .5) * tile);
  const maxIY = Math.ceil((maxY * .5 + .5) * tile);
  
  const out: LiveElement[] = [];
  
  const w = maxIX - minIX;
  const h = maxIY - minIY;

  for (let x = minIX; x < maxIX; ++x) {
    for (let y = minIY; y < maxIY; ++y) {
      const key = (zoom << 20) + (y << 10) + x;
      out.push(keyed(Tile, key, {key, cache, x, y, zoom}));
    }
  }

  return out;  
};

const Tile: LiveComponent<TileProps> = memo((props) => {
  const {key, cache, x, y, zoom} = props;
  const {getMVT} = useTileContext();

  const url = getMVT(x, y, zoom);
  const run = useCallback(async () => cache.get(key) ?? fetch(url).then(res => res.arrayBuffer()).then(ab => {
    const mvt = new VectorTile(new Uint8Array(ab));
    cache.set(key, mvt);
    return mvt;
  }), [key]);

  const [mvt] = useAsync(run);
  return mvt ? use(MVTile, {...props, mvt}) : null;
}, 'MVTile');

