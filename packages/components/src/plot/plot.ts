import { LiveComponent, LiveElement } from '@use-gpu/live/types';
// import { use, provide, makeContext, useContext, useOne, useMemo } from '@use-gpu/live';

export type PlotProps = {
  children?: LiveElement<any>,
};

export const Plot: LiveComponent<PlotProps> = (props) => {
  return props.children;
};


