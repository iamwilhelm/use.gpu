import type { LC, PropsWithChildren, LiveElement } from '@use-gpu/live';

import { gather, fence, signal, useContext, useOne } from '@use-gpu/live';
import { PickingContext } from './picking';

export type DrawProps = object;

/** Draw bundler. Does nothing atm, only serves as a marker. */
export const Draw: LC<DrawProps> = (props: PropsWithChildren<DrawProps>) => {
  const {children} = props;
  return children;
};
