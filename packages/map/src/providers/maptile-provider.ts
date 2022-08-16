import type { LC, PropsWithChildren } from '@use-gpu/live';
import { provide, useOne, useMemo } from '@use-gpu/live';
import { TileContext } from './tile-provider';

export type MapTileProviderProps = {
  url?: string,
};

const makeMVTSource = (template) => {
  const tokens = template.matchAll(/:(x|y|zoom)/g);
  const chunks = template.split(/:(?:x|y|zoom)/g);
  const order = Array.from(tokens).map(t => t[1].slice(0, 1));
  return (x, y, zoom) => {
    const ts = {x, y, z: zoom};
    return chunks.map((chunk, i) => chunk + (order[i] ? ts[order[i]] : '')).join('');
  };
};

export const MapTileProvider: LC<MapTileProviderProps> = (props: PropsWithChildren<MapTileProviderProps>) => {
  const {
    url = `/tiles/:zoom-:x-:y.mvt`,
    children,
  } = props;
  
  const context = useMemo(() => ({
    getMVT: makeMVTSource(url),
  }), [url]);

  return provide(TileContext, context, children);
};
