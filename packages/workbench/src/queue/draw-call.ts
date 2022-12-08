import type { LiveComponent, ArrowFunction } from '@use-gpu/live';
import type { DataBounds, TypedArray, StorageSource, RenderPassMode, DeepPartial, Lazy, UniformLayout, UniformAttribute, UseGPURenderContext, VolatileAllocation } from '@use-gpu/core';
import type { ShaderModule, ParsedBundle, ParsedModule } from '@use-gpu/shader';
import type { Culler } from '../pass/types';

import { yeet, memo, useContext, useNoContext, useMemo, useOne, useState, useResource, SUSPEND } from '@use-gpu/live';
import {
  makeMultiUniforms, makeBoundUniforms, makeVolatileUniforms,
  VIEW_UNIFORMS,
  uploadBuffer,
  resolve,
} from '@use-gpu/core';

import { useDeviceContext } from '../providers/device-provider';
import { useSuspenseContext } from '../providers/suspense-provider';

import { useLinkedShader } from '../hooks/useLinkedShader';
import { usePipelineLayout, useNoPipelineLayout } from '../hooks/usePipelineLayout';
import { useRenderPipelineAsync, setShaderLog, getShaderLog } from '../hooks/useRenderPipeline';
import { useInspectable } from '../hooks/useInspectable'

import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';

export type DrawCallProps = {
  pipeline: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string | null,

  vertexCount?: Lazy<number>,
  instanceCount?: Lazy<number>,
  firstVertex?: Lazy<number>,
  firstInstance?: Lazy<number>,
  bounds?: Lazy<DataBounds>,
  indirect?: StorageSource,

  vertex: ParsedBundle,
  fragment: ParsedBundle,
  
  globalLayout?: GPUBindGroupLayout,

  globalBinding?: (pipeline: GPUPipeline) => VolatileAllocation,
  globalDefs?: UniformAttribute[],
  globalUniforms?: Record<string, Lazy<any>>,

  renderContext: UseGPURenderContext,

  shouldDispatch?: () => boolean | number | undefined,
  onDispatch?: () => void,

  defines?: Record<string, any>,
};

const GLOBAL_DEFINES = {
  '@group(VIEW)': '@group(0)',
  '@group(VIRTUAL)': '@group(1)',
  '@group(VOLATILE)': '@group(2)',
};

const PASS_DEFINES = {
  '@group(VIEW)': '@group(0)',
  '@group(LIGHT)': '@group(1)',
  '@group(VIRTUAL)': '@group(2)',
  '@group(VOLATILE)': '@group(3)',
};

export const DrawCall = (props: DrawCallProps) => {
  // Return a lambda back to parent(s)
  return yeet(drawCall(props));
};

const NO_CALL: Record<string, ArrowFunction> = {};

