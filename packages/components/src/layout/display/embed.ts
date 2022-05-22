import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { LayoutElement, Point, Dimension, Margin, Point4, Rectangle, ImageAttachment } from '../types';

import { use, memo, gather, provide, yeet, tagFunction, useFiber } from '@use-gpu/live';
import { getBlockMinMax, getBlockMargin, fitBlock } from '../lib/block';
import { normalizeMargin, parseDimension, memoFit } from '../lib/util';
import { LayoutContext } from '../../providers/layout-provider';

export type EmbedProps = {
  direction?: 'x' | 'y',

  width?: Dimension,
  height?: Dimension,

  grow?: number,
  shrink?: number,
  margin?: number | Margin,
  snap?: boolean,

  render?: (layout: Rectangle) => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Embed: LiveComponent<EmbedProps> = memo((props: EmbedProps) => {
  const {
    width,
    height,
    grow = 0,
    shrink = 0,
    snap = true,
    margin: m = 0,
    render,
    children,
  } = props;

  const margin = normalizeMargin(m);

  const {id} = useFiber();

  const Resume = (els: LayoutElement[]) => {
    const w = width != null && width === +width ? width : null;
    const h = height != null && height === +height ? height : null;

    const fixed = [w, h] as [number | null, number | null];

    const sizing = [w ?? 0, h ?? 0, w ?? 1e5, h ?? 1e5];

    let ratioX = undefined;
    let ratioY = undefined;
    if (typeof width  === 'string') ratioX = parseDimension(width,  1, false);
    if (typeof height === 'string') ratioY = parseDimension(height, 1, false);

    return yeet({
      sizing,
      margin,
      grow,
      shrink,
      ratioX,
      ratioY,
      fit: memoFit((into: Point) => {
        const w = width != null ? parseDimension(width, into[0], snap) : null;
        const h = height != null ? parseDimension(height, into[1], snap) : null;

        const size = [
          w ?? into[0],
          h ?? into[1],
        ] as [number, number];

        return {
          size,
          render: (layout: Rectangle) => {
            const view = render ? render(layout) : provide(LayoutContext, layout, children);
            return yeet(view);
          },
        };
      }),
    });
  };
  
  return gather(children, Resume);
}, 'Embed');
