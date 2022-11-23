import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { Font } from '@use-gpu/glyph';

import { use, gather, keyed, yeet, useOne } from '@use-gpu/live';
import { toHash } from '@use-gpu/state';
import { parseWeight } from '@use-gpu/traits';
import { Fetch } from '../data';
import { FontProvider } from './providers/font-provider';

export type FontSource = {
  family: string,
  weight: string | number,
  style: string,
  src: string,
};

export type FontLoaderProps = {
  fonts?: FontSource[],
  children: LiveElement,
};

const NO_FONTS: FontSource[] = [];

export const FontLoader: LiveComponent<FontLoaderProps> = ({fonts = NO_FONTS, children}) => {

  const resources = useOne(() => fonts
    .filter((s: FontSource) => !!s.src)
    .map((source: FontSource) =>
      keyed(Fetch, toHash(source), {
        url: source.src,
        type: 'arrayBuffer',
        render: (buffer: ArrayBuffer) => yeet({props: {
          ...source,
          weight: parseWeight(source.weight),
        }, buffer}),
      })
    ),
    fonts);

  return gather(resources, (fonts: Font[]) => {
    return use(FontProvider, { fonts, children })
  });
};