// Inlined into <Virtual>
export const drawCall = (props: DrawCallProps) => {
  const {
    vertexCount,
    instanceCount,
    firstVertex,
    firstInstance,
    bounds,
    indirect,
    vertex: vertexShader,
    fragment: fragmentShader,

    globalLayout,
    passLayout,

    globalBinding,
    globalDefs,
    globalUniforms,

    renderContext,

    shouldDispatch,
    onDispatch,

    pipeline: propPipeline,
    defines: propDefines,
    mode = 'opaque',
  } = props;

  const inspect = useInspectable();

  // Render set up
  const device = useDeviceContext();
  const suspense = useSuspenseContext();

  // Render shader
  const topology = propPipeline?.primitive?.topology ?? 'triangle-list';

  const defines = useMemo(() => (propDefines ? {
    ...(passLayout ? PASS_DEFINES : GLOBAL_DEFINES),
    ...propDefines,
  } : (passLayout ? PASS_DEFINES : GLOBAL_DEFINES)), [propDefines, passLayout]);

  // Shaders
  const {
    shader,
    uniforms,
    bindings,
    constants,
    volatiles,
    entries,
  } = useLinkedShader(
    [vertexShader, fragmentShader],
    defines,
  );

  // Pipeline layout with global bind group and optional pass-specific bind group
  const layout = globalLayout
  ? usePipelineLayout(device, entries, globalLayout, passLayout)
  : useNoPipelineLayout();

  // Rendering pipeline
  const [pipeline, isStale] = useRenderPipelineAsync(
    device,
    renderContext,
    shader as any,
    propPipeline,
    layout,
  );

  if (!pipeline) return suspense ? SUSPEND : NO_CALL;
  if (isStale) return SUSPEND;

  const base = 1 + !!passLayout;
  
  // Uniforms
  const uniform = useMemo(() => {
    if (globalLayout) return null;
    if (globalBinding) return globalBinding(pipeline);
    return makeMultiUniforms(device, pipeline, globalDefs ?? [VIEW_UNIFORMS], 0);
  }, [device, pipeline, globalLayout, globalBinding, globalDefs]);

  // Bound storage
  const force = !!volatiles.length;
  const storage = useMemo(() =>
    makeBoundUniforms(device, pipeline, uniforms, bindings, base, force),
    [device, pipeline, uniforms, bindings, base]);

  // Volatile storage
  const volatile = useMemo(() =>
    makeVolatileUniforms(device, pipeline, volatiles, base + 1),
    [device, pipeline, uniforms, volatiles, base]
  );

  const inspected = inspect({
    render: {
      vertices: 0,
      instances: 0,
      triangles: 0,
    },
  });
  
  const isStrip = topology === 'triangle-strip';
  const isVolatileGlobal = typeof uniform?.bindGroup === 'function';

  let dispatchVersion: number | null = null;

  const inner = (
    passEncoder: GPURenderPassEncoder,
    countGeometry: (v: number, t: number) => void,
  ) => {
    onDispatch && onDispatch();

    const v = resolve(vertexCount || 0);
    const i = resolve(instanceCount || 0);
    const fv = resolve(firstVertex || 0);
    const fi = resolve(firstInstance || 0);

    const t = isStrip ? (v - 2) * i : Math.floor(v * i / 3);

    inspected.render.vertices = v;
    inspected.render.instances = i;
    inspected.render.triangles = t;

    countGeometry(v * i, t);

    passEncoder.setPipeline(pipeline);

    if (uniform) {
      if (globalUniforms) {
        uniform.pipe.fill(globalUniforms);
        uploadBuffer(device, uniform.buffer, uniform.pipe.data);
      }

      if (isVolatileGlobal) passEncoder.setBindGroup(0, uniform.bindGroup());
      else passEncoder.setBindGroup(0, uniform.bindGroup);
    }

    if (storage.pipe && storage.buffer) {
      storage.pipe.fill(constants);
      uploadBuffer(device, storage.buffer, storage.pipe.data);
    }

    if (storage.bindGroup) passEncoder.setBindGroup(base, storage.bindGroup);
    if (volatile.bindGroup) passEncoder.setBindGroup(base + 1, volatile.bindGroup());

    if (indirect) passEncoder.drawIndirect(indirect.buffer, indirect.byteOffset ?? 0);
    else passEncoder.draw(v, i, fv, fi);
  };

  let draw = inner;
  if (shouldDispatch) {
    draw = (passEncoder: GPUComputePassEncoder, countDispatch: (d: number) => void) => {
      const d = shouldDispatch();
      if (d === false) return;
      if (typeof d === 'number') {
        if (dispatchVersion === d) return;
        dispatchVersion = d;
      }
      
      return inner(passEncoder, countDispatch);
    };
  }

  return mode ? {[mode]: {draw, bounds}} : {draw};
};

//setShaderLog(100);
//setTimeout(() => console.log(getShaderLog().map(s => [s.vertex.hash, s.fragment.hash])), 2000);
