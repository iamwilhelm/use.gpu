import { Cursor, Pair, Update, UpdateKey } from './types';
import { $set } from './patch';

export type CursorEntry<T> = [Cursor<T> | null, CursorMap<T>];
export type CursorMap<T> = Map<string | symbol, CursorEntry<any>>;

const NO_ENTRY = [null, null];

/** Make a `Cursor<T>` from a `[value, updater]` pair.

- Also returns mutable `map` of cached cursors. This is filled in whenever `cursor.foo.…` is accessed.
- When creating a replacement cursor, pass `map` as `keep` to preserve child cursors for unchanged parts.
*/
export const makeCursor = <T>(
  pair: Pair<T>,
  defaults?: T,
  keep?: CursorMap<T> | null,
): [Cursor<T>, CursorMap<T>] => {
  const d = defaults as any;

  const fn = () => pair;
  const map: CursorMap<T> = new Map();

  const cursor = (
    new Proxy(fn, {
      get(target, prop, receiver) {
        const [cursor, keep] = map.get(prop) ?? NO_ENTRY;
        if (cursor) return cursor;

        const child = refinePair(pair, prop as any, d);
        const entry = makeCursor(child, d?.[prop], keep);

        map.set(prop, entry);
        return entry[0];
      },
    }) as Cursor<T>
  );

  if (keep) {
    if (pair[0]) for (const k of keep.keys()) {
      const [newValue] = refinePair(pair, k as any, d);

      const entry = keep.get(k)!;
      const [cursor, m] = entry;
      if (cursor) {
        const [oldValue] = cursor();
        if (oldValue === newValue) {
          map.set(k, entry);
          continue;
        }
      }
      if (newValue) map.set(k, [null, m]);
    }
  }

  return [cursor, map];
};

/**
Refine a getter/updater pair to traverse its `value` along `keys` and produce new cursors.

If `defaults` are supplied, the cursor will merge them in.
When the first update is made, it will dispatch a $set operation first
to permanently insert them, and allow a clean patch to be made.

The first part of the higher-order function can be called once and then reused for different paths.
*/
export const refinePair = <T, K extends keyof T>(
  pair: Pair<T>,
  key: K,
  defaults?: Record<K, any>,
): Pair<T[K]> => {
  let [value, updater] = pair;

  let d = defaults != null ? defaults[key]       : undefined;
  let v = value    != null ? (value as any)[key] : undefined;
  let u;

  // Fill in default
  if (v === undefined && d !== undefined) {
    let once = true;

    v = d;
    u = (update: any) => {
      if (once) updater({ [key]: $set(d) } as Update<T>);
      updater({ [key]: update } as Update<T>);
      once = false;
    };
  }
  // Existing value
  else {
    u = (update: any) => updater({ [key]: update } as Update<T>);
  }

  return [v, u];
};
