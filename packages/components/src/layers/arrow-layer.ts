import { LiveComponent } from '@use-gpu/live/types';
import { memo, use } from '@use-gpu/live';
import { RawArrows } from '../primitives/raw-arrows';
import { RawLines } from '../primitives/raw-lines';

export const ArrowLayer: LiveComponent<RawLinesProps> = memo((props) => {
  return [
    use(RawLines, props),
    use(RawArrows, props),
  ];
}, 'ArrowLayer');
