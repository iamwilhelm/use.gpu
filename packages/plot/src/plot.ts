import { LiveComponent, LiveElement } from '@use-gpu/live/types';

export type PlotProps = {
  children?: LiveElement<any>,
};

export const Plot: LiveComponent<PlotProps> = (props) => {
  return props.children ?? null;
};


