import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { memo, gather, useOne, useMemo } from '@use-gpu/live';

import { makeBlockLayout } from './lib/block';
import { makeResumeLayout } from './lib/live';

export type BlockProps = {
  direction?: 'x' | 'y',
  flex?: number,
  render?: () => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Block: LiveComponent<BlockProps> = memo((fiber) => (props) => {
  const {
    direction = 'y',
    flex = 0,
    render,
    children,
  } = props;

  const resolve = useMemo(() =>
    makeBlockLayout(direction, flex),
    [direction, flex]
  );

  const Resume = useOne(() =>
    makeResumeLayout(resolve, 'Block'),
    resolve,
  );

  return gather(children ?? (render ? render() : null), Resume);
}, 'Block');
