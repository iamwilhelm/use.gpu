import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, TextureSource, LambdaSource, RenderPassMode,
} from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

import { Virtual } from './virtual';

import { patch } from '@use-gpu/state';
import { use, yeet, memo, useOne, useNoOne, useRef } from '@use-gpu/live';
import { bindBundle, bindingsToLinks, bundleToAttributes, getBundleKey } from '@use-gpu/shader/wgsl';
import { makeShaderBindings } from '@use-gpu/core';

import { useBoundShader } from '../hooks/useBoundShader';
import { usePickingShader } from '../providers/picking-provider';
import { useRenderContext, useNoRenderContext } from '../providers/render-provider';
import { useNativeColorTexture } from '../hooks/useNativeColor';

import { getFullScreenVertex } from '@use-gpu/wgsl/instance/vertex/full-screen.wgsl';
import { getTextureColor } from '@use-gpu/wgsl/mask/textured.wgsl';

export type RawFullScreenProps = {
  texture?: TextureSource | LambdaSource | ShaderModule,
  filter?: ShaderModule,
  initial?: boolean,

  pipeline?: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode,
  id?: number,
};

const ZERO = [0, 0, 0, 1];

const FRAGMENT_BINDINGS = bundleToAttributes(getTextureColor);

const DEFINES = {
  HAS_ALPHA_TO_COVERAGE: false,
  HAS_SCISSOR: false,
};

const PIPELINE = {
  primitive: {
    topology: 'triangle-list',
  },
  depthStencil: {
    depthWriteEnabled: false,
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

export const RawFullScreen: LiveComponent<RawFullScreenProps> = memo((props: RawFullScreenProps) => {
  const {
    pipeline: propPipeline,
    mode = 'opaque',
    id = 0,
    initial = false,
  } = props;

  const vertexCount = 3;
  const instanceCount = 1;

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);

  const t = useNativeColorTexture(props.texture, props.filter);

  const getVertex = getFullScreenVertex;
  const getPicking = usePickingShader({id});
  const getFragment = useBoundShader(getTextureColor, FRAGMENT_BINDINGS, [t]);
  const links = useOne(() => ({getVertex, getFragment, getPicking}),
    getBundleKey(getVertex) + getBundleKey(getFragment) + +(getPicking && getBundleKey(getPicking)));

  const renderContext = initial ? useRenderContext() : useNoRenderContext(); 
  let first = useRef(true);
  initial ? useOne(() => { first.current = true; }, renderContext) : useNoOne();

  const shouldDispatch = initial ? () => {
    if (!first.current) return false;
    first.current = false;
  } : undefined;

  return use(Virtual, {
    vertexCount,
    instanceCount,

    links,
    defines: DEFINES,
    shouldDispatch,

    renderer: 'solid',
    pipeline,
    mode,
  });
}, 'RawFullScreen');
