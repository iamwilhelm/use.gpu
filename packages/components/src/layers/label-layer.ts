import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial, Prop,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, LambdaSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderSource } from '@use-gpu/shader/types';

import { RawLines } from '../primitives/raw-lines';

import { use, memo, provide, resume, useCallback, useContext, useFiber, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, bindingsToLinks } from '@use-gpu/shader/wgsl';
import { makeShaderBindings } from '@use-gpu/core';
import { TransformContext, useTransformContext } from '../providers/transform-provider';
import { useShaderRef } from '../hooks/useShaderRef';

import { SDFFontProvider } from '../text/providers/sdf-font-provider';
import { GlyphSource } from '../text/glyph-source';

import { getTickPosition } from '@use-gpu/wgsl/instance/vertex/tick.wgsl';
import { getTickSegment } from '@use-gpu/wgsl/geometry/tick.wgsl';

export type LabelLayerProps = {
  position?: number[] | TypedArray,
  placement?: number[] | TypedArray,
  //flip?: number,
  offset?: number,
  size?: number,
  depth?: number,
  color?: number[] | TypedArray,

  outline?: number,
  outlineColor?: number[] | TypedArray,

  positions?: ShaderSource,
  placements?: ShaderSource,
  //flips?: ShaderSource,
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

    detail,
    count = 1,
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

  return (
    use(SDFFontProvider, {
      children:
        use(GlyphSource, {
          strings: labels ?? [label],
          detail,
        }),
      then: resume((
        atlas: Atlas,
        source: TextureSource,
        buffers: StorageSource[],
      ) => {
        const [indices, rectangles, uvs, layouts] = buffers;
        
        useMemo(() => console.log({buffers}), buffers);
        return null;

        const bound = useMemo(() => {
          const defines = { TICK_DETAIL: detail };
          const bindings = makeShaderBindings(TICK_BINDINGS, [xf, p, o, d, s])
          const links = bindingsToLinks(bindings);
          return bindBundle(getTickPosition, links, defines, key);
        }, [p, o, d, s, detail]);

        return (
          provide(TransformContext, null,
            use(RawQuads, {
              positions: bound,
              rectangles,
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
    })
  );
}, 'LabelLayer');
