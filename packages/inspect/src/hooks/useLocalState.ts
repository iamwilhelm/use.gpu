import { useCallback, useState } from 'react';

export const makeUseLocalState = (key: string) => <T,>(initial: T | (() => T)) => {
  const [state, setState] = useState(() => {
    const item = window.localStorage.getItem(key);
    if (item) try {
      return JSON.parse(item);
    } catch (e) {};
    
    return typeof initial === 'function' ? initial() : initial;
  });

  const [lastKey, setLastKey] = useState(key);
  if (lastKey !== key) {
    setLastKey(key);
    setState(initial);
  }
  
  const setLocalState = useCallback((value: SetStateAction<T>) => {
    setState(state => {
      state = typeof value === 'function' ? value(state) : value;
      try { window.localStorage.setItem(key, JSON.stringify(state)); } catch (e) {};
      return state;
    });
  }, []);
  
  return [state, setLocalState];
};
