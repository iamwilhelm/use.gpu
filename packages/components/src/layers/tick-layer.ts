import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial, Prop,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, LambdaSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { RawLines } from '../primitives/raw-lines';

import { use, memo, provide, useCallback, useFiber, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, bindingsToLinks } from '@use-gpu/shader/wgsl';
import { makeShaderBindings } from '@use-gpu/core';
import { TransformContext, useTransformContext } from '../providers/transform-provider';
import { useShaderRef } from '../hooks/useShaderRef';

import { getTickPosition } from '@use-gpu/wgsl/instance/vertex/tick.wgsl';
import { getTickSegment } from '@use-gpu/wgsl/geometry/tick.wgsl';

export type TickLayerProps = {
  position?: number[] | TypedArray,
  size?: number,
  width?: number,
  color?: number[] | TypedArray,
  depth?: number,
  offset?: number[] | TypedArray,

  positions?: StorageSource | LambdaSource | ShaderModule,
  sizes?: StorageSource | LambdaSource | ShaderModule,
  widths?: StorageSource | LambdaSource | ShaderModule,
  colors?: StorageSource | LambdaSource | ShaderModule,
  depths?: StorageSource | LambdaSource | ShaderModule,
  offsets?: StorageSource | LambdaSource | ShaderModule,

  detail?: number,
  count?: Prop<number>,
  mode?: RenderPassMode | string,
  id?: number,
};

const TICK_BINDINGS = [
  { name: 'transformPosition', format: 'vec4<f32>', value: [0, 0, 0, 0], args: ['vec4<f32>'] },
  { name: 'getPosition', format: 'vec4<f32>', value: [0, 0, 0, 0] },
  { name: 'getOffset', format: 'vec4<f32>', value: [0, 1, 0, 0] },
  { name: 'getDepth', format: 'f32', value: 0 },
  { name: 'getSize', format: 'f32', value: 2 },
] as UniformAttributeValue[];

export const TickLayer: LiveComponent<TickLayerProps> = memo((props: TickLayerProps) => {
  const {
    position,
    positions,
    color,
    colors,
    size,
    sizes,
    width,
    widths,
    depth,
    depths,
    offset,
    offsets,

    count = 1,
    detail = 1,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  const key = useFiber().id;

  const p = useShaderRef(position, positions);
  const o = useShaderRef(offset, offsets);
  const d = useShaderRef(depth, depths);
  const s = useShaderRef(size, sizes);

  const xf = useTransformContext();

  const c = useCallback(() => (positions?.length ?? resolve(count) ?? 1) * (detail + 1), [positions, count, detail]);

  const bound = useMemo(() => {
    const defines = { TICK_DETAIL: detail };
    const bindings = makeShaderBindings(TICK_BINDINGS, [xf, p, o, d, s])
    const links = bindingsToLinks(bindings);
    return bindBundle(getTickPosition, links, defines);
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

        count: c,
        mode,
        id,
      })
    )
  );
}, 'TickLayer');
