import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, DataBounds,
} from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import { Virtual } from './virtual';

import { use, yeet, memo, useCallback, useMemo, useOne, useNoOne, useNoCallback } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';

import { useMaterialContext } from '../providers/material-provider';
import { PickingSource, usePickingShader } from '../providers/picking-provider';
import { useScissorContext } from '../providers/scissor-provider';

import { useBoundShader, useNoBoundShader } from '../hooks/useBoundShader';
import { useBoundSource, useNoBoundSource } from '../hooks/useBoundSource';
import { useCombinedTransform } from '../hooks/useCombinedTransform';
import { useInstanceCount, useNoInstanceCount } from '../hooks/useInstanceCount';
import { usePipelineOptions, PipelineOptions } from '../hooks/usePipelineOptions';
import { useShaderRef } from '../hooks/useShaderRef';

import { getFaceVertex } from '@use-gpu/wgsl/instance/vertex/face.wgsl';
import { getInstancedIndex } from '@use-gpu/wgsl/instance/instanced-index.wgsl';

export type RawFacesFlags = {
  flat?: boolean,
  shaded?: boolean,
  fragDepth?: boolean,
} & Pick<Partial<PipelineOptions>, 'mode' | 'side' | 'shadow' | 'depthTest' | 'depthWrite' | 'alphaToCoverage' | 'blend'>

export type RawFacesProps = {
  position?: number[] | TypedArray,
  normal?: number[] | TypedArray,
  tangent?: number[] | TypedArray,
  segment?: number,
  uv?: number[] | TypedArray,
  st?: number[] | TypedArray,
  color?: number[] | TypedArray,
  zBias?: number,

  positions?: ShaderSource,
  normals?: ShaderSource,
  tangents?: ShaderSource,
  segments?: ShaderSource,
  uvs?: ShaderSource,
  sts?: ShaderSource,
  colors?: ShaderSource,
  zBiases?: ShaderSource,

  indices?: ShaderSource,

  instances?: ShaderSource,
  mappedInstances?: boolean,

  unwelded?: {
    colors?: boolean,
    normals?: boolean,
    tangents?: boolean,
    uvs?: boolean,
    lookups?: boolean,
  },

  count?: Lazy<number>,

  shouldDispatch?: (u: Record<string, any>) => boolean | number | null,
  onDispatch?: (u: Record<string, any>) => void,
} & PickingSource & RawFacesFlags;

const ZERO = [0, 0, 0, 1];
const POSITION: UniformAttribute = { format: 'vec4<f32>', name: 'getPosition' };

export const RawFaces: LiveComponent<RawFacesProps> = memo((props: RawFacesProps) => {
  const {
    flat = false,
    shaded = false,
    shadow = true,
    count = null,

    mode = 'opaque',
    side = 'front',
    alphaToCoverage,
    fragDepth = false,
    depthTest,
    depthWrite,
    blend,

    instances,
    mappedInstances,

    unwelded,
    shouldDispatch,
    onDispatch,
  } = props;

  // Set up draw as:
  // - individual tris (none)
  // - segmented triangle fans (convex faces) (segments)
  // - pre-indexed triangles (indices)
  // - pre-indexed segmented triangle fans (indices + segments)
  const vertexCount = 3;
  const instanceCount = useCallback(() => {
    if (count != null) {
      const c = resolve(count) || 0;
      return (props.segments != null) ? Math.max(0, c - 2) : c;
    }

    const segments = (props.segments as any)?.length;
    const indices = (props.indices as any)?.length;
    const positions = (props.positions as any)?.length;

    if (segments != null) return segments - 2;
    if (indices != null) return indices / 3;
    if (positions != null && !props.indices) return positions / 3;

    return 0;
  }, [props.positions, props.indices, props.segments, count]);

  // Instanced draw (repeated or random access)
  const [instanceSize, totalCount] = useInstanceCount(instances, instanceCount, mappedInstances);
  const mappedIndex = instances
    ? useBoundShader(getInstancedIndex, [instanceSize])
    : useNoBoundShader();

  const p = useShaderRef(props.position, props.positions);
  const n = useShaderRef(props.normal, props.normals);
  const t = useShaderRef(props.tangent, props.tangents);
  const u = useShaderRef(props.uv, props.uvs);
  const s = useShaderRef(props.st, props.sts);
  const g = useShaderRef(props.segment, props.segments);
  const c = useShaderRef(props.color, props.colors);
  const z = useShaderRef(props.zBias, props.zBiases);

  const i = useShaderRef(null, props.indices);
  const l = useShaderRef(null, props.instances);

  const {transform: xf, differential: xd, bounds: getBounds} = useCombinedTransform();
  const scissor = useScissorContext();

  const ps = p ? useBoundSource(POSITION, p) : useNoBoundSource();
  const ss = props.sts == null ? ps : props.sts;

  let bounds: Lazy<DataBounds> | null = null;
  if (getBounds && (props.positions as any)?.bounds) {
    bounds = useCallback(() => getBounds((props.positions! as any).bounds), [props.positions, getBounds]);
  }
  else {
    useNoCallback();
  }

  const renderer = shaded ? 'shaded' : 'solid';
  const material = useMaterialContext()[renderer];

  const getVertex = useBoundShader(getFaceVertex, [
    l, mappedIndex, i,
    xf, xd, scissor,
    ps, n, t, u, ss, g, c, z,
  ]);
  const getPicking = usePickingShader(props);

  const links = useMemo(() => {
    return shaded
    ? {
      getVertex,
      getPicking,
      ...material,
    } : {
      getVertex,
      getPicking,
      ...material,
    }
  }, [getVertex, getPicking, material]);

  const [pipeline, defs] = usePipelineOptions({
    mode,
    topology: 'triangle-list',
    side,
    shadow,
    scissor,
    alphaToCoverage,
    depthTest,
    depthWrite,
    blend,
  });

  const hasInstances = !!props.instances;
  const hasIndices = !!props.indices;
  const hasSegments = !!props.segments;
  const defines = useMemo(() => ({
    ...defs,
    HAS_DEPTH: fragDepth,
    HAS_INDICES: hasIndices,
    HAS_SEGMENTS: hasSegments,
    HAS_INSTANCES: hasInstances,
    FLAT_NORMALS: flat,
    UNWELDED_COLORS: !!unwelded?.colors,
    UNWELDED_NORMALS: !!unwelded?.normals,
    UNWELDED_TANGENTS: !!unwelded?.tangents,
    UNWELDED_UVS: !!unwelded?.uvs,
    UNWELDED_LOOKUPS: !!unwelded?.lookups,
  }), [defs, flat, fragDepth, hasIndices, hasSegments, hasInstances, unwelded]);

  return (
    use(Virtual, {
      vertexCount,
      instanceCount: totalCount ?? instanceCount,
      bounds,

      links,
      defines,
      renderer,

      pipeline,
      mode,

      shouldDispatch,
      onDispatch,
    })
  );
}, 'RawFaces');
