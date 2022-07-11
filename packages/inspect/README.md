# @use-gpu/inspect

```sh
npm install --save @use-gpu/inspect
```

```sh
yarn add @use-gpu/inspect
```

# Use.GPU - Live Inspector

Wrap your app's contents in `<UseInspect>`:

```tsx
import { LC } from '@use-gpu/live/types';

import { DebugProvider } from '@use-gpu/workbench';
import { UseInspect } from '@use-gpu/inspect';
import { useFiber } from '@use-gpu/live';
import '@use-gpu/inspect/theme.css';

export const App: LC = () => {

  // HTML target to render inspector into
  const root = document.querySelector('#use-gpu')!;

  // Normal app contents
  const view = (
    // ...
    <Component />
    // ...
  );

  // Inspect the <App> fiber
  const fiber = useFiber();
  return (
    <UseInspect
      fiber={fiber}
      container={root}
      active={true}
      provider={DebugProvider}
    >
      {view}
    </UseInspect>
  );
}
```

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.

