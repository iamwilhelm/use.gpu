import { LiveComponent } from '@use-gpu/live/types';
import { memo, use } from '@use-gpu/live';

import { RawArrows, RawArrowsProps } from '../primitives/raw-arrows';
import { RawLines, RawLinesProps } from '../primitives/raw-lines';

type ArrowLayerProps = RawArrowsProps & RawLinesProps;

export const ArrowLayer: LiveComponent<ArrowLayerProps> = memo((props: ArrowLayerProps) => {
  return [
    use(RawLines, props),
    use(RawArrows, props),
  ];
}, 'ArrowLayer');
