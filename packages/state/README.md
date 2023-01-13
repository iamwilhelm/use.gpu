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
- JS-value patching, diffing, reversing
- JS-value hashing

(not Live / React-specific)

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

To do a lookup `state.foo.size`, you refine the cursor:

```tsx
const [size, updateSize] = refineCursor(cursor)('foo', 'size');
```

When you call `updateSize(5)`, this is equivalent to `updateState({foo: {size: 5}})`.

This works as expected, because `useUpdateState` will merge this change into the original state. The argument to `updateState` is an `@{Update}`, which is like merging on steroids.

The merging behavior of an `@{Update}` can be precisely controlled, at the individual field level.

### Defaults

`refineCursor` can accept defaults as a 2nd argument. When it traverses the original value, if it encounters a missing field, it will fill in the one from the default.

When it then applies an update, it will first patch in the defaults, and then make a change. This ensures clean partial patches of missing nested fields.

### Hook

There is a `useRefineCursor` hook which is memoized and allows for repeated lookups into the same state:

```tsx
const useStateCursor = useRefineCursor(cursor);
const [size, updateSize] = useStateCursor('foo', 'size');
const [title, updateTitle] = useStateCursor('foo', 'title');
```

## Patching

`@{patch}` will apply an `update` to deeply nested state, by returning a new immutable object, without modifying the original.

```tsx
const value  = {hello: 'text', value: 2};
const update = {hello: 'world'};

expect(patch(value, update)).toEqual({hello: 'world', value: 2});
```

The default behavior is:
- Merge object properties from `update` into `value` recursively.
- Treat arrays as values, do not recurse, only replace them as a whole.

To adjust the behavior, e.g. to replace an object instead of merging it, use the included `$op` helpers:

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
const $push = <T>(item: T) => $apply((list: T[]) => [...list, item]);
  
updateList($push(item));
```

## Diff 

`@{diff}` is a complement to `@{patch}`.

Given two values `A` and `B`, it will return an `update` so that:

```tsx
const update = diff(A, B);
expect(patch(A, update)).toEqual(B);
```

...equals the value B (though not the same objects as B).

## Revise

`@{revise}` is the upside-down complement to `@{patch}`.

Given a value `A`, and an `update`, it will **patch the `update`** so that:

```tsx
const B = patch(A, update);
const revised = revise(A, update);
expect(patch(B, revised)).toEqual(A);
```

...applying the `revised` update will reverse the original `update`.

This can be used to build an automatic undo/redo system that works with any `$op`.

Use `@{getUpdateKeys}` to check whether a revised update is actually effectful or consists solely of `$nop`.

## Hashing

- `@{toHash}` will hash any JS value to a 10-digit base 64 string.
- `@{toMurmur53}` will hash any JS value to a 53-bit `number`.

## Keys

- `@{getObjectKey}` assigns a unique, incrementing 53-bit ID to each unique object (uses a `WeakMap`).
- `@{makeKey}` returns a new unique ID from the same set.

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.
