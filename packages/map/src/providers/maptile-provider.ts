import type { LC, PropsWithChildren } from '@use-gpu/live';
import { provide, useOne, useMemo } from '@use-gpu/live';
import { TileContext } from './tile-provider';

export type MapTileProviderProps = {
  url?: string,
};

const makeGetMVT = (template: string) => {
  const chunks = template.split(/{(x|y|zoom)}/g);
  return (x: number, y: number, zoom: number) => {
    const ts = {x, y, zoom} as Record<string, number>;
    const url = chunks.map((chunk, i) => i % 2 ? ts[chunk] : chunk).join('');
    console.log(url)
    return url;
  };
};

export const MapTileProvider: LC<MapTileProviderProps> = (props: PropsWithChildren<MapTileProviderProps>) => {
  const {
    url = `/tiles/{zoom}-{x}-{y}.mvt`,
    children,
  } = props;

  const context = useMemo(() => ({
    getMVT: makeGetMVT(url),
  }), [url]);

  return provide(TileContext, context, children);
};
