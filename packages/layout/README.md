# @use-gpu/layout

```sh
npm install --save @use-gpu/layout
```

```sh
yarn add @use-gpu/layout
```

**Docs**: https://usegpu.live/docs/reference-components-@use-gpu-layout

# Use.GPU - 2D Layout 

Absolute, Block, Flex, Inline, Overflow.

## Example

How to center text inside a centered box. Yes, horizontally and vertically. Wow.

```tsx
return (
  <FlatCamera>

    <Pass>
      <UI>

        <Flex width="100%" height="100%" align="center">
          <Flex width={500} height={150} fill="#3090ff" align="center">

            <Inline>
              <Text weight="black" size={48} color={[1, 1, 1, 1]}>-~ Use.GPU ~-</Text>
            </Inline>

          </Flex>
        </Flex>

      </UI>
    </Pass>

  </FlatCamera>
);
```

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.

