# Live / React interop

- `<HTML>` (Live -> React) - Embed React inside Live
  - `container`: `string` | `HTMLElement` - Containing element (or CSS selector) to render into.
  - `children`: React.ReactNode - React children to render

```tsx
import { HTML } from '@use-gpu/react';

// In Live render:
<HTML container={container}>
  {children}
</HTML>
```

- `<LiveCanvas>` (React -> Live) - Embed Live Canvas inside React
  - `children`: (canvas: HTMLCanvasElement) => LiveElement - Live children to render

```tsx
import { LiveCanvas } from '@use-gpu/react';
import { WebGPU, AutoCanvas } from '@use-gpu/webgpu';

// In React render:
<LiveCanvas>{
  (canvas) =>
    // Render Live components here, e.g.
    <WebGPU>
      <AutoCanvas canvas={canvas} />
    </WebGPU>  
}</LiveCanvas>
```

- `<Live>` (React -> Live) - Run bare Live fiber inside React
  - `children`: LiveElement - Live root to render

```tsx
import { Live } from '@use-gpu/react';

const Raw = () => {};

<Live>
  <Raw />
</Live>
```
