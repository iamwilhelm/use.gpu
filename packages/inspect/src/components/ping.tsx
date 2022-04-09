import { LiveFiber, ArrowFunction } from '@use-gpu/live/types';
import { incrementVersion } from '@use-gpu/live';

import React, { memo, createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';

const PingContext = createContext<PingContextProps>({
  set: () => {},
  unset: () => {},
});

const NO_DEPS: any[] = [];

type PingContextProps = {
  subscribe: (fiber: LiveFiber<any>, f: ArrowFunction) => void,
  unsubscribe: (fiber: LiveFiber<any>) => void,
};

type PingProviderProps = {
  fiber: LiveFiber<any>,
  children?: React.ReactElement<any>,
};

type Timer = ReturnType<typeof setTimeout>;

// Track update pings to show highlights in tree
export const PingProvider: React.FC<PingProviderProps> = ({fiber, children}) => {
   const [map, api] = useMemo(() => {
    const map = new Map<number, Set<ArrowFunction>>();
    const api = {
      subscribe: (fiber: LiveFiber<any>, f: ArrowFunction) => {
        let s = map.get(fiber.id);
        if (!s) {
          map.set(fiber.id, s = new Set<ArrowFunction>());
        }
        s.add(f);
      },
      unsubscribe: (fiber: LiveFiber<any>, f: ArrowFunction) => {
        let s = map.get(fiber.id);
        if (s) {
          s.delete(f);
          if (s.size === 0) map.delete(fiber.id);
        }
      },
    };
    return [map, api];
  }, NO_DEPS);

  useLayoutEffect(() => {
    let timer: Timer | null = null;
    let reset: Timer | null = null;

    let queue: ArrowFunction[] = [];
		let hot: Set<ArrowFunction> = new Set();

		let timeout = () => {
      reset = null;
			flush();
		};

    let flush = () => {
      timer = null;

			const removed = new Set<ArrowFunction>();
      const q = new Set(queue);
      queue.length = 0;

			for (let f of hot.values()) if (!q.has(f)) removed.add(f);
			hot = q;

      for (let f of q) f(true);
      for (let f of removed) f(false);
    };

    fiber.host.__ping = (fiber: LiveFiber<any>) => {
      const s = map.get(fiber.id);
      if (s) queue.push(...s.values());
      if (!timer) {
				timer = setTimeout(flush, 0);

				if (reset) clearTimeout(reset);
				reset = setTimeout(timeout, 100);
			}
    };
    return () => {
      if (fiber.host) fiber.host.__ping = () => {};
      if (timer) clearTimeout(timer);
    };
  }, NO_DEPS);

   return (
    <PingContext.Provider value={api}>
      {children}
    </PingContext.Provider>
  );
}

export const usePingContext = (fiber: LiveFiber<any>) => {
  const [live, setLive] = useState<boolean>(false);
	const [version, forceUpdate] = useForceUpdate();

  const {subscribe, unsubscribe} = useContext(PingContext);
  useLayoutEffect(() => {
		const ping = (live: boolean) => {
			setLive(live);
			forceUpdate();
		};

    subscribe(fiber, ping);
    return () => unsubscribe(fiber, ping);
  }, NO_DEPS);

  return [version, live];
}

export const useForceUpdate = () => {
  const [version, setVersion] = useState<number>(0);
  const forceUpdate = useCallback(() => setVersion(incrementVersion));
  return [version, forceUpdate];
};
