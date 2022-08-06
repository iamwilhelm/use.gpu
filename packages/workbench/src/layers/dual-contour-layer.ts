import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, RenderPassMode,
} from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';
import type { VectorLike } from '@use-gpu/traits';

import { Virtual } from '../primitives/virtual';
import { Readback } from '../primitives/readback';

import { use, memo, yeet, debug, fragment, useMemo, useOne, useVersion } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { resolve, uploadBuffer } from '@use-gpu/core';

import { useBoundShader } from '../hooks/useBoundShader';
import { useComputePipeline } from '../hooks/useComputePipeline';
import { useDataSize } from '../hooks/useDataBinding';
import { useDerivedSource } from '../hooks/useDerivedSource';
import { useRawSource } from '../hooks/useRawSource';
import { useScratchSource } from '../hooks/useScratchSource';
import { useShaderRef } from '../hooks/useShaderRef';

import { useDeviceContext } from '../providers/device-provider';
import { useMaterialContext } from '../providers/material-provider';
import { useTransformContext } from '../providers/transform-provider';

import { useInspectable } from '../hooks/useInspectable'

import { main as scanVolume } from '@use-gpu/wgsl/contour/scan.wgsl';
import { main as fitContour } from '@use-gpu/wgsl/contour/fit.wgsl';
import { getDualContourVertex } from '@use-gpu/wgsl/instance/vertex/dual-contour.wgsl';

import { Dispatch } from '../primitives/dispatch';

const READ_WRITE_SOURCE = { readWrite: true, flags: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC };
const INDIRECT_SOURCE   = { readWrite: true, flags: GPUBufferUsage.STORAGE | GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_SRC };

const INDIRECT_OFFSET_1 = { byteOffset: 16 };
const READ_ONLY_SOURCE = { readWrite: false };

export type DualContourLayerProps = {
  color?: number[] | TypedArray,

  range: VectorLike[],
  values: ShaderSource,
  normals?: ShaderSource,
  level?: number,

  loopX?: boolean,
  loopY?: boolean,
  loopZ?: boolean,
  shaded?: boolean,
  zBias?: number,

  size?: Lazy<[number, number] | [number, number, number] | [number, number, number, number]>,
  mode?: RenderPassMode | string,
  id?: number,
};

const SCAN_BINDINGS = bundleToAttributes(scanVolume);
const FIT_BINDINGS = bundleToAttributes(fitContour);
const VERTEX_BINDINGS = bundleToAttributes(getDualContourVertex);

