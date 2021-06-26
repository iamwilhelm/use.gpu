import { LiveFunction, LiveElement } from '@use-gpu/live/types';
import { useMemo } from '@use-gpu/live';

export type Memoizable<T> = () => T;
export type Memoizer<T> = (f: Memoizable<T>) => LiveElement<any>;

export const Memo: LiveFunction<Memoizer<T>> = (fiber) => (f: Memoizable<T>, deps) => useMemo(fiber)(() => f(), deps);
