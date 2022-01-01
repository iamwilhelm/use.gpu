import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { use, useContext, useOne } from '@use-gpu/live';
import { LayoutContext } from '../providers/layout-provider';

import { Rectangles } from '../layers';

export type SurfaceProps = {
  color?: number[],
};

export const Surface: LiveComponent<SurfaceProps> = (fiber) => (props) => {
  const {color} = props;
  const layout = useContext(LayoutContext);

  const rectangle = useOne(() => {
    const {left, top, right, bottom} = layout;
    return [left, top, right, bottom];
  }, layout);

  return use(Rectangles)({
    rectangle,
    color,
  });
};
