import { Key } from '@use-gpu/live/types';
import { LayoutState } from '../providers/layout-provider';

export type LayoutHandler = (layout: LayoutState) => LayoutResult;
export type LayoutResult = {
  key: Key,
  box: LayoutState,
  element: LiveElement<any>,
};
