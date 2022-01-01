import {  makeContext } from '@use-gpu/live';

export type LayoutState = [number, number, number, number];

export const LayoutContext = makeContext(null, 'LayoutContext')

