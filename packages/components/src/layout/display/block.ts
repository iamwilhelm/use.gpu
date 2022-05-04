import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { LayoutElement, Point, Dimension, Margin, Point4, ImageAttachment } from '../types';

import { use, memo, gather, yeet, useFiber } from '@use-gpu/live';
import { getBlockMinMax, getBlockMargin, fitBlock } from '../lib/block';
import { normalizeMargin, makeBoxLayout, makeBoxPicker, parseDimension, memoFit } from '../lib/util';

import { Absolute } from './absolute';
import { Element } from '../element/element';

export type BlockProps = {
  direction?: 'x' | 'y',

  width?: Dimension,
  height?: Dimension,

  radius?: Margin | number,
  border?: Margin | number,
  stroke?: Point4,
  fill?: Point4,
  image?: ImageAttachment,

  grow?: number,
  shrink?: number,
  margin?: number | Margin,
  padding?: number | Margin,
  snap?: boolean,
  contain?: boolean,

  element?: LiveElement<any>,
  children?: LiveElement<any>,
};

export const Block: LiveComponent<BlockProps> = memo((props: BlockProps) => {
  const {
    direction = 'y',
    width,
    height,
    grow = 0,
    shrink = 0,
    snap = true,
    margin: m = 0,
    padding: p = 0,
    children,
    contain = !!p,
    
    radius,
    border,
    stroke,
    fill,
    image,
  } = props;

  const background = (fill || image) ? (
    use(Absolute, {
      under: true,
      children: use(Element, {radius, border, stroke, fill, image})
    })
  ) : null;

  const blockMargin = normalizeMargin(m);
  const padding = normalizeMargin(p);

  const {id} = useFiber();

  const Resume = (els: LayoutElement[]) => {
    const w = width != null && width === +width ? width : null;
    const h = height != null && height === +height ? height : null;

    const fixed = [w, h] as [number | null, number | null];

    const sizing = getBlockMinMax(els, fixed, direction);
    const margin = getBlockMargin(els, blockMargin, padding, direction, contain);

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
        const fixed = [
          width != null ? w : null,
          height != null ? h : null,
        ] as [number | number, number | null];

        const {size, sizes, offsets, renders, pickers} = fitBlock(els, into, fixed, padding, direction, contain);
        return {
          size,
          render: makeBoxLayout(sizes, offsets, renders),
          pick: makeBoxPicker(id, sizes, offsets, pickers),
        };
      })
    });
  };
  
  const c = background ? (children ? [background, children] : background) : children;
  return gather(c, Resume);
}, 'Block');
