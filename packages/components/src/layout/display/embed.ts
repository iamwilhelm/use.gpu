import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { AutoPoint, LayoutElement, Dimension, Margin } from '../types';
import { Rectangle, Point, Point4 } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { use, memo, gather, provide, yeet, tagFunction, useFiber } from '@use-gpu/live';
import { getBlockMinMax, getBlockMargin, fitBlock } from '../lib/block';
import { memoFit, memoLayout } from '../lib/util';
import { evaluateDimension } from '../parse';
import { LayoutContext } from '../../providers/layout-provider';
import { TransformContext } from '../../providers/transform-provider';

import { useProp } from '../../traits/useProp';
import { BoxTrait, ElementTrait } from '../types';
import { useBoxTrait, useElementTrait } from '../traits';
import { parseDimension, parseMargin } from '../parse';

export type EmbedProps = Partial<BoxTrait> &
{
  width?: Dimension,
  height?: Dimension,
  snap?: boolean,
  render?: (layout: Rectangle, clip?: ShaderModule, transform?: ShaderModule) => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Embed: LiveComponent<EmbedProps> = memo((props: EmbedProps) => {
  const {
    snap = true,
    render,
    children,
  } = props;

  const { margin, grow, shrink, inline } = useBoxTrait(props);

  const width  = useProp(props.width,  parseDimension);
  const height = useProp(props.height, parseDimension);

  const {id} = useFiber();

  const Resume = (els: LayoutElement[]) => {
    const w = width != null && width === +width ? width : null;
    const h = height != null && height === +height ? height : null;

    const fixed = [w, h] as [number | null, number | null];

    const sizing = [w ?? 0, h ?? 0, w ?? 1e5, h ?? 1e5];

    let ratioX = undefined;
    let ratioY = undefined;
    if (typeof width  === 'string') ratioX = evaluateDimension(width,  1, false);
    if (typeof height === 'string') ratioY = evaluateDimension(height, 1, false);

    return yeet({
      sizing,
      margin,
      grow,
      shrink,
      inline,
      ratioX,
      ratioY,
      absolute: true,
      fit: memoFit((into: AutoPoint) => {
        const w = width != null ? evaluateDimension(width, into[0], snap) : null;
        const h = height != null ? evaluateDimension(height, into[1], snap) : null;

        const size = [
          w ?? into[0],
          h ?? into[1],
        ] as [number, number];

        return {
          size,
          render: memoLayout((layout: Rectangle, clip?: ShaderModule, transform?: ShaderModule) => {
            const view = render
              ? render(layout, clip, transform)
              : (
                provide(LayoutContext, layout,
                  provide(TransformContext, transform,
                    children
                  )
                )
              );
            return yeet(view);
          }),
        };
      }),
    });
  };
  
  return gather(children, Resume);
}, 'Embed');
