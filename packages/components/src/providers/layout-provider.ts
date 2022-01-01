import {  makeContext } from '@use-gpu/live';

export type LayoutState = {
  left: number,
  top: number,
  right: number,
  bottom: number,
  width: number,
  height: number,
};

export const LayoutContext = makeContext(null, 'LayoutContext')

