import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial, Prop,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, TextureSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { ViewContext } from '../providers/view-provider';
import { PickingContext, useNoPicking } from '../render/picking';
import { LayoutContext } from '../providers/layout-provider';
import { render } from './render';

import { patch } from '@use-gpu/state';
import { use, memo, useCallback, useFiber, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, bindingsToLinks, bundleToAttributes } from '@use-gpu/shader/wgsl';
import { makeShaderBindings, resolve } from '@use-gpu/core';
import { useShaderRef } from '../hooks/useShaderRef';

import rectangleVertex from '@use-gpu/wgsl/render/ui/vertex.wgsl';
import rectangleFragment from '@use-gpu/wgsl/render/ui/fragment.wgsl';

export type UIRectanglesProps = {
  rectangle?: number[] | TypedArray,
  radius?: number[] | TypedArray,
  border?: number[] | TypedArray,
  stroke?: number[] | TypedArray,
  fill?: number[] | TypedArray,
  uv?: number[] | TypedArray,
  repeat?: number,

  texture?: TextureSource | LambdaSource | ShaderModule,
  transform?: ShaderModule,

  rectangles?: StorageSource | LambdaSource | ShaderModule
  radiuses?: StorageSource | LambdaSource | ShaderModule,
  borders?: StorageSource | LambdaSource | ShaderModule,
  strokes?: StorageSource | LambdaSource | ShaderModule,
  fills?: StorageSource | LambdaSource | ShaderModule,
  uvs?: StorageSource | LambdaSource | ShaderModule,
  repeats?: StorageSource | LambdaSource | ShaderModule,

  count?: number,
  
  pipeline?: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
  id?: number,
};

const VERTEX_BINDINGS = bundleToAttributes(rectangleVertex);
const FRAGMENT_BINDINGS = bundleToAttributes(rectangleFragment);

const DEFINES = {
  STRIP_SEGMENTS: 2,
};

const PIPELINE = {
  primitive: {
    topology: 'triangle-strip',
    stripIndexFormat: 'uint16',
  },
  depthStencil: {
    depthWriteEnabled: false,
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

export const UIRectangles: LiveComponent<UIRectanglesProps> = memo((props: UIRectanglesProps) => {
  const {
    pipeline: propPipeline,
    mode = RenderPassMode.Opaque,
    id = 0,
    count = 1,
  } = props;

  const vertexCount = 4;
  const instanceCount = useCallback(() => (props.rectangles?.length ?? resolve(count)), [props.rectangles, count]);

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);
  const key = useFiber().id;

  const r = useShaderRef(props.rectangle, props.rectangles);
  const a = useShaderRef(props.radius, props.radiuses);
  const b = useShaderRef(props.border, props.borders);
  const s = useShaderRef(props.strokes, props.strokes);
  const f = useShaderRef(props.fill, props.fills);
  const u = useShaderRef(props.uv, props.uvs);
  const p = useShaderRef(props.repeat, props.repeats);

  const t = props.texture;
  const x = props.transform;

  const [vs, fs] = useMemo(() => {
    const vertexBindings = makeShaderBindings<ShaderModule>(VERTEX_BINDINGS, [r, a, b, s, f, u, p, x]);
    const fragmentBindings = makeShaderBindings<ShaderModule>(FRAGMENT_BINDINGS, [t]);

    const vs = bindBundle(rectangleVertex, bindingsToLinks(vertexBindings), null, key);
    const fs = bindBundle(rectangleFragment, bindingsToLinks(fragmentBindings), null, key);

    return [vs, fs];
  }, [r, a, b, s, f, u, p, t, x]);

  return render({
    vertexCount,
    instanceCount,

    vertex: vs,
    fragment: fs,

    defines: DEFINES,
    deps: null,

    pipeline,
    mode,
    id,
  });
}, 'UIRectangles');
