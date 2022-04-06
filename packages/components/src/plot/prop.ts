import { useOne } from '@use-gpu/live';

export const useOptional = <T>(value: T, parse: (t?: T) => T): T => useOne(() => value && parse(value), value);
export const useRequired = <T>(value: T, parse: (t?: T) => T): T => useOne(() => parse(value), value);
