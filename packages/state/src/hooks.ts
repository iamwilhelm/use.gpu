import type { Cursor, Pair, Initial, Update, UseCallback, UseMemo, UseRef, UseState } from './types';
import { patch } from './patch';
import { makeCursor, CursorMap } from './cursor';

/**
Make a cursor from a getter/updater pair.

- Traverse `cursor.foo.bar` to get a new cursor.
- Call `cursor.foo.bar()` to get a new getter/updater pair.

If `defaults` are supplied, the cursor will merge them in.
When the first update is made, it will dispatch a `$set` operation first
to permanently insert them, and allow a clean patch to be made.
*/
export const makeUseCursor = (
  useMemo: UseMemo,
  useRef: UseRef,
) => <T>(
  pair: Pair<T>,
  defaults?: T
): Cursor<T> => {
  // Keep map of prop -> cursor from last cursor
  const keepRef = useRef<CursorMap<T> | null>(null);

  // Refresh cursor if any component changed
  // (but re-use keepRef cursors if unchanged)
  const [cursor, map] = useMemo(() => makeCursor(pair, defaults, keepRef.current), [pair[0], pair[1], defaults]);
  keepRef.current = map;

  return cursor;
};

/**
`useState` variant which has an `updateValue` instead of a `setValue` and does automatic patching of updates.

When combined with `${useCursor}`, this allows for zero-hassle state management.

Compose this hook with other `useState` variants using `useStateHook`, e.g. the classic `useLocalState` that saves to Local Storage.
*/
export const makeUseUpdateState = (
  useCallback: UseCallback,
  useMemo: UseMemo,
  useState: UseState,
) => <T>(
  initialState: Initial<T>,
  useStateHook: UseState = useState,
): Pair<T> => {
  const [state, setState] = useStateHook(initialState);

  const updateState = useCallback((update: Update<T>) =>
    setState((s: T) => patch(s, update)),
    []);

  // eslint-disable-next-line
  return useMemo(() => [state, updateState] as Pair<T>, [state]);
};
