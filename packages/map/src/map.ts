import type { LiveComponent, LiveElement } from '@use-gpu/live';

export type MapProps = {
  children?: LiveElement,
};

export const Map: LiveComponent<MapProps> = (props) => {
  return props.children ?? null;
};


