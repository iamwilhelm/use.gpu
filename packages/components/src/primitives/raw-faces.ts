import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial, Prop,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderSource } from '@use-gpu/shader/types';

import { ViewContext } from '../providers/view-provider';
import { PickingContext, useNoPicking } from '../render/picking';
import { Virtual } from './virtual';

import { patch } from '@use-gpu/state';
import { use, yeet, memo, useCallback, useFiber, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, bindingsToLinks, bundleToAttributes } from '@use-gpu/shader/wgsl';
import { resolve, makeShaderBindings } from '@use-gpu/core';
import { useApplyTransform } from '../hooks/useApplyTransform';
import { useShaderRef } from '../hooks/useShaderRef';
import { useBoundShader } from '../hooks/useBoundShader';

import { getFaceVertex } from '@use-gpu/wgsl/instance/vertex/face.wgsl';
import { getPassThruFragment } from '@use-gpu/wgsl/mask/passthru.wgsl';

export type RawFacesProps = {
  position?: number[] | TypedArray,
  normal?: number[] | TypedArray,
  segment?: number,
  color?: number[] | TypedArray,

  positions?: ShaderSource,
  normals?: ShaderSource,
  segments?: ShaderSource,
  colors?: ShaderSource,

  indices?: ShaderSource,

  count?: Prop<number>,
  pipeline?: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
  id?: number,
};

const ZERO = [0, 0, 0, 1];

const VERTEX_BINDINGS = bundleToAttributes(getFaceVertex);

const PIPELINE = {
  primitive: {
    topology: 'triangle-list',
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

export const RawFaces: LiveComponent<RawFacesProps> = memo((props: RawFacesProps) => {
  const {
    pipeline: propPipeline,
    count = 1,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  // Set up draw, either individual tris, or triangle fans
  const vertexCount = 3;
  const instanceCount = useCallback(() => {
    const indices = (props.indices as any)?.length;
    const segments = (props.segments as any)?.length;
    const positions = (props.positions as any)?.length;

    if (indices != null) return indices / 3;
    if (segments != null) return segments - 2;
    if (positions != null) return positions / 3;

    const c = resolve(count) || 0;
    return (props.segments != null) ? c - 2 : c / 3;
  }, [props.positions, props.segments, count]);

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);
  const key = useFiber().id;

  const p = useShaderRef(props.position, props.positions);
  const n = useShaderRef(props.normal, props.normals);
  const g = useShaderRef(props.segment, props.segments);
  const c = useShaderRef(props.color, props.colors);

  const i = useShaderRef(null, props.indices);

  const xf = useApplyTransform(p);

  const hasIndices = !!props.indices;
  const defines = useOne(() => ({ HAS_INDICES: hasIndices }), hasIndices);

  const getVertex = useBoundShader(getFaceVertex, VERTEX_BINDINGS, [xf, n, g, c, i]);
  const getFragment = getPassThruFragment;
  
  return use(Virtual, {
    vertexCount,
    instanceCount,

    getVertex,
    getFragment,

    defines,

    pipeline,
    mode,
    id,
  });
}, 'RawFaces');
