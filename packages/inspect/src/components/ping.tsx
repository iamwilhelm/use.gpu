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

type PingEntry = [number, ArrowFunction[]];

// Track update pings to show highlights in tree
export const PingProvider: React.FC<PingProviderProps> = ({fiber, children}) => {
   const [map, versions, all, api] = useMemo(() => {
    const map = new Map<number, Set<ArrowFunction>>();
    const versions = new Map<number, number>();
    const all = new Set<ArrowFunction>();

    const api = {
      subscribe: (fiber: LiveFiber<any> | null | undefined, f: ArrowFunction) => {
        if (!fiber) return all.add(f);

        let s = map.get(fiber.id);
        if (!s) {
          map.set(fiber.id, s = new Set<ArrowFunction>());
        }
        s.add(f);
      },
      unsubscribe: (fiber: LiveFiber<any> | null | undefined, f: ArrowFunction) => {
        if (!fiber) return all.delete(f);

        let s = map.get(fiber.id);
        if (s) {
          s.delete(f);
          if (s.size === 0) map.delete(fiber.id);
        }
      },
    };
    return [map, versions, all, api];
  }, NO_DEPS);

  useLayoutEffect(() => {
    let timer: Timer | null = null;
    let reset: Timer | null = null;

    let queue: PingEntry[] = [];
    let hot: PingEntry[] = [];
    let version = 0;

    let timeout = () => {
      reset = null;
      flush();
    };

    let flush = () => {
      timer = null;

      const q = queue.slice();
      queue.length = 0;
      
      const seen = new Set<number>();

      for (const [id, active] of q) {
        seen.add(id);

        const v = versions.get(id);
        const s = map.get(id)!;
        if (!s) continue;

        const fs = s.values();        
        for (const f of fs) f(v, active);
      }
      for (const [id] of hot) if (!seen.has(id)) {
        const v = versions.get(id);
        const s = map.get(id)!;
        if (!s) continue;

        const fs = s.values();
        for (const f of fs) f(v, false);
      }
      
      for (const f of all) f(version, false);

      hot = q;
    };

    fiber.host.__ping = (fiber: LiveFiber<any>, active: boolean = true) => {
      version = incrementVersion(version);

      const v = versions.get(fiber.id);
      if (active) versions.set(fiber.id, v != null ? incrementVersion(v) : 0);

      queue.push([fiber.id, active]);

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
  const [version, setVersion] = useState<number>(-1);
  const [live, setLive] = useState<boolean>(false);

  const {subscribe, unsubscribe} = useContext(PingContext);
  useLayoutEffect(() => {
    const ping = (version: number, live: boolean) => {
      if (live) setVersion(version);
      setLive(live);
    };

    subscribe(fiber, ping);
    return () => unsubscribe(fiber, ping);
  }, [fiber]);

  return [version, live];
}

export const useForceUpdate = () => {
  const [version, setVersion] = useState<number>(0);
  const forceUpdate = useCallback(() => setVersion(incrementVersion));
  return [version, forceUpdate];
};
