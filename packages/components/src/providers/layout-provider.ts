import { makeContext } from '@use-gpu/live';

type Rectangle = [number, number, number, number];

export const LayoutContext = makeContext<Rectangle>(undefined, 'LayoutContext');
