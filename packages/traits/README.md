# @use-gpu/traits

```sh
npm install --save @use-gpu/text
```

```sh
yarn add @use-gpu/text
```

**Docs**: https://usegpu.live/docs/reference-live-@use-gpu-traits

# Live - Component Traits

- Smart input parsers for 'common uncommon' types (enums, colors, vectors, quaternions, ...)
- Define a type and parser for a set of props
- Use as prop mix-ins for a family of related components

#### Parsers

```tsx
import { parseColor } from '@use-gpu/traits';

// Required prop: Color
const value = useProp(props.value, parseColor);

// Optional prop: (Color | null)
const value = useProp(props.value, optional(parseColor));

// Default: Color ?? parseColor("#123456")
const value = useProp(props.value, parseColor, '#123456');
```
Here, `parseColor` will parse CSS colors like `#123456` or `rgba(…)` and return a normalized `[r, g, b, a]` tuple.

#### Traits

```tsx
const parsers = {...};
const defaults = {...};

// Outside a component
const useTrait = makeUseTrait(parsers, defaults);

// Inside a component
const {field} = useTrait(props);
```

## Trait Example

Define a `StyleTrait` mix-in, accessed via a derived `useStyleTrait` hook.

```tsx
type StyleTrait = {
  size: number,
  rounded: boolean,
  color?: Color,
};
```

#### Component

```tsx
import { StyleTrait, useStyleTrait } from './traits';

type ComponentProps = Partial<StyleTrait> & {
  //...
};
  
const Component: FC<ComponentProps> = (props: ComponentProps) => {
  const {size, filled, color} = useStyleTrait(props);
  // ...
};
```

#### Trait

```tsx
import {
  makeUseTrait,
  parseNumber,
  parseBoolean,
  parseColor,
} from '@use-gpu/traits';

const STYLE_TRAIT = {
  size:    parseNumber,
  rounded: parseBoolean,
  color:   optional(parseColor),
};

const STYLE_DEFAULTS = {
  size: 1,
  rounded: true,
};

export const useStyleTrait = makeUseTrait<ScaleTrait>(STYLE_TRAIT, STYLE_DEFAULTS);
```


## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.

