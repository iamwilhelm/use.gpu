import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, RenderPassMode,
} from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';
import type { VectorLike } from '@use-gpu/traits';

import { Virtual } from '../primitives/virtual';
import { Readback } from '../render/readback';

import { patch } from '@use-gpu/state';
import { use, memo, yeet, debug, fragment, useMemo, useOne } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import {
  resolve,
  uploadBuffer,
  makeBoundUniforms, makeVolatileUniforms, makeStorageBinding,
} from '@use-gpu/core';

import { useDeviceContext } from '../providers/device-provider';
import { useShaderRef } from '../hooks/useShaderRef';
import { useRawSource } from '../hooks/useRawSource';
import { useScratchSource } from '../hooks/useScratchSource';
import { useBoundSource } from '../hooks/useBoundSource';
import { useBoundShader } from '../hooks/useBoundShader';
import { useTransformContext } from '../providers/transform-provider';

import { useLinkedShader } from '../hooks/useLinkedShader';
import { useComputePipeline } from '../hooks/useComputePipeline';
import { useInspectable } from '../hooks/useInspectable'

import { main as scanVolume } from '@use-gpu/wgsl/contour/scan.wgsl';
import { getDualContourVertex } from '@use-gpu/wgsl/instance/vertex/dual-contour.wgsl';

const READ_WRITE_SOURCE = { readWrite: true, flags: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC };
const INDIRECT_SOURCE   = { readWrite: true, flags: GPUBufferUsage.STORAGE | GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_SRC };

/** @hidden */
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
const VERTEX_BINDINGS = bundleToAttributes(getDualContourVertex);

