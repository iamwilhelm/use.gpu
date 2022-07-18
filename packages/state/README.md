# @use-gpu/state

```sh
npm install --save @use-gpu/state
```

```sh
yarn add @use-gpu/state
```

**Docs**: https://usegpu.live/docs/reference-live-@use-gpu-state

# Live - State management helpers

Helper library with:
- Cursor-based state
- JS-value patching
- JS-value hashing

(not Live / React-specific).

## Cursors

Most UI state is simple, and consists of straight forward "set foo to bar" type actions. When this state lives inside an existing object, this requires a fair amount of boilerplate:

```tsx
const [state, setState] = useState({
  foo: {
    // ...
    size: 5,
  },
  // ...
});

const {foo: {size}} = state;
const setSize = (size: number) => {
  setState((state) => {
    ...state,
    foo: {
      ...state.foo,
      size,
    },
  })
};
```

Cursors solve this problem by always pairing a value with a setter for it. This means you don't unpack the `[state, setState]` pair, but treat it as a value:

```tsx
import { useUpdateState } from '@use-gpu/state';

// Create state, get cursor
const cursor = useUpdateState({...});
const [state, updateState] = cursor;
```

To do a lookup `state.foo.bar`, you refine the cursor:

```tsx
const [size, updateSize] = refineCursor(cursor)('foo', 'size');
```

When you call `updateSize(5)`, this is equivalent to `updateState({foo: {size: 5}})`.

This works as expected, because `useUpdateState` will apply this change to the original state.

The argument to `updateState` is an `@{Update}`, which is like merging on steroids.

The merging behavior of an `@{Update}` can be precisely controlled, at the individual field level.


## Patching

`@{patch}` will apply an update to deeply nested state, by returning a new immutable object, without modifying the original.

```tsx
const value  = {hello: 'text', value: 2};
const update = {hello: 'world'};

expect(patch(value, update)).toEqual({hello: 'world', value: 2});
```

The default behavior is:
- Merge object properties from `update` into `value` recursively.
- Treat arrays as values, do not recurse, only replace them as a whole.

To adjust the behavior, e.g. to replace an object instead of merging it, use the included `$ops` helpers:

- `@{$apply}`
- `@{$delete}`
- `@{$merge}`
- `@{$nop}`
- `@{$patch}`
- `@{$set}`

e.g.

```tsx
const value  = {hello: {title: 'text', href: '#'}, value: 2};
const update = {hello: $set({title: 'world'});

expect(patch(values, update)).toEqual({ hello: { title: 'world' }, value: 2});
```

### Custom $ops

You can use `$apply` to make custom patching ops, e.g. to append an item to a list:

```tsx
const $append = <T>(item: T) => $apply((list: T) => [...list, item]);
  
updateList($append(item));
```

## Hashing

- `@{toHash}` will hash any JS value to a 10-digit base 64 string.
- `@{toMurmur53}` will hashed any JS value to a 53-bit `number`.

## Keys

- `@{getObjectKey}` assigns a unique, incrementing 53-bit ID to each unique object (uses a `WeakMap`).
- `@{makeKey}` return a new unique ID from the same set.

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.
