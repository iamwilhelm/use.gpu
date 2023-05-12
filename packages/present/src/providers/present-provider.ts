import { provide, makeContext, useContext, useNoContext, useFiber, useOne, useRef } from '@use-gpu/live';

export type PresentAPI = {
  goTo: (x: number) => void,
  goForward: () => void,
  goBack: () => void,
  isVisible: (id: number) => boolean,
  getVisibleState: (id: number) => number,
  useTransition: (id: number) => number,
};

export type PresentContextProps = {
  state: {step: number, length: number},

  goTo: (x: number) => void,
  goForward: () => void,
  goBack: () => void,
  isVisible: (id: number) => boolean,
  getVisibleState: (id: number) => number,
  useTransition: (id: number) => number,
};

export const PresentContext = makeContext<PresentContextProps>({
  step: 0,
  length: 0,
  isVisible: () => true,
}, 'PresentContext');

export const usePresentContext = () => useContext<PresentContextProps>(PresentContext);
export const useNoPresentContext = () => useNoContext(PresentContext);
