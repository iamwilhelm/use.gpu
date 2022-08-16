import type { LiveComponent, LiveElement } from '@use-gpu/live';

import { use, keyed } from '@use-gpu/live';
import { useLayoutContext } from '@use-gpu/workbench';
import { useRangeContext } from '@use-gpu/plot';
import { MVTile } from './mvtile';

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
  console.log(w * h);
  if (w * h > 50) debugger;
  
  for (let x = minIX; x < maxIX; ++x) {
    for (let y = minIY; y < maxIY; ++y) {
      out.push(keyed(MVTile, (zoom << 20) + (y << 10) + x, {x, y, zoom}));
    }
  }
  
  return out.slice(0, 16);
};


