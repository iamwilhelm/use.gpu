# @use-gpu/react

```sh
npm install --save @use-gpu/react
```

```sh
yarn add @use-gpu/react
```

# Live - React interface

## `<HTML>` (Live → React)
  
Embed React content inside Live

  - `container`: `string` | `HTMLElement` - Containing element (or CSS selector) to render into.
  - `children`: React.ReactNode - React children to render

```tsx
import { HTML } from '@use-gpu/react';

// In Live component:
<HTML container={container}>
  {children}
</HTML>
```

## `<LiveCanvas>` (React → Live)
  
Embed Live Canvas inside React

  - `children`: (canvas: HTMLCanvasElement) => LiveElement - Live children to render

```tsx
import { LiveCanvas } from '@use-gpu/react';
import { WebGPU, AutoCanvas } from '@use-gpu/webgpu';

// In React component:
<LiveCanvas>{
  (canvas) =>
    // Render Live components here, e.g.
    <WebGPU>
      <AutoCanvas canvas={canvas} />
    </WebGPU>  
}</LiveCanvas>
```

## `<Live>` (React → Live)
  
Run bare Live fiber inside React

  - `children`: LiveElement - Live root to render

```tsx
import { Live } from '@use-gpu/react';

const Raw = () => {
  // ...
};

// In React component:
<Live>
  <Raw />
</Live>
```

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.

