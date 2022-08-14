import type { LC, PropsWithChildren, LiveElement } from '@use-gpu/live';

import { gather, fence, quote, yeet, useContext, useOne } from '@use-gpu/live';
import { PickingContext } from './picking';

export type DrawProps = object;

export const Draw: LC<DrawProps> = (props: PropsWithChildren<DrawProps>) => {
  const {children} = props;
  return children;
};
