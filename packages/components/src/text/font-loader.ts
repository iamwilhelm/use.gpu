import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { Font } from '@use-gpu/text/types';
import { FontSource } from './types';

import { use, gather, keyed, yeet, useOne } from '@use-gpu/live';
import { getHash } from '@use-gpu/state';
import { Fetch } from '../data';
import { FontProvider } from './providers/font-provider';

export type FontLoaderProps = {
  fonts: FontSource[],
  children: LiveElement<any>,
};

export const FontLoader: LiveComponent<FontLoaderProps> = ({fonts, children}) => {

  const resources = useOne(() => fonts.map((source: FontSource) =>
    keyed(Fetch, getHash(source), {
      slow: 50000,
      url: source.src,
      type: 'buffer',
      render: (buffer: ArrayBuffer) => yeet({props: source, buffer}),
    })
  ), fonts);

  return gather(resources, (fonts: Font[]) =>
    use(FontProvider, { fonts, children })
  );
};
