import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { ShaderModule } from '@use-gpu/shader';
import type { Rectangle } from '@use-gpu/core';
import type { LayoutElement, FitInto, Dimension, Direction } from '../types';
import type { TraitProps } from '@use-gpu/traits';

import { memo, gather, keyed, yeet, useFiber, useMemo } from '@use-gpu/live';
import { fitAbsoluteBox } from '../lib/absolute';
import { makeBoxPicker, memoFit } from '../lib/util';
import { useInspectable, useInspectHoverable } from '@use-gpu/workbench';

import { ElementTrait, useElementTrait } from '../traits';
import { useImplicitElement } from '../element/element';
import { BoxLayout } from '../render';

const NO_POINT4 = [0, 0, 0, 0];

export type AbsoluteProps =
  TraitProps<typeof ElementTrait> &
{
  left?: Dimension,
  top?: Dimension,
  right?: Dimension,
  bottom?: Dimension,

  direction?: Direction,

  under?: boolean,
  snap?: boolean,
};

export const Absolute: LiveComponent<AbsoluteProps> = memo((props: PropsWithChildren<AbsoluteProps>) => {
  const {
    left: l,
    top: t,
    right: r,
    bottom: b,
    direction = 'y',
    under = false,
    snap = true,
    children,
  } = props;

  const { width, height, aspect, radius, border, stroke, fill, image, zIndex } = useElementTrait(props);

  const {id} = useFiber();
  const inspect = useInspectable();
  const hovered = useInspectHoverable();

  const c = useImplicitElement(radius, border, stroke, fill, image, children);

  const Resume = (els: LayoutElement[]) => {
    return useMemo(() => {
      const fit = (into: FitInto) => {
        const {size, sizes, offsets, renders, pickers} = fitAbsoluteBox(els, into, l, t, r, b, width, height, aspect, direction, snap);

        inspect({
          layout: {
            into,
            self: [l, t],
            size,
            sizes,
            offsets,
          },
        });

        const inside = {sizes, offsets, renders};
        return {
          size,
          render: (
            box: Rectangle,
            origin: Rectangle,
            z: number,
            clip?: ShaderModule | null,
            mask?: ShaderModule | null,
            transform?: ShaderModule | null,
          ) => (
            sizes.length ? keyed(BoxLayout, id, inside, {box, origin, z: z + zIndex, clip, mask, transform}, hovered) : null
          ),
          pick: makeBoxPicker(id, sizes, offsets, pickers, undefined, undefined, false),
        };
      };

      return yeet({
        sizing: NO_POINT4,
        margin: NO_POINT4,
        absolute: true,
        under,
        fit: memoFit(fit),
        prefit: memoFit(fit),
      });
    }, [props, els, hovered, zIndex]);
  };

  return gather(c, Resume);
}, 'Absolute');
