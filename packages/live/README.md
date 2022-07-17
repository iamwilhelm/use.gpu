# @use-gpu/live

```sh
npm install --save @use-gpu/live
```

```sh
yarn add @use-gpu/live
```

# Live - Reactive Effect Run-time

Live is a reimplementation of the **React `<Component>` tree** and its hook system. It allows you to use popular reactive patterns to write code beyond UI widgets.

Unlike React, Live **does not produce an output DOM**. Components can only render other components, or yield values back to parents.

It's built to serve as the reactive core of Use.GPU, but there is nothing GPU- or graphics-specific about it.

Live is designed to play nice with real React, but shares no code with it.

**Non-React extensions:**
- **Continuations** - Parents run more code after children have rendered
- **Yeet-Reduce** - Parents gather values from a tree of children
- **Context Captures** - Context providers in reverse
- **No-Hooks** - Place in `else` statements to us `if` with hooks safely.
- **Morph** - Parents can change Component type without unmounting all children
- **Detach** - Parent can render children independently, outside main render flow

## Usage Cheat Sheet

These examples assume you are familiar with React 17-style functional components.

```tsx
// This allows Live <JSX> to be used, by pretending to be React.
// You can't mix React and Live <JSX> in the same file.
import React from '@use-gpu/live/jsx';

// Main render entry point
import { render } from '@use-gpu/live';
import { App } from './app';

// e.g. on DOM load
render(<App />);
```

Here, `App` is a `LiveComponent` (`LC`). This is just like a React `FunctionComponent` (`FC`), with the same hooks API:

```tsx
import React from '@use-gpu/live/jsx';
import { LC, useState } from '@use-gpu/live';

import { OtherComponent } from './other-component';

export const App: LC = () => {
  const [state, setState] = useState<number>(0);
  // ...
  return <OtherComponent state={state} />
};
```

```tsx
import React from '@use-gpu/live/jsx';

type Props = {
  state: number,
};

export const OtherComponent: LC<Props> = (props: Props) => {
  // ...
};
```

There is also a `children` prop, as well as `key` for items in arrays.

## Hooks

**TL;DR**
- `useCallback`, `useContext`, `useMemo`, `useState` work like in React
- `useOne` is shorthand for a `useMemo` with only 0-1 dependency (not an array)

- `useEffect` and `useLayoutEffect` don't exist, use `useResource`
- `useResource` is a sync `useEffect` + `useMemo`

```tsx
  const t = useResource((dispose) => {
    // Creation
    const thing = new Thing();
    // Deferred cleanup function
    dispose(() => thing.dispose());
    // Returned value
    return thing;
  }, [...dependencies]);
```

## Context providers

#### Make a context

```tsx
import { makeContext } from '@use-gpu/live';

type ContextValue = { foo: number };
const defaultValue = { foo: 1 };
const displayName = 'MyContext';

const MyContext = makeContext<ContextValue>(defaultValue, displayName);
```

#### Optional vs required

If `defaultValue` is `undefined`, the context is **required**.
Its value has type `T`, and will throw an exception if used while missing.

If `defaultValue` is `null`, the context is **optional**.
Its value has type `T | null` and can be used without being provided.

#### Provide a context

```tsx
import React, { Provide } from '@use-gpu/live/jsx';

<Provide context={MyContext} value={value}>...</Provide>
```

#### Use a value from a context

```tsx
import { useContext } from '@use-gpu/live';

const value = useContext(MyContext);
```

## Context captures

This is the reverse of a context provider: it captures values from specific children across an entire sub-tree.

#### Make a capture

```tsx
import { makeCapture } from '@use-gpu/live';

type ContextValue = { foo: number };
const displayName = 'MyContext';

const MyContext = makeCapture<ContextValue>(displayName);
```

#### Pass value to a capture

```tsx
import { useCapture } from '@use-gpu/live';

// In a child
useCapture(MyCapture, value);
```

#### Retrieve captured values

```tsx
import React, { Capture } from '@use-gpu/live/jsx';
import { LiveMap } from '@use-gpu/live/types';
import { captureValues } from '@use-gpu/live';

<Capture context={MyContext} then={(map: LiveMap<T>) => {
  const values: T[] = captureValues(map);
}>...</Capture>
```

The `LiveMap<T>` maps mounted components to values `T`. The helper `captureValues` will return the values in tree order.

A continuation (aka a `then` prop) is similar to a classic `render` prop, except that it is run after children are done. Another difference is that it acts as a fully fledged component: you can e.g. use hooks, and it appears as a separate `Resume(Component)` node in the component tree.

## Gather / Yeet

A component can render a `Gather` to continue after its children are rendered.
Values yielded by those children are gathered up incrementally, and reduced in tree order.

Gather takes two children:
- the tree of children to be rendered
- a continuation `(value: T[]) => JSX.Element` that receives gathered values

Any child can yeet a value, or an array of values:

```tsx
return <Yeet>{value}</Yeet>
```

The parent then looks like:

```tsx
import React, { Gather } from '@use-gpu/live/jsx';

export const Component: LC = () => {
  const then = (values: any[]) => {
    // ...
  };

  return (
    <Gather then={then}>
      <Component />
      <Component />
    </Gather>
  );
};
```

Whenever the yielded `values` change, the continuation is re-run.

#### Render vs Yield

A nice pattern is to make a component's `render` prop optional. If absent, the component will then `@{<Yeet>}` the result instead. This allows the `render` prop to handle the common case, while also allowing the component to be part of a `@{<Gather>}` for more complex use.

## Native syntax

Live also has a native non-JSX syntax, which is ergonomic in use, unlike `React.createElement`.

This is useful e.g. when mixing React code with Live code in the same file, while using JSX for React.

```tsx
import { use, wrap, yeet, gather } from '@use-gpu/live';

// <Component foo={bar} />
use(Component, {foo: bar})

// <Component><Child /></Component>
use(Component, {children: use(Child)})
// or
wrap(Component, use(Child))

// <Component><Child /><Child /></Component>
use(Component, {
  children: [
    use(Child),
    use(Child),
  ],
})

// <Provide context={MyContext} value={value}>...</Provide>
provide(MyContext, value, children)

// <Yeet>{value}</Yeet>
yeet(value)

// <Gather>
//   <Child />
//   {(value) => { }}
// </Gather>
gather(use(Child), (value) => { })
```

In native syntax, live components are not limited to a single `props` argument, but can have any number, including 0. The wider type is `LiveFunction` instead of `LiveComponent`.

## Notes

- The JSX API does not cover 100% of the Native API yet
- `@use-gpu/react` contains extra React interoperability components
- `@use-gpu/inspect` is an interactive inspector/debugger for Live, built using React

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.

