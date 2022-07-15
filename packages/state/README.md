# @use-gpu/state

```sh
npm install --save @use-gpu/state
```

```sh
yarn add @use-gpu/state
```

# Live - State management helpers

Helper library JS-value patching and hashing (not Live / React-specific).

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

## Hashing

- `@{toHash}` will hash any JS value to a 10-digit base 64 string.
- `@{toMurmur53}` will hashed any JS value to a 53-bit `number`.

## Keys

- `@{getObjectKey}` assigns a unique, incrementing 53-bit ID to each unique object (uses a `WeakMap`).
- `@{makeKey}` return a new unique ID from the same set.

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.
