import type { LiveFiber } from '@use-gpu/live';

export type ExpandState = Record<number, boolean>;
export type PingState = Record<number, number>;
export type SelectState = LiveFiber<any> | null;
export type HoverState = {
  fiber: LiveFiber<any> | null,
  root: LiveFiber<any> | null,
  deps: LiveFiber<any>[],
  precs: LiveFiber<any>[],
  by: LiveFiber<any> | null,
  depth: number,
};
export type OptionState = {
  depth: number,
  counts: boolean,
  builtins: boolean,
  fullSize: boolean,
  highlight: boolean,
  inspect: boolean,
};

export type Action = () => void;
