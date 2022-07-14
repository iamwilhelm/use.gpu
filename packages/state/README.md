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
- merge properties from `update` into `value` recursively
- treat arrays as values

To adjust the behavior, e.g. to replace an object instead of merging it, use the included `$ops` helpers:

@refs{^\$}

e.g.

```tsx
const value  = {hello: {title: 'text', href: '#'}, value: 2};
const update = {hello: $set({title: 'world'});

expect(patch(values, update)).toEqual({ hello: { title: 'world' }, value: 2});
```

## Hashing

- `@{getHashValue}` will return a hashed 53-bit `number` for any JS value. Object identity does not matter.
- `@{getHash}` does the same, but returns a base36-formatted string.

- `@{getObjectKey}` assigns a unique, incrementing 53-bit ID to each unique object, by tracking them in a `WeakMap`.

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.
