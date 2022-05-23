import { LiveComponent } from '@use-gpu/live/types';
import { TextureSource, Tuples } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { FontMetrics } from '@use-gpu/text/types';
import { Point4, InlineLine } from '../types';

import { use, yeet, useContext } from '@use-gpu/live';
import { SDFFontProvider, useSDFFontContext, SDF_FONT_ATLAS } from '../../text/providers/sdf-font-provider';
import { parseDimension, normalizeMargin } from '../lib/util';

const BLACK = [0, 0, 0, 1];

export type GlyphsProps = {
  id: number,

  color?: Point4,
  size?: number,
  detail?: number,
  snap?: boolean,

  font: number[],
  spans: Tuples<3>,
  glyphs: Tuples<2>,
  breaks: Uint32Array,
  height: FontMetrics,
  lines: InlineLine[],
  
  transform?: ShaderModule,
};

export const Glyphs: LiveComponent<GlyphsProps> = (props) => {
  const {
    id,
    color = BLACK,
    detail,
    size = 16,
    snap = false,

    font,
    spans,
    glyphs,
    breaks,
    height,
    lines,

    transform,
  } = props;

  const { getGlyph, getScale, getRadius } = useSDFFontContext();
  
  const adjust = size / (detail ?? size);
  const radius = getRadius();
  const scale = getScale(detail ?? size) * adjust;
      
  const out = [] as any[];
  const rectangles = [] as number[];
  const uvs = [] as number[];
  let count = 0;

  const bounds = [Infinity, Infinity, -Infinity, -Infinity];

  for (const {layout, start, end, gap} of lines) {
    const [l, t] = layout;

    const {ascent, lineHeight} = height;
    let x = l;
    let y = t + ascent;

    let sx = x;
    spans.iterate((_a, trim, _h, index) => {
      glyphs.iterate((fontIndex: number, glyphId: number, isWhiteSpace: number) => {
        const {glyph, mapping} = getGlyph(font[fontIndex], glyphId, detail ?? size);
        const {image, layoutBounds, outlineBounds} = glyph;
        const [ll, lt, lr, lb] = layoutBounds;

        if (!isWhiteSpace) {
          if (image && outlineBounds) {
            const [gl, gt, gr, gb] = outlineBounds;

            const cx = snap ? Math.round(sx) : sx;
            const cy = snap ? Math.round(y) : y;

            const left = (scale * gl) + cx;
            const top = (scale * gt) + cy;
            const right = (scale * gr) + cx;
            const bottom = (scale * gb) + cy;

            rectangles.push(left, top, right, bottom);
            uvs.push(mapping[0], mapping[1], mapping[2], mapping[3]);

            bounds[0] = Math.min(bounds[0], left);
            bounds[1] = Math.min(bounds[1], top);
            bounds[2] = Math.max(bounds[2], right);
            bounds[3] = Math.max(bounds[3], bottom);

            count++;
          }
        }

        sx += lr * scale;
        x += lr * scale;
      }, breaks[index - 1] || 0, breaks[index]);

      if (trim) {
        x += gap;
        sx = snap ? Math.round(x) : x;
      }
    }, start, end);
  }

  const render = count ? {
    id,
    rectangles,
    uvs,
    sdf: [radius, scale, size, 0],
    fill: color,
    texture: SDF_FONT_ATLAS,
    count,
    transform,
    bounds,
  } : null;

  return yeet(render);
};
