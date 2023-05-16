import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, DataBounds,
} from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import { Virtual } from './virtual';

import { use, yeet, memo, useCallback, useMemo, useOne, useNoOne, useNoCallback } from '@use-gpu/live';
import { resolve, makeShaderBindings } from '@use-gpu/core';
import { useMaterialContext } from '../providers/material-provider';
import { useScissorContext } from '../providers/scissor-provider';
import { usePickingShader } from '../providers/picking-provider';
import { useCombinedTransform } from '../hooks/useCombinedTransform';
import { useShaderRef } from '../hooks/useShaderRef';
import { useBoundShader, useNoBoundShader } from '../hooks/useBoundShader';

import { usePipelineOptions, PipelineOptions } from '../hooks/usePipelineOptions';

import { getFaceVertex } from '@use-gpu/wgsl/instance/vertex/face.wgsl';

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

  instances?: ShaderSource,
  load?: ShaderSource,

  unweldedNormals?: boolean,
  unweldedTangents?: boolean,
  unweldedUVs?: boolean,
  unweldedLookups?: boolean,

  shaded?: boolean,
  count?: Lazy<number>,
} & Pick<Partial<PipelineOptions>, 'mode' | 'side' | 'shadow' | 'depthTest' | 'depthWrite' | 'alphaToCoverage' | 'blend'>;

const ZERO = [0, 0, 0, 1];

export const RawFaces: LiveComponent<RawFacesProps> = memo((props: RawFacesProps) => {
  const {
    shaded = false,
    shadow = true,
    count = 1,

    mode = 'opaque',
    side = 'front',
    alphaToCoverage,
    depthTest,
    depthWrite,
    blend,

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

  // Instanced draw
  const hasInstances = !!props.instances;
  let instanceSize = null;
  let totalCount = null;
  if (hasInstances) {
    instanceSize = useOne(() => hasInstances ? instanceCount : null, hasInstances);
    totalCount = useCallback(() => (props.instances as any)?.length * resolve(instanceCount), [props.instances, instanceCount]);
  }
  else {
    useNoOne();
    useNoCallback();
  }

  const p = useShaderRef(props.position, props.positions);
  const n = useShaderRef(props.normal, props.normals);
  const t = useShaderRef(props.tangent, props.tangents);
  const u = useShaderRef(props.uv, props.uvs);
  const s = useShaderRef(props.st, props.sts);
  const g = useShaderRef(props.segment, props.segments);
  const c = useShaderRef(props.color, props.colors);
  const z = useShaderRef(props.zBias, props.zBiases);

  const i = useShaderRef(null, props.indices);
  const j = useShaderRef(null, props.instances);
  const k = useShaderRef(instanceSize);
  const l = useShaderRef(null, props.load);

  const lookups = useShaderRef(null, props.lookups);
  const ids = useShaderRef(null, props.ids);

  const {transform: xf, differential: xd, bounds: getBounds} = useCombinedTransform();
  const scissor = useScissorContext();

  let bounds: Lazy<DataBounds> | null = null;
  if (getBounds && (props.positions as any)?.bounds) {
    bounds = useCallback(() => getBounds((props.positions! as any).bounds), [props.positions, getBounds]);
  }
  else {
    useNoCallback();
  }

  const renderer = shaded ? 'shaded' : 'solid';
  const material = useMaterialContext()[renderer];

  const getVertex = useBoundShader(getFaceVertex, [xf, xd, scissor, p, n, t, u, s, g, c, z, i, j, k, l]);
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
    side: 'both',
    shadow,
    scissor,
    alphaToCoverage,
    depthTest,
    depthWrite,
    blend,
  });

  const hasIndices = !!props.indices;
  const hasSegments = !!props.segments;
  const defines = useMemo(() => ({
    ...defs,
    HAS_INDICES: hasIndices,
    HAS_SEGMENTS: hasSegments,
    HAS_INSTANCES: hasInstances,
    UNWELDED_NORMALS: !!unweldedNormals,
    UNWELDED_TANGENTS: !!unweldedTangents,
    UNWELDED_UVS: !!unweldedUVs,
    UNWELDED_LOOKUPS: !!unweldedLookups,
  }), [defs, hasIndices, hasSegments, hasInstances, unweldedNormals, unweldedTangents, unweldedUVs, unweldedLookups]);

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
    })
  );
}, 'RawFaces');
