import type { ReactNode } from 'react';
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

export type InspectExtension = (root: LiveFiber<any>) => InspectAddIns;

export type InspectAddIns = {
  props: InspectProps[],
  prop: InspectProp[],
};

export type InspectProps = {
  id: string,
  label: string,
  enabled: (fiber: LiveFiber<any>, fibers: Map<number, LiveFiber<any>>) => boolean,
  render: (fiber: LiveFiber<any>, fibers: Map<number, LiveFiber<any>>) => ReactNode,
};

export type InspectProp = {
  id: string,
  enabled: (prop: any) => boolean,
  render: (prop: any) => ReactNode,
};