const PIPELINE = {
  primitive: {
    topology: 'triangle-strip',
    cullMode: 'back',
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

export const DualContourLayer: LiveComponent<DualContourLayerProps> = memo((props: DualContourLayerProps) => {
  const {
    color,

    range,
    values,
    normals,
    level,

    loopX = false,
    loopY = false,
    loopZ = false,
    shaded = true,
    zBias = 0,

    mode = 'opaque',
    id = 0,
  } = props;

  const size = useDataSize(props.size, props.values);

  const v = useShaderRef(null, values);
  const n = useShaderRef(null, normals);
  const s = useShaderRef(size);
  const l = useShaderRef(level);

  const c = useShaderRef(color);
  const z = useShaderRef(zBias);

  const rangeMin = useOne(() => range.map(([min]) => min), range);
  const rangeMax = useOne(() => range.map(([,max]) => max), range);

  const min = useShaderRef(rangeMin);
  const max = useShaderRef(rangeMax);

  const xf = useTransformContext();

  const indirectDraw    = useOne(() => new Uint32Array(8));
  const indirectStorage = useRawSource(indirectDraw, 'u32', INDIRECT_SOURCE);

  const [edgeStorage,   allocateEdges]    = useScratchSource('u32', READ_WRITE_SOURCE);
  const [cellStorage,   allocateCells]    = useScratchSource('u32', READ_WRITE_SOURCE);
  const [markStorage,   allocateMarks]    = useScratchSource('u32', READ_WRITE_SOURCE);
  const [indexStorage,  allocateIndices]  = useScratchSource('u32', READ_WRITE_SOURCE);
  const [vertexStorage, allocateVertices] = useScratchSource('vec4<f32>', READ_WRITE_SOURCE);
  const [normalStorage, allocateNormals]  = useScratchSource('vec4<f32>', READ_WRITE_SOURCE);

  const indirectNextStorage = useDerivedSource(indirectStorage, INDIRECT_OFFSET_1);
  const edgeReadout         = useDerivedSource(edgeStorage, READ_ONLY_SOURCE);
  const indexReadout        = useDerivedSource(indexStorage, READ_ONLY_SOURCE);
  const vertexReadout       = useDerivedSource(vertexStorage, READ_ONLY_SOURCE);
  const normalReadout       = useDerivedSource(normalStorage, READ_ONLY_SOURCE);
  
  const boundScan = useBoundShader(
    scanVolume,
    SCAN_BINDINGS,
    [
      indirectStorage, edgeStorage, cellStorage, markStorage, indexStorage,
      v, s, l,
    ]);

  const boundFit = useBoundShader(
    fitContour,
    FIT_BINDINGS,
    [
      cellStorage, vertexStorage, normalStorage,
      v, n, s, l,
    ]);

  const boundVertex = useBoundShader(
    getDualContourVertex,
    VERTEX_BINDINGS, [
      edgeReadout, indexReadout, vertexReadout, normalReadout,
      xf, s, c, z, min, max,
    ]);

  const sourceVersion = useVersion(values) + useVersion(normals);
  const shouldDispatch = () => sourceVersion + values.version + (normals?.version ?? 0);

  const edgePassSize = () => {
    const s = resolve(size);
    const d = (s[0] || 1) * (s[1] || 1) * (s[2] || 1);

    allocateEdges(d * 3);
    allocateCells(d);
    allocateMarks(d);
    allocateIndices(d);
    allocateVertices(d);
    allocateNormals(d);

    return [s[0] - 1, (s[1] - 1) || 1, (s[2] - 1) || 1];
  };

  const device = useDeviceContext();
  const generationRef = useOne(() => ({current: 1}));

  const dispatchEdgePass = () => {
    const {current: generation} = generationRef;

    // Build final draw call for geometry
    // -> Make list of active edges (1 edge = 1 final quad)
    indirectDraw[0] = 4; // vertexCount
    indirectDraw[1] = 0; // instanceCount = nextEdge (atomic add)
    // indirectDraw[2] = 0
    // indirectDraw[3] = 0

    // Build vertex dispatch
    // -> Make list of active vertices (adjacent to an active edge)
    // -> Use atomic per-cell mask to handle overlap
    // -> Use generation number to avoid clearing mask
    // -> Make map of cell (i,j,k) to vertex index for reverse lookup
    indirectDraw[4] = 0; // dispatchX = nextVertex
    indirectDraw[5] = 1;
    indirectDraw[6] = 1;
    indirectDraw[7] = generation;
    generationRef.current++;

    uploadBuffer(device, indirectStorage.buffer, indirectDraw.buffer);
  };

  const m = useMaterialContext();
  const getFragment = shaded ? m : getPassThruFragment;

  return [
    use(Dispatch, {
      shader: boundScan,
      size: edgePassSize,
      shouldDispatch,
      onDispatch: dispatchEdgePass,
    }),
    use(Dispatch, {
      shader: boundFit,
      indirect: indirectNextStorage,
      shouldDispatch,
    }),
    use(Virtual, {
      indirect: indirectStorage,
      getVertex: boundVertex,
      getFragment,
      pipeline: PIPELINE,
      renderer: shaded ? 'shaded' : 'solid',
      mode,
      id,
    }),
    /*
    use(Readback, { source: indirectStorage, then: (data) => {
      console.log(data);
      return debug(fragment([]));
    } }),
    use(Readback, { source: cellStorage, then: (data) => {
      console.log(data);
      return debug(fragment([]));
    } }),
    use(Readback, { source: edgeStorage, then: (data) => {
      console.log(data);
      return debug(fragment([]));
    } }),
    /*
    */
  ];
  /*
  const defines = useMemo(() => ({LOOP_X: !!loopX, LOOP_Y: !!loopY, LOOP_Z: !!loopZ}), [loopX, loopY, loopZ]);
  const indices = useBoundShader(getSurfaceIndex, [SIZE_BINDING], [boundSize], defines);

  const v = useShaderRef(null, props.values);

  //const xf = useApplyTransform(p);
  //const normals = useBoundShader(getSurfaceNormal, [SIZE_BINDING, POSITION_BINDING], [boundSize, xf], defines);

  */
}, 'DualContourLayer');
