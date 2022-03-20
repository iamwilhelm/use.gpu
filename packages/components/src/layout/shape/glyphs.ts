import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TextureSource, TupleStore } from '@use-gpu/core/types';
import { FontMetrics } from '@use-gpu/text/types';
import { Point4, InlineLine } from './types';

import { use, yeet, useContext } from '@use-gpu/live';
import { LayoutContext } from '../../providers/layout-provider';
import { SDFFontProvider, useSDFFont, SDF_FONT_ATLAS } from '../../providers/sdf-font-provider';
import { parseDimension, normalizeMargin } from '../lib/util';

const BLACK = [0, 0, 0, 1];

export type GlyphsProps = {
  id: number,
  layout: Rectangle,

  color?: Point4,
  size?: number,
  snap?: boolean,

  spans: TupleStore<3>,
  glyphs: TupleStore<2>,
  breaks: number[],
  height: FontMetrics,
  lines: InlineLine[],
};

export const Glyphs: LiveComponent<GlyphsProps> = (props) => {
  const {
    id,
    color = black,
    size = 16,
    snap = false,

    spans,
    glyphs,
    breaks,
    height,
    lines,
  } = props;

  let layout;
  if (props.layout) {
    layout = props.layout;
    useNoContext(LayoutContext);
  }
  else {
    layout = useContext(LayoutContext);
  }

  const { getGlyph, getScale, getRadius } = useSDFFont();
  const scale = getScale(size);
      
  const out = [] as any[];
  const rects = [] as number[];
  const uvs = [] as number[];
  let count = 0;

  for (const {layout, start, end, gap} of lines) {
    const [l, t] = layout;

    const {ascent, descent, lineHeight} = height;
    const h = ascent - descent;
    const g = (lineHeight - h) / 2;
    const base = h + g;

    let x = l;
    let y = t + base;

    let sx = x;

    const ln = [];
    spans.iterate((_a, trim, _h, index) => {
      glyphs.iterate((id: number, isWhiteSpace: boolean) => {
        const {glyph, mapping} = getGlyph(id, size);
        const {image, layoutBounds, outlineBounds} = glyph;
        const [ll, lt, lr, lb] = layoutBounds;

        if (!isWhiteSpace) {
          if (image) {
            const [gl, gt, gr, gb] = outlineBounds;

            const cx = snap ? Math.round(sx) : sx;
            const cy = snap ? Math.round(y) : y;

            rects.push((scale * gl) + cx, (scale * gt) + cy, (scale * gr) + cx, (scale * gb) + cy);
            uvs.push(mapping[0], mapping[1], mapping[2], mapping[3]);
            count++;
          }
        }

        sx += lr * scale;
        x += lr * scale;
        ln.push(id);
      }, breaks[index - 1] || 0, breaks[index]);

      if (trim) {
        x += gap;
        sx = snap ? Math.round(x) : x;
      }
    }, start, end);
  }

  const render = count ? {
    id,
    rectangles: rects,
    uvs,
    radius: [1 / scale, getRadius(), 0, 0],
    fill: color,
    texture: SDF_FONT_ATLAS,
    repeat: -1,

    count,
  } : null;

  return yeet(render);
};
