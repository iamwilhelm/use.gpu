# @use-gpu/live

```sh
npm install --save @use-gpu/live
```

```sh
yarn add @use-gpu/live
```

# Live - Reactive Effect Run-time

Live is a **reimplementation of the React `<Component>` tree** and its hook system. It allows you to use popular reactive patterns to write code beyond UI widgets.

It's built to serve as the reactive core of Use.GPU, but there is nothing GPU- or graphics-specific about it.

Unlike React, Live **does not produce an output DOM**. Components can only render other components, or yield values back to parents.

Live is designed to play nice with real React, but shares no code with it.

**Non-React extensions:**
- **No-Hooks** - Use `if`/`else` with hooks safely.
- **Continuations** - Parents can run more code after children have rendered.
- **Context captures** - Context providers in reverse. Parent gathers values sparsely from a sub-tree.
- **Yeet-Reduce** - Gather values with incremental map-reduce along an entire sub-tree.
- **Morph** - Parents can change Component type without unmounting all children.
- **Detach** - Parent can decide when to dispatch render to children.

**Modules**
- `@use-gpu/live` is the main effect run-time
- `@use-gpu/react` contains extra React interoperability components
- `@use-gpu/inspect` is an interactive inspector/debugger for Live, built using React

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.

