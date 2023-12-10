import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import { use } from '@use-gpu/live';
import { VirtualLayers } from '@use-gpu/workbench';

export type PlotProps = PropsWithChildren<object>;

export const Plot: LiveComponent<PlotProps> = (props) => {
  const {children} = props;
  return children ? use(VirtualLayers, { children }) : null;
};


