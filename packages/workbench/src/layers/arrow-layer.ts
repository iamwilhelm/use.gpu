import type { LiveComponent } from '@use-gpu/live';
import { memo, use } from '@use-gpu/live';

import { RawArrows, RawArrowsProps, RawArrowsFlags } from '../primitives/raw-arrows';
import { RawLines, RawLinesProps, RawLinesFlags } from '../primitives/raw-lines';

export type ArrowLayerProps = RawArrowsProps & RawLinesProps;
export type ArrowLayerFlags = RawArrowsFlags & RawLinesFlags;

/** Draws line segments with optional start/end arrow heads. */
export const ArrowLayer: LiveComponent<ArrowLayerProps> = memo((props: ArrowLayerProps) => {
  return [
    use(RawLines, props),
    use(RawArrows, props),
  ];
}, 'ArrowLayer');