const PIPELINE = {
  primitive: {
    topology: 'triangle-strip',
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

/** @hidden */
export const DualContourLayer: LiveComponent<DualContourLayerProps> = memo((props: DualContourLayerProps) => {
  const {
    color,

    range,
    values,
    level,

    loopX = false,
    loopY = false,
    loopZ = false,
    shaded = true,
    zBias = 0,

    size,
    mode = 'opaque',
    id = 0,
  } = props;

  const sizeExpr = useMemo(() => () =>
    (props.values as any)?.size ?? resolve(size),
    [props.values, size]);

  const countExpr = useOne(() => () => {
    const s = resolve(sizeExpr);
    return (s[0] || 1) * (s[1] || 1) * (s[2] || 1) * (s[3] || 1);
  }, sizeExpr);

  const v = useShaderRef(null, values);
  const l = useShaderRef(level);

  const c = useShaderRef(color);
  const z = useShaderRef(zBias);

  const indirectDraw = useOne(() => new Uint32Array(8));
  const indirectStorage = useRawSource(indirectDraw, 'u32', INDIRECT_SOURCE);

  const [edgeStorage,   allocateEdges]    = useScratchSource(props.values, 'u32', READ_WRITE_SOURCE);
  const [vertexStorage, allocateVertices] = useScratchSource(props.values, 'u32', READ_WRITE_SOURCE);
  const [indexStorage,  allocateIndices]  = useScratchSource(props.values, 'u32', READ_WRITE_SOURCE);

  const d = resolve(countExpr);
  allocateEdges(d * 3);
  allocateVertices(d);
  allocateIndices(d);
  
  const boundScan = useBoundShader(scanVolume, SCAN_BINDINGS, [v, l]);




  const rangeMin = useOne(() => range.map(([min]) => min), range);
  const rangeMax = useOne(() => range.map(([,max]) => max), range);

  const min = useShaderRef(rangeMin);
  const max = useShaderRef(rangeMax);

  const xf = useTransformContext();

  const edgesReadout = useOne(() => ({...edgeStorage, readWrite: false}), edgeStorage);
  const boundVertex = useBoundShader(getDualContourVertex, VERTEX_BINDINGS, [edgesReadout, xf, sizeExpr, min, max, c, z]);




  // Dispatch set up
  const defines = {
    '@group(DATA)': '@group(0)',
    '@group(VIRTUAL)': '@group(1)',
    '@group(VOLATILE)': '@group(2)',
  };

  const {shader: [module], uniforms, bindings, volatiles} = useLinkedShader([boundScan], defines);

  const device = useDeviceContext();
  const pipeline = useComputePipeline(module);

  // Bound storage
  const force = !!volatiles.length;
  const storage = useMemo(() =>
    makeBoundUniforms(device, pipeline, uniforms, bindings, 1, force),
    [device, pipeline, uniforms, bindings]);

  // Volatile storage
  const volatile = useMemo(() =>
    makeVolatileUniforms(device, pipeline, volatiles, 2),
    [device, pipeline, uniforms, volatiles]
  );

  // Uniforms
  const data = useMemo(() =>
    makeStorageBinding(device, pipeline, {
      a: edgeStorage,
      b: vertexStorage,
      c: indexStorage,
      d: indirectStorage,
    }),
    [device, pipeline, edgeStorage, vertexStorage, indexStorage, indirectStorage]
  );

  const inspect = useInspectable();
  const inspected = inspect({
    render: {
      dispatchCount: 0,
    },
  });

  let sourceVersion = 0;
  const generationRef = useOne(() => ({current: 1}));

  const compute = yeet({
    compute: (passEncoder: GPUComputePassEncoder, countDispatch: (d: number) => void) => {
      if (sourceVersion === values.version) return;
      sourceVersion = values.version;

      const s = resolve(sizeExpr);
      const d = resolve(countExpr);
      allocateEdges(d * 3);
      allocateVertices(d);
      allocateIndices(d);

      inspected.render.dispatchCount = d;
      countDispatch(d);

      const {current: generation} = generationRef;
      indirectDraw[0] = 4;
      indirectDraw[1] = 0;
      indirectDraw[4] = 0;
      indirectDraw[5] = generation;
      generationRef.current++;

      uploadBuffer(device, indirectStorage.buffer, indirectDraw.buffer);

      if (storage.pipe && storage.buffer) {
        storage.pipe.fill(constants);
        uploadBuffer(device, storage.buffer, storage.pipe.data);
      }

      passEncoder.setPipeline(pipeline);
      passEncoder.setBindGroup(0, data);
      if (storage.bindGroup) passEncoder.setBindGroup(1, storage.bindGroup);
      if (volatile.bindGroup) passEncoder.setBindGroup(2, volatile.bindGroup());

      passEncoder.dispatchWorkgroups(s[0] - 1, (s[1] - 1) || 1, (s[2] - 1) || 1);
    },
  });

  return [
    compute,
    use(Virtual, {
      indirect: indirectStorage,
      getVertex: boundVertex,
      pipeline: PIPELINE,
      mode,
      id,
    }),
    /*
    use(Readback, { source: indirectStorage, then: (data) => {
      console.log(data);
      return debug(fragment([]));
    } }),
    use(Readback, { source: edgeStorage, then: (data) => {
      console.log(data);
      return debug(fragment([]));
    } }),
    use(Readback, { source: vertexStorage, then: (data) => {
      console.log(data);
      return debug(fragment([]));
    } }),
    */
    use(Readback, { source: indexStorage, then: (data) => {
      console.log(data);
      return debug(fragment([]));
    } }),
  ];
  /*
  const defines = useMemo(() => ({LOOP_X: !!loopX, LOOP_Y: !!loopY, LOOP_Z: !!loopZ}), [loopX, loopY, loopZ]);
  const indices = useBoundShader(getSurfaceIndex, [SIZE_BINDING], [boundSize], defines);

  const v = useShaderRef(null, props.values);

  //const xf = useApplyTransform(p);
  //const normals = useBoundShader(getSurfaceNormal, [SIZE_BINDING, POSITION_BINDING], [boundSize, xf], defines);

  */
}, 'DualContourLayer');
