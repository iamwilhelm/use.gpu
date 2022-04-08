import { useOne } from '@use-gpu/live';

export const useOptional = <T>(value: T, parse: (t?: T) => T, def: T | null = null): T | null => useOne(() => value != null ? parse(value) : def, value);
export const useProp     = <T>(value: T, parse: (t?: T) => T): T => useOne(() => parse(value), value);
