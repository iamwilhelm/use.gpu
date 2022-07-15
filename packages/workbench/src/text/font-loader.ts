import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { Font } from '@use-gpu/glyph/types';
import { FontSource } from './types';

import { use, gather, keyed, yeet, useOne } from '@use-gpu/live';
import { toHash } from '@use-gpu/state';
import { Fetch } from '../data';
import { FontProvider } from './providers/font-provider';

export type FontLoaderProps = {
  fonts: FontSource[],
  children: LiveElement<any>,
};

export const FontLoader: LiveComponent<FontLoaderProps> = ({fonts, children}) => {

  const resources = useOne(() => fonts.map((source: FontSource) =>
    keyed(Fetch, toHash(source), {
      url: source.src,
      type: 'arrayBuffer',
      render: (buffer: ArrayBuffer) => yeet({props: source, buffer}),
    })
  ), fonts);

  return gather(resources, (fonts: Font[]) =>
    use(FontProvider, { fonts, children })
  );
};
