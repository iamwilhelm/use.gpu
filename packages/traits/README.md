# @use-gpu/traits

```sh
npm install --save @use-gpu/text
```

```sh
yarn add @use-gpu/text
```

**Docs**: https://usegpu.live/docs/reference-live-@use-gpu-traits

# React/Live - Component Traits

Solves the problem of adding the same props to many components, with sensible default handling.

- Define a parser and a default value for a set of props
- Use as a type safe mix-in for a family of related components

Using many mix-ins together is encouraged and optimized.

See `@use-gpu/parse` for useful parsers (e.g. colors).

#### Example

```tsx
import { trait, combine, TraitProps, makeUseTrait } from '@use-gpu/traits';
import { parseNumber, parseBoolean, parseColor } from '@use-gpu/core';

// Define a mix-in of 3 props
const StyleTrait = trait({
  // A parser is any function `(value?: A) => B`.
  size:    parseNumber,
  rounded: parseBoolean,
  color:   optional(parseColor),
}, {
  // Specify defaults
  size: 1,
  rounded: true,
});

// Make an invokable hook out of a trait
const useTraits = makeUseTrait(StyleTrait);

// OR Combine multiple traits
const traits = combine(StyleTrait, ...);
const useTraits = makeUseTrait(traits);

// Infer complete component type
type ComponentProps = TraitProps<typeof traits>;

// Use in a component
const MyComponent = (props: ComponentProps) => {
  const {color, opacity} = useTraits(props);
};


#### Parsers

Parsers can be used on individual props with `useProp`:

```tsx
import { parseColor } from '@use-gpu/core';
import { useProp, optional } from '@use-gpu/traits';

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
import { trait,  } from '@use-gpu/traits';

const ColorTrait = trait({
  color: parseColor,
}, {
  color: '#808080',
});

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
  const {size, rounded, color} = useStyleTrait(props);
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

export const useStyleTrait = makeUseTrait<StyleTrait>(STYLE_TRAIT, STYLE_DEFAULTS);
```


## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.

