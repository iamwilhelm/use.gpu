import type { VirtualDraw } from '../primitives/virtual2';

import { makeContext, useContext, useNoContext } from '@use-gpu/live';

export type PassContextProps = (virtual: VirtualDraw) => RenderPassMode[] | null;

export const PassContext = makeContext<PassContextProps>(undefined, 'PassContext');

export const usePassContext = () => useContext<PassContextProps>(PassContext);
export const useNoPassContext = () => useNoContext(PassContext);
