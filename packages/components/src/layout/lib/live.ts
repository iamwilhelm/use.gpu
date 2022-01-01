import { LiveFiber } from '@use-gpu/live/types';
import { LayoutGenerator, LayoutResolver, LayoutState } from '../types';

import { use, yeet, resume, provide, useContext } from '@use-gpu/live';
import { LayoutContext } from '../../providers/layout-provider';

const Outlet = () => (results: LayoutResult[]) => {
  const [left, top] = useContext(LayoutContext);
  const shift = ([l, t, r, b]: LayoutState) => [l + left, t + top, r + left, b + top];
  return results.map(({box, element, key}: LayoutResult) =>
    provide(LayoutContext, shift(box), element, key)
  );
}

export const makeResumeLayout = (
  resolve: LayoutResolver,
  name: string = 'Resolve',
) =>
  resume((fiber: LiveFiber<any>) => (ls: LayoutGenerator[]) => {
    const context = useContext(LayoutContext);
    const bound = resolve(context, ls);

    return yeet((layout: LayoutState): LayoutResult => {
      const {results, ...rest} = bound(layout);
      return {
        key: fiber.id,
        element: use(Outlet)(results),
        ...rest,
      };
    });
  }, name);
