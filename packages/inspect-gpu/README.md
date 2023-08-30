# @use-gpu/inspect-gpu

```sh
npm install --save @use-gpu/inspect-gpu
```

```sh
yarn add @use-gpu/inspect-gpu
```

**Docs**: https://usegpu.live/docs/reference-components-@use-gpu-inspect-gpu

# Use.GPU - WebGPU Inspector

Plugs into `@use-gpu/inspect`.

```tsx
import { inspectGPU } from '@use-gpu/inspect-gpu';

import { useFiber } from '@use-gpu/live';
import { UseInspect } from '@use-gpu/inspect';
import { DebugProvider } from '@use-gpu/workbench';
import '@use-gpu/inspect/theme.css';

const Component = () => null;

const App = () => {
  const view = <Component />;

  const fiber = useFiber();
  const root = document.body;

  return (
    <UseInspect
      fiber={fiber}
      container={root}
      provider={DebugProvider}
      // Add extension(s) here
      extensions={[inspectGPU]}
    >
      {view}
    </UseInspect>
  )
```

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.

