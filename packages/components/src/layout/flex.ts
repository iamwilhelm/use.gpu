import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { Margin, Direction, Alignment, Anchor } from './types';

import { resume, yeet, memo, gather, useOne, useMemo } from '@use-gpu/live';
import { getFlexMinMax, fitFlex } from './lib/flex';
import { makeBoxLayout, normalizeAlignment, normalizeAnchor, normalizeGap } from './lib/util';

const NO_MARGIN = [0, 0, 0, 0] as Margin;

export type FlexProps = {
  direction?: Direction,

  gap?: number | Point,
  align?: Alignment | [Alignment, Alignment],
  anchor?: Anchor,

  wrap?: boolean,
  snap?: boolean,

  render?: () => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Flex: LiveComponent<BlockProps> = memo((fiber) => (props) => {
  const {
    direction = 'x',
    gap = 0,
    align = 'start',
    anchor = 'center',
    wrap = false,
    snap = true,
    render,
    children,
  } = props;

  const Resume = useOne(() =>
    makeResume(direction, gap, align, anchor, wrap, snap),
    [direction, gap, align, anchor, wrap, snap]
  );

  return gather(children ?? (render ? render() : null), Resume);
}, 'Flex');

const makeResume = (
  direction: Direction,
  g: number | Point,
  al: Alignment | [Alignment, Alignment],
  anchor: Anchor,
  wrap: boolean,
  snap: boolean,
) =>
  resume((fiber: LiveFiber<any>) => (els: LayoutElement[]) => {
    const gap    = normalizeGap(g);
    const align  = normalizeAlignment(al);
    const sizing = getFlexMinMax(els, direction, gap, wrap, snap);

    return yeet({
      key: fiber.id,
      sizing,
      margin: NO_MARGIN,
      fit: (into: Point) => {
        const {size, sizes, offsets, renders} = fitFlex(els, into, direction, gap, align[0], align[1], anchor, wrap, snap);
        return {
          size,
          render: makeBoxLayout(sizes, offsets, renders),
        };
      }
    });
  }, 'Flex');
