import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { memo, gather, useOne, useMemo } from '@use-gpu/live';

import { makeFlexLayout } from './lib/flex';
import { makeResumeLayout } from './lib/live';

export type FlexProps = {
  direction?: 'x' | 'y',
  align?: 'start' | 'center' | 'end' | 'justify',
  justify?: 'start' | 'center' | 'end' | 'justify',
  wrap?: boolean,

  render?: () => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Flex: LiveComponent<BlockProps> = memo((fiber) => (props) => {
  const {
    direction = 'x',
    alignX = 'start',
    alignY = 'start',
    wrap = false,
    render,
    children,
  } = props;

  const resolve = useMemo(() =>
    makeFlexLayout(direction, alignX, alignY, wrap),
    [direction, alignX, alignY, wrap]
  );

  const Resume = useOne(() =>
    makeResumeLayout(resolve, 'Flex'),
    resolve,
  );

  return gather(children ?? (render ? render() : null), Resume);
}, 'Flex');
