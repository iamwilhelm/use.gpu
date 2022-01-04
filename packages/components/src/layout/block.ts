import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { Margin } from './types';

import { memo, gather, resume, yeet, useOne } from '@use-gpu/live';
import { getBlockMinMax, getBlockMargin, fitBlocks } from './lib/block';
import { normalizeMargin, makeBoxLayout } from './lib/util';

export type BlockProps = {
  direction?: 'x' | 'y',
  grow?: number,
  shrink?: number,
  margin?: number | [number, number, number, number],
  render?: () => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Block: LiveComponent<BlockProps> = memo((props) => {
  const {
    direction = 'y',
    grow = 0,
    shrink = 0,
    margin: m = 0,
    render,
    children,
  } = props;

  const margin = normalizeMargin(m);

  const Resume = useOne(() =>
    makeResume(direction, grow, shrink, margin),
    [direction, grow, shrink]
  );

  return gather(children ?? (render ? render() : null), Resume);
}, 'Block');

const makeResume = (
  direction: 'x' | 'y',
  grow: number,
  shrink: number,
  m: Margin,
) =>
  resume((els: LayoutElement[]) => {
    const sizing = getBlockMinMax(els, direction);
    const margin = getBlockMargin(els, m, direction);

    return yeet({
      sizing,
      margin,
      grow,
      shrink,
      fit: (into: Point) => {
        const {size, sizes, offsets, renders} = fitBlocks(els, into, direction);
        return {
          size,
          render: makeBoxLayout(sizes, offsets, renders),
        };
      }
    });
  });
