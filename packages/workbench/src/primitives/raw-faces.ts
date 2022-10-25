import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, RenderPassMode,
} from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import { Virtual } from './virtual';

import { patch } from '@use-gpu/state';
import { use, yeet, memo, useCallback, useMemo, useOne } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { resolve, makeShaderBindings } from '@use-gpu/core';
import { useMaterialContext } from '../providers/material-provider';
import { useScissorContext } from '../providers/scissor-provider';
import { usePickingShader } from '../providers/picking-provider';
import { useCombinedTransform } from '../hooks/useCombinedTransform';
import { useShaderRef } from '../hooks/useShaderRef';
import { useBoundShader, useNoBoundShader } from '../hooks/useBoundShader';

import { getFaceVertex } from '@use-gpu/wgsl/instance/vertex/face.wgsl';
import { getPassThruColor } from '@use-gpu/wgsl/mask/passthru.wgsl';
import { getScissorColor } from '@use-gpu/wgsl/mask/scissor.wgsl';

export type RawFacesProps = {
  position?: number[] | TypedArray,
  normal?: number[] | TypedArray,
  tangent?: number[] | TypedArray,
  uv?: number[] | TypedArray,
  st?: number[] | TypedArray,
  segment?: number,
  color?: number[] | TypedArray,
  zBias?: number,

  positions?: ShaderSource,
  normals?: ShaderSource,
  tangents?: ShaderSource,
  uvs?: ShaderSource,
  sts?: ShaderSource,
  segments?: ShaderSource,
  colors?: ShaderSource,
  zBiases?: ShaderSource,

  indices?: ShaderSource,

  lookups?: ShaderSource,
  ids?:     ShaderSource,
  lookup?:  number,
  id?:      number,

  unweldedNormals?: boolean,
  unweldedTangents?: boolean,
  unweldedUVs?: boolean,
  unweldedLookups?: boolean,

  shaded?: boolean,
  shadow?: boolean,

  count?: Lazy<number>,
  pipeline?: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
};

const ZERO = [0, 0, 0, 1];

const VERTEX_BINDINGS = bundleToAttributes(getFaceVertex);

const PIPELINE = {
  primitive: {
    topology: 'triangle-list',
    cullMode: 'none',
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

export const RawFaces: LiveComponent<RawFacesProps> = memo((props: RawFacesProps) => {
  const {
    pipeline: propPipeline,
    shaded = false,
    shadow = true,
    count = 1,
    mode = 'opaque',

    unweldedNormals = false,
    unweldedTangents = false,
    unweldedUVs = false,
    unweldedLookups = false,
  } = props;

  // Set up draw as:
  // - individual tris (none)
  // - segmented triangle fans (convex faces) (segments)
  // - pre-indexed triangles (indices)
  // - pre-indexed segmented triangle fans (indices + segments)
  const vertexCount = 3;
  const instanceCount = useCallback(() => {
    const segments = (props.segments as any)?.length;
    const indices = (props.indices as any)?.length;
    const positions = (props.positions as any)?.length;

    if (segments != null) return segments - 2;
    if (indices != null) return indices / 3;
    if (positions != null && !props.indices) return positions / 3;

    const c = resolve(count) || 0;
    return (props.segments != null) ? Math.max(0, c - 2) : c;
  }, [props.positions, props.indices, props.segments, count]);

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);

  const p = useShaderRef(props.position, props.positions);
  const n = useShaderRef(props.normal, props.normals);
  const t = useShaderRef(props.tangent, props.tangents);
  const u = useShaderRef(props.uv, props.uvs);
  const s = useShaderRef(props.st, props.sts);
  const g = useShaderRef(props.segment, props.segments);
  const c = useShaderRef(props.color, props.colors);
  const z = useShaderRef(props.zBias, props.zBiases);

  const i = useShaderRef(null, props.indices);

  const lookups = useShaderRef(null, props.lookups);
  const ids = useShaderRef(null, props.ids);

  const [xf, xd] = useCombinedTransform();
  const scissor = useScissorContext();
  
  const renderer = shaded ? 'shaded' : 'solid';
  const material = useMaterialContext()[renderer];

  const hasIndices = !!props.indices;
  const hasSegments = !!props.segments;
  const defines = useMemo(() => ({
    HAS_SCISSOR: !!scissor,
    HAS_SHADOW: shadow,
    HAS_INDICES: hasIndices,
    HAS_SEGMENTS: hasSegments,
    HAS_ALPHA_TO_COVERAGE: false,
    UNWELDED_NORMALS: !!unweldedNormals,
    UNWELDED_TANGENTS: !!unweldedTangents,
    UNWELDED_UVS: !!unweldedUVs,
    UNWELDED_LOOKUPS: !!unweldedLookups,
  }), [scissor, shadow, hasIndices, unweldedNormals, unweldedTangents, unweldedUVs, unweldedLookups]);

  const getVertex = useBoundShader(getFaceVertex, VERTEX_BINDINGS, [xf, xd, scissor, p, n, t, u, s, g, c, z, i]);
  const getPicking = usePickingShader(props);
  const getScissor = scissor ? getScissorColor : null;

  const links = useMemo(() => {
    return shaded
    ? {
      getVertex,
      getScissor,
      getPicking,
      ...material,
    } : {
      getVertex,
      getScissor,
      getPicking,
      getFragment: getPassThruColor,
      ...material,
    }
  }, [getVertex, getPicking, getScissor, material]);

  return (
    use(Virtual, {
      vertexCount,
      instanceCount,

      links,
      defines,
      renderer,

      pipeline,
      mode,
    })
  );
}, 'RawFaces');
