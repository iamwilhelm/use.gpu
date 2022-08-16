import type { LiveComponent, LiveElement } from '@use-gpu/live';

import { use, keyed, memo, useAsync, useCallback, useOne, useNoAsync } from '@use-gpu/live';
import { useLayoutContext } from '@use-gpu/workbench';
import { useRangeContext } from '@use-gpu/plot';

import { useTileContext } from './providers/tile-provider';
import { MVTile } from './mvtile';
import LRU from 'lru-cache';

import { VectorTile } from 'mapbox-vector-tile';

const getKey = (x: number, y: number, zoom: number) => (zoom << 20) + (y << 10) + (x << 0);

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
  const loaded = useOne(() => new Map<number, number>());

  useOne(() => console.log(loaded))

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

  for (let x = minIX; x < maxIX; x++) {
    const edgeX = x === minIX;
    const upX = (x === minIX || x === maxIX - 1) ? 1 : 2;

    for (let y = minIY; y < maxIY; y++) {
      const upY = (y === minIY || y === maxIY - 1) ? 1 : 2;
      const edgeY = y === minIY;
      
      const up = upX * upY;
      const key = getKey(x, y, zoom);

      out.push(keyed(Tile, key, {cache, loaded, x, y, zoom, up, edgeX, edgeY}));
    }
  }

  return out;  
};

const Tile: LiveComponent<TileProps> = memo((props) => {
  const {cache, loaded, x, y, zoom, up, edgeX, edgeY} = props;
  const {getMVT} = useTileContext();

  const key = getKey(x, y, zoom);
  const upKey = getKey(x >> 1, y >> 1, zoom - 1);

  const key1 = getKey(x & ~1, y & ~1, zoom);
  const key2 = key1 + 1;
  const key3 = key1 + (1<<10);
  const key4 = key1 + (1<<10) + 1;

  const run = useCallback(async () => cache.get(key) ?? fetch(getMVT(x, y, zoom)).then(res => res.arrayBuffer()).then(ab => {
    const mvt = new VectorTile(new Uint8Array(ab));
    cache.set(key, mvt);
    loaded.set(key, (loaded.get(key) || 0) + 1);
    return mvt;
  }), [key, {getMVT}]);

  let mvt: any;
  if (!cache.get(key)) {
    [mvt] = useAsync(run);
  }
  else {
    useNoAsync();
    mvt = cache.get(key);
  }
  
  if ((
    (loaded.get(key1)||0) +
    (loaded.get(key2)||0) +
    (loaded.get(key3)||0) +
    (loaded.get(key4)||0)
  ) < up) {
    if (loaded.get(upKey)) {
      if ((((x & 1) === 0) || edgeX) && (((y & 1) === 0) || edgeY)) {
        mvt = cache.get(upKey);
        return MVTile({x: x >> 1, y: y >> 1, zoom: zoom - 1, mvt});
      }
      else {
        mvt = null;
      }
    }
  }
  
  return mvt ? MVTile({...props, mvt}) : null;
}, 'MVTile');
