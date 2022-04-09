import { Atlas } from '@use-gpu/core/types';
import { memo, use, yeet, useContext, useFiber, useMemo } from '@use-gpu/live';
import { Surface } from './shape/surface';
import { CompositeData } from '../data';
import { Lines } from '../layers';
import { SDFFontContext, SDF_FONT_DEBUG } from '../providers/sdf-font-provider';

type DebugAtlasProps = {
  atlas: Atlas,
  version: number,
};

export const DebugAtlas = () => {
  const {atlas} = useContext(SDFFontContext);
  return use(DebugAtlasView, {
    atlas,
    version: atlas.version,
  });
};

export const DebugAtlasView: LiveComponent<DebugAtlasProps> = memo(({atlas}: DebugAtlasProps) => {
  const {map, width, height, debugPlacements, debugSlots, debugValidate} = atlas;  
  const {id} = useFiber();

  const out = [];
  const pos = [] as number[];

  for (const rect of debugPlacements()) {
    out.push(
      use(Surface, {
        layout: rect,
        fill: [Math.random() * .5, Math.random() * .5, Math.random(), 0.5],
        stroke: [1, 1, 1, 1],
        border: [1, 1, 1, 1],
      })
    );
  }

  for (const [l, t, r, b, sx, sy, corner] of debugSlots()) {
    out.push(
      use(Surface, {
        layout: [l + 4, t + 4, r - 4, b - 4],
        fill: [0, 0, 0.25, 0.25],
        stroke: [0, 0.45, 0.95, 1],
        border: [2, 2, 2, 2],
      })
    );
    out.push(
      use(Surface, {
        layout: [l + 8, t + 8, l + sx - 8, t + sy - 8],
        fill: [0, 0, 0, 0.5],
        stroke: [1, 0.5, 1, 1],
        border: [2, 2, 2, 2],
      })
    );
  }

  for (const anchor of debugValidate()) {
    const {x, y, dx, dy} = anchor;
    out.push(
      use(Surface, {
        layout: [x, y, x + dx, y + dy],
        fill: [1, 0, 0, 0.05],
        stroke: [1, 0, 0, 1],
        border: [5, 5, 5, 5],
      })
    );
  }

  for (const rect of debugPlacements()) {
    out.push(
      use(Surface, {
        layout: rect,
        fill: [0, 0, 0, 0],
        stroke: [1, 1, 1, 1],
        border: [1, 1, 1, 1],
      })
    );
  }

  out.push(
    yeet({
      id,
      rectangle: [width, 0, 500 + width, 500],
      uv: [0, 0, 1, 1],
      radius: [0, 0, 0, 0],
      texture: SDF_FONT_DEBUG,
      fill: [0, 0, 0, 1],
      count: 1,
      repeat: 0,
    })
  );
  
  return out;
}, 'DebugAtlasView');
