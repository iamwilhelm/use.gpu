import { LiveFiber } from '@use-gpu/live/types';
import { makeContext, useContext, useFiber, useNoContext } from '@use-gpu/live';

type FrameContextProps = {
  current: number,
  request?: (fiber?: LiveFiber<any>) => void,
};

export const FrameContext = makeContext<FrameContextProps>({
  current: 0,
  request: () => {},
}, 'FrameContext');

export const usePerFrame   = () => useContext(FrameContext);
export const useNoPerFrame = () => useNoContext(FrameContext);

export const useAnimationFrame   = () => useContext(FrameContext).request(useFiber());
export const useNoAnimationFrame = () => useNoContext(FrameContext);
