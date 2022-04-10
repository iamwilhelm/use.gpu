import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial, Prop,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, LambdaSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderSource } from '@use-gpu/shader/types';

import { RawLines } from '../primitives/raw-lines';

import { use, memo, provide, resume, useCallback, useFiber, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, bindingsToLinks } from '@use-gpu/shader/wgsl';
import { makeShaderBindings } from '@use-gpu/core';
import { TransformContext, useTransformContext } from '../providers/transform-provider';
import { TextContext } from '../providers/text-provider';
import { SDFFontProvider } from '../providers/sdf-font-provider';
import { useShaderRef } from '../hooks/useShaderRef';

import { getTickPosition } from '@use-gpu/wgsl/instance/vertex/tick.wgsl';
import { getTickSegment } from '@use-gpu/wgsl/geometry/tick.wgsl';

export type LabelLayerProps = {
  position?: number[] | TypedArray,
  placement?: number[] | TypedArray,
  flip?: number,
  offset?: number,
  size?: number,
  depth?: number,
  outline?: number,
  box?: number,
  color?: number[] | TypedArray,
  background?: number[] | TypedArray,

  positions?: ShaderSource,
  placements?: ShaderSource,
  flips?: ShaderSource,
  offsets?: ShaderSource,
  sizes?: ShaderSource,
  depths?: ShaderSource,
  outlines?: ShaderSource,
  boxes?: ShaderSource,
  colors?: ShaderSource,
  backgrounds?: ShaderSource,

  label?: string,
  labels?: string[],

  detail?: number,
  count?: Prop<number>,
  mode?: RenderPassMode | string,
  id?: number,
};

const TICK_BINDINGS = [
  { name: 'transformPosition', format: 'vec4<f32>', value: [0, 0, 0, 0], args: ['vec4<f32>'] },
  { name: 'getPosition', format: 'vec4<f32>', value: [0, 0, 0, 0], args: ['i32'] },
  { name: 'getOffset', format: 'vec4<f32>', value: [0, 1, 0, 0], args: ['i32'] },
  { name: 'getDepth', format: 'f32', value: 0, args: ['i32'] },
  { name: 'getSize', format: 'f32', value: 2, args: ['i32'] },
] as UniformAttributeValue[];

export const Glyphs: LiveComponent<GlyphsProps> = memo((props: GlyphsProps) => {
  const gpuText = useContext(TextContext);
  
  const {strings} = props;
  const n = strings.reduce((a, b) => a + b.length, 0);

  const rectangles = new Float32Array(n * 4);
  const uvs = new Float32Array(n * 4);
  
  const height = useMemo(() => {
    const {ascent, descent, lineHeight: fontHeight} = gpuText.measureFont(size);
    return {ascent, descent, lineHeight: lineHeight ?? fontHeight};
  }, [size, lineHeight]);

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

  let i = 0;
  for (const s of strings) {
    const {breaks, metrics: m, glyphs: g} = gpuText.measureSpans(content, size);
    const spans = makeTuples(m, 3);
    const glyphs = makeTuples(g, 2);
  }
  
});

export const LabelLayer: LiveComponent<LabelLayerProps> = memo((props: LabelLayerProps) => {
  const {
    position,
    positions,
    placement,
    placements,
    flip,
    flips,
    offset,
    offsets,
    size,
    sizes,
    depth,
    depths,
    outline,
    outlines,
    box,
    boxes,
    color,
    colors,
    background,
    backgrounds,
    label,
    labels,

    count = 1,
    detail = 1,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  const key = useFiber().id;

  const p = useShaderRef(position, positions);
  const l = useShaderRef(placement, placements);
  const f = useShaderRef(flip, flips);
  const o = useShaderRef(offset, offsets);
  const s = useShaderRef(size, sizes);
  const d = useShaderRef(depth, depths);
  const u = useShaderRef(outline, outlines);
  const b = useShaderRef(box, boxes);
  const c = useShaderRef(color, colors);
  const g = useShaderRef(background, backgrounds);

  const xf = useTransformContext();

  const n = useCallback(() => (positions?.length ?? resolve(count) ?? 1), [positions, count]);

  return null;

  return use(SDFFontProvider, {
    children: [],
    then: resume((
      atlas: Atlas,
      source: TextureSource,
      items: (UIAggregate | null)[],
    ) => {

      const bound = useMemo(() => {
        const defines = { TICK_DETAIL: detail };
        const bindings = makeShaderBindings(TICK_BINDINGS, [xf, p, o, d, s])
        const links = bindingsToLinks(bindings);
        return bindBundle(getTickPosition, links, defines, key);
      }, [p, o, d, s, detail]);

      return (
        provide(TransformContext, null,
          use(RawLines, {
            positions: bound,
            segments: getTickSegment,
            color,
            colors,
            width,
            widths,
            depth,
            depths,

            count: n,
            mode,
            id,
          })
        )
      );
    }),
  });
}, 'LabelLayer');
