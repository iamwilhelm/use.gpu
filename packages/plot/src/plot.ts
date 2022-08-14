import type { LiveComponent, LiveElement } from '@use-gpu/live';

export type PlotProps = {
  children?: LiveElement,
};

export const Plot: LiveComponent<PlotProps> = (props) => {
  return props.children ?? null;
};


