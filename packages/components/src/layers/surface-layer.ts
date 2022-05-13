import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial, Prop,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderSource } from '@use-gpu/shader/types';

import { RawFaces } from '../primitives/raw-faces';

import { patch } from '@use-gpu/state';
import { use, memo, useMemo, useOne } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { resolve } from '@use-gpu/core';
import { useBoundShader } from '../hooks/useBoundShader';

import { getSurfaceIndex } from '@use-gpu/wgsl/plot/surface.wgsl';

export type SurfaceLayerProps = {
  position?: number[] | TypedArray,
  color?: number[] | TypedArray,

  positions?: ShaderSource,
  colors?: ShaderSource,

  loopX?: boolean,
  loopY?: boolean,

  size?: Prop<[number, number] | [number, number, number] | [number, number, number, number]>,
  mode?: RenderPassMode | string,
  id?: number,
};

const SURFACE_BINDINGS = bundleToAttributes(getSurfaceIndex);

export const SurfaceLayer: LiveComponent<SurfaceLayerProps> = memo((props: SurfaceLayerProps) => {
  const {
    position,
    positions,
    color,
    colors,

    loopX = false,
    loopY = false,

    size,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  const sizeExpr = useMemo(() => () =>
    props.positions?.size ?? resolve(size),
    [props.positions, size]);

  const countExpr = useOne(() => () => {
    const s = resolve(sizeExpr);
    return ((s[0] || 1) - +!loopX) * ((s[1] || 1) - +!loopY) * (s[2] || 1) * (s[3] || 1) * 2;
  }, sizeExpr);

  const defines = useMemo(() => ({LOOP_X: !!loopX, LOOP_Y: !!loopY}), [loopX, loopY]);
  const indices = useBoundShader(getSurfaceIndex, SURFACE_BINDINGS, [sizeExpr], defines);

  return use(RawFaces, {
    position,
    positions,
    color,
    colors,

    indices,

    count: countExpr,
    mode,
    id,
  });
}, 'SurfaceLayer');
