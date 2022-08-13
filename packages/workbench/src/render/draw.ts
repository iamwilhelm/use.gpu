import type { LC, PropsWithChildren, LiveElement } from '@use-gpu/live';

import { gather, fence, quote, yeet, useContext } from '@use-gpu/live';
import { PickingContext } from './picking';

export type DrawProps = object;

const NOP = () => {};

export const Draw: LC<DrawProps> = (props: PropsWithChildren<DrawProps>) => {
  const {children} = props;
  return fence(children, Resume);
};

const Resume = () => {
  const pickingContext = useContext(PickingContext);

  return quote(yeet(() => {
    if (pickingContext) pickingContext.captureTexture();
  }));
};
