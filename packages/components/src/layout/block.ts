import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { memo, use, yeet, provide, resume, gather, useContext, useMemo } from '@use-gpu/live';
import { LayoutContext } from '../providers/layout-provider';
import { parseDimension } from './util';

export type BlockProps = {
  direction?: 'x' | 'y',
  render?: () => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Block: LiveComponent<BlockProps> = memo((fiber) => (props) => {
  const {
    direction = 'y',
    render,
    children,
  } = props;
  return gather(children ?? (render ? render() : null), Directions[direction]);
}, 'Block');

const Outlet = () => (results: LayoutResult[]) => {
  const [left, top] = useContext(LayoutContext);
  const shift = ([l, t, r, b]: LayoutState) => [l + left, t + top, r + left, b + top];
  return results.map(({box, element, key}: LayoutResult) =>
    provide(LayoutContext, shift(box), element, key)
  );
}

const makeResume = (direction: 'x' | 'y') => 
  resume((fiber: LiveFiber<any>) => (ls: LayoutHandler[]) => {
    const [l, t, r, b] = useContext(LayoutContext);

    const block = [0, 0, r - l, b - t] as LayoutState;
    const results = [] as LayoutResult[];

    for (let l of ls) {
      const result = l(block);
      const {box} = result;

      if (direction === 'x') block[0] = box[2];
      if (direction === 'y') block[1] = box[3];

      results.push(result);
    }

    const w = (direction === 'x') ? block[0] : block[2];
    const h = (direction === 'y') ? block[1] : block[3];

    return yeet(([l, t]: LayoutState) => ({
      key: fiber.id,
      box: [l, t, l + w, t + h],
      element: use(Outlet)(results),
    }));
  }, 'Block');

const Directions ={
  'x': makeResume('x'),
  'y': makeResume('y'),
};
