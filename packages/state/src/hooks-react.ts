import { useCallback, useMemo, useRef, useState } from 'react';
import { makeUseCursor, makeUseUpdateState } from './hooks';

import { Pair, Cursor, Initial, UseState } from './types';
export * from './types';

type UseCursor<T> = <T>(
  pair: Pair<T>,
  defaults?: T
) => Cursor<T>;

type UseUpdateState<T> = <T>(
  initialState: Initial<T>,
  useStateHook?: UseState,
) => Pair<T>;

/**
Make a cursor from a getter/updater pair.

- Traverse `cursor.foo.bar` to get a new cursor.
- Call `cursor.foo.bar()` to get a new getter/updater pair.

If `defaults` are supplied, the cursor will merge them in.
When the first update is made, it will dispatch a `$set` operation first
to permanently insert them, and allow a clean patch to be made.
*/
export const useCursor: UseCursor<unknown> = makeUseCursor(useMemo, useRef);

/**
`useState` variant which has an `updateState` instead of a `setState` and does automatic patching of updates.

When combined with `${useCursor}`, this allows for zero-hassle state management.

Compose this hook with other `useState` variants using `useStateHook`, e.g. the classic `useLocalStorage` that saves to browser local storage.
*/
export const useUpdateState: UseUpdateState<unknown> = makeUseUpdateState(useCallback, useMemo, useState);
