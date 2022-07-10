# @use-gpu/live

```
npm install --save @use-gpu/live
```

```
yarn add @use-gpu/live
```

# Live - Reactive Effect Run-time

Live is a reimplementation of the kernel of the React run-time, i.e. the &lt;Component> tree and the hook system.

Unlike React, Live does not produce an output DOM. Components can only render other components, or yield values back to parents.

Live is built as the reactive core of Use.GPU, but there is nothing GPU- or graphics-specific about it.

Live is designed to play nice with real React, but is a clean reimplementation from scratch.

Non-React extensions:
- Continuations - Parents run more code after children have rendered
- Yeet-Reduce - Parents gather values from a tree of children
- Context Consumers - Context Providers in reverse

## Usage Cheat Sheet

These examples assume you are familiar with React 17-style functional components.

```tsx
// This allows <JSX> to be used while pretending to be React
import React from '@use-gpu/live/jsx';

// Main render entry point
import { render } from '@use-gpu/live';
import { App } from './app';

// e.g. onLoad
() => {
  render(<App />);
}
```

Here, `App` is a `LiveComponent` (`LC`), which is like a React `FunctionComponent` (`FC`), with the same hooks API:

```tsx
import React from '@use-gpu/live/jsx';
import { LC } from '@use-gpu/live/types';
import { useState } from '@use-gpu/live';

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

There is also a `children` prop, exactly like in React, as well as `key` for arrays.

## Hooks

**TL;DR**
- `useCallback`, `useContext`, `useMemo`, `useState` work like in React

- `useOne` is shorthand for a `useMemo` with only 0-1 dependency (not an array)
- `useRef` doesn't exist, use `useOne(() => ({current: ref}))`

- `useResource` is a sync `useEffect` + `useMemo`
- `useEffect` and `useLayoutEffect` don't exist, use `useResource`

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

## Contexts

#### Make a context

```tsx
import { makeContext } from '@use-gpu/live';

type ContextValue = {
  foo: number,
};

const defaultValue = {
  foo: 1,
};

const MyContext = makeContext<ContextValue>(defaultValue, 'MyContext');
```

#### Provide a context

```tsx
import React, { Provide } from '@use-gpu/live/jsx';

<Provide context={MyContext} value={value}>...</Provide>
```

#### Use a context

```tsx
import React, { Provide } from '@use-gpu/live/jsx';
import { provide } from '@use-gpu/live';
```

#### Optional vs Required

If `defaultValue` is `undefined`, the context is required, has type `T`, and will throw an exception if used while missing.
If `defaultValue` is `null`, the context value has type `T | null` and is optional.

## Gather / Yeet

Components can render a `Gather` to continue after their children are rendered.

Gather takes two children:
- the tree to be rendered, where values are yeeted back upwards
- a continuation `(value: T[]) => JSX.Element` that receives gathered values

Any child can yeet a value, or an array of values:

```tsx
return <Yeet>{value}</Yeet>
```

Yeeted values are reduced in tree order. The parent then looks like:

```tsx
import React, { Gather } from '@use-gpu/live/jsx';

export const Component: LC = () => {
  return (
    <Gather>
      <Components />
      {(values: any[]) => [
        // ...
      ]}
    </Gather>
  );
};
```

A continuation is similar to a classic render prop, except that it acts as a fully fledged component: it can e.g. use hooks, and appears as a separate node in the component tree.

Whenever the yielded `values` change, the continuation is re-run.

## Native Syntax

Live also has a native non-JSX syntax, which is ergonomic in use, unlike `React.createElement`.

This is useful e.g. when mixing React code with Live code in the same file.

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
//   <From />
//   {(value) => { }}
// </Gather>
gather(use(From), (value) => { })
```

In native syntax, live components are not limited to a single `props` argument, but can have any number, including 0. The wider type is `LiveFunction` instead of `LiveComponent`.

## Notes

- The JSX API does not cover 100% of the Native API yet
- `@use-gpu/react` contains extra React interoperability components
- `@use-gpu/inspect` is an interactive inspector/debugger for Live, built using React
