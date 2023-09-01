# @use-gpu/state

```sh
npm install --save @use-gpu/state
```

```sh
yarn add @use-gpu/state
```

**Docs**: https://usegpu.live/docs/reference-live-@use-gpu-state

# Live - State management helpers

Helper library for doing `patch` and `diff`-based state management. Can be used to drive undo/redo. Includes cursor hooks for React/Live.

```tsx
import { patch, diff } from '@use-gpu/state';
```

- JS-value patching, diffing, reversing
- JS-value hashing
- Cursor-based state

```tsx
// React
import { useUpdateState, useCursor } from '@use-gpu/state/react';
```

```tsx
// Live
import { useUpdateState, useCursor } from '@use-gpu/state/live';
```

## Patching

`@{patch}` will apply an `update` to a nested object, without modifying the original.

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

const newList = patch(list, $push(item));
```

This can be used anywhere in a patch:

```tsx
const newState = patch(state, {
  nested: {
    list: $push('hello'),
  }
});
```

## Diff 

`@{diff}` is the complement to `@{patch}`.

Given two values `A` and `B`, it will return an `update` so that:

```tsx
const update = diff(A, B);
expect(patch(A, update)).toEqual(B);
```

...patching A with it equals the value B (though not the same object(s) as B).

Note that diff may contain empty updates such as `{ }` if an object was cloned. Use `@{getUpdateKeys}` to check whether an update contains real changes.

If you `diff(A, B)` after a `patch(A, ...)`, you get a pure update, without `$apply` or `$patch`. This can be serialized to JSON.

## Revise

To reverse an update, you can `diff(B, A)`:

```tsx
const B = patch(A, update);
const reversed = diff(B, A);

expect(patch(B, reversed)).toEqual(A);
```

To optimize and formalize this, `@{revise}` is (almost) the same operation.

It is a reverse complement to `@{patch}`. Given a value `A`, and an `update`, it will **patch the `update`** so that:

```tsx
// Don't need B to reverse
const reversed = revise(A, update);

const B = patch(A, update);
expect(patch(B, reversed)).toEqual(A);
```

...applying the `reversed` update will reverse the original `update` along the exact same boundaries.

This can be used to build an automatic undo/redo system that works with any `$op`.

Use `@{getUpdateKeys}` to check whether a revised update is actually effectful or consists solely of `$nop`.


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

You can simplify this by relying on `patch(…)` to do all your mutating. Instead of a `setState(…)`, you now have an `updateState(…)`:

```tsx
import { useCursor, useUpdateState } from '@use-gpu/state/react';

// Create state pair, get cursor
const [state, updateState] = useUpdateState({...});
const stateCursor = useCursor([state, updateState]);

// More compact form
const stateCursor = useCursor(useUpdateState({...}));
```

Cursors can be traversed just like the original value:

```tsx
const sizeCursor = stateCursor.foo.size;
```

To extract a getter/updater pair, call it:

```tsx
const [size, updateSize] = sizeCursor();
```

This can be written as `stateCursor.foo.size()`.

When you call `updateSize(5)`, this is equivalent to `updateState({foo: {size: 5}})`. The updater callbacks are auto-generated and all call the same central `useUpdateState`.

This works as expected, because `useUpdateState` will merge this change into the original state. The argument to `updateState` is an `@{Update}`, i.e. the argument to `patch`.

The merging behavior of an `@{Update}` can be precisely controlled, at the individual field level.

Cursors are also available in non-hook form via `@{makeCursor}`.

### Defaults

```tsx
const DEFAULTS = {
  foo: { size: 10 },
  // ...
};
const stateCursor = useCursor(useUpdateState({...}), DEFAULTS);
```

`useCursor(…)` can accept defaults as a 2nd argument. When it traverses the original value, if it encounters a missing field, it will fill in the one from the default _non-destructively_.

When it then applies an update, it will first _patch in_ the right default values, and then make the change. This ensures clean partial patches of missing nested fields.


### Memoization

- Cursors are immutable: if the value has changed, you get a new cursor instance.

- `useCursor` is memoized: if the value didn't change, you get the same cursor back.

- Lookups `cursor.foo.bar` are stable. It's safe to use a _derived_ cursor directly as a hook dependency.

- Cursors for unchanged values are stable (if the root `updateState` hasn't changed).

- i.e. Even if `cursor` has changed, `cursor.foo.bar` may be reused.


## Utils

### Hashing

- `@{toHash}` will hash any JS value to a 10-digit base 64 string.
- `@{toMurmur53}` will hash any JS value to a 53-bit `number`.

### Keys

- `@{getObjectKey}` assigns a unique, incrementing 53-bit ID to each unique object (uses a `WeakMap`).
- `@{makeKey}` returns a new unique ID from the same set.

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.
