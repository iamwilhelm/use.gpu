import { makeContext, useContext } from '@use-gpu/live';

type Rectangle = [number, number, number, number];
type LayoutProps = {
  layout: Rectangle,
  flipY: boolean,
};

export const LayoutContext = makeContext<LayoutProps>(undefined, 'LayoutContext');

export const useLayoutContext = () => useContext(LayoutContext);