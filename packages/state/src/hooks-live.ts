import { useCallback, useMemo, useRef, useState } from '@use-gpu/live';
import { makeUseCursor, makeUseUpdateState } from './hooks';

export * from './types';

export const useCursor = makeUseCursor(useMemo, useRef);
export const useUpdateState = makeUseUpdateState(useCallback, useMemo, useState);
