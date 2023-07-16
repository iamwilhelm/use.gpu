# @use-gpu/glyph

```sh
npm install --save @use-gpu/glyph
```

```sh
yarn add @use-gpu/glyph
```

**Docs**: https://usegpu.live/docs/reference-library-@use-gpu-glyph

# Use.GPU - SDF + Font glyph renderer

- rust/wasm `ab_glyph` wrapper
- subpixel distance transform in TS


Stand-alone SDF:

```tsx
import { glyphToSDF, rgbaToSDF } from '@use-gpu/glyph/sdf';
```

```tsx
// Convert grayscale glyph to SDF
glyphToSDF = (
  data: Uint8Array,
  w: number,
  h: number,
  pad: number = 4,
  radius: number = 3,
  cutoff: number = 0.25,

  // ESDT vs EDT
  subpixel: boolean = true,

  // Solidify semi-transparent areas
  solidify: boolean = true,

  // Pre-process contour
  preprocess: boolean = false,

  // Post-process SDF
  postprocess: boolean = false,

  // Get intermediate steps
  debug?: (image: Image) => void,
): Image;

// Convert RGBA image to SDF
rgbaToSDF = (
  data: Uint8Array,
  w: number,
  h: number,
  pad: number = 4,
  radius: number = 3,
  cutoff: number = 0.25,
  subpixel: boolean = true,
  solidify: boolean = true,
  preprocess: boolean = false,
  postprocess: boolean = false,
  debug?: (image: Image) => void,
): Image;

type Image = {
  data: Uint8Array,
  width: number,
  height: number,
};
```

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.
