import type { LiveComponent, ArrowFunction } from '@use-gpu/live';
import type { TypedArray, StorageSource, RenderPassMode, DeepPartial, Lazy, UniformLayout, UniformAttribute, UseGPURenderContext, VolatileAllocation } from '@use-gpu/core';
import type { ShaderModule, ParsedBundle, ParsedModule } from '@use-gpu/shader';
import { yeet, memo, useContext, useNoContext, useMemo, useOne, useState, useResource, SUSPEND } from '@use-gpu/live';

import { useDeviceContext } from '../../providers/device-provider';
import { useSuspenseContext } from '../../providers/suspense-provider';

import {
  makeMultiUniforms, makeBoundUniforms, makeVolatileUniforms,
  VIEW_UNIFORMS,
  uploadBuffer,
  resolve,
} from '@use-gpu/core';
import { useLinkedShader } from '../../hooks/useLinkedShader';
import { useRenderPipelineAsync, setShaderLog, getShaderLog } from '../../hooks/useRenderPipeline';
import { useInspectable } from '../../hooks/useInspectable'

import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';

export type DrawCallProps = {
  pipeline: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,

  vertexCount?: Lazy<number>,
  instanceCount?: Lazy<number>,
  indirect?: StorageSource,

  vertex: ParsedBundle,
  fragment: ParsedBundle,
  
  globalBinding?: (pipeline: GPUPipeline) => VolatileAllocation,
  globalDefs?: UniformAttribute[],
  globalUniforms?: Record<string, Lazy<any>>,
  renderContext: UseGPURenderContext,

  defines?: Record<string, any>,
};

const DEFAULT_DEFINES = {
  '@group(VIEW)': '@group(0)',
  '@binding(VIEW)': '@binding(0)',
  '@group(VIRTUAL)': '@group(1)',
  '@group(VOLATILE)': '@group(2)',
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
    indirect,
    vertex: vertexShader,
    fragment: fragmentShader,

    globalBinding,
    globalDefs,
    globalUniforms,
    renderContext,

    pipeline: propPipeline,
    defines: propDefines,
    mode = 'opaque',
  } = props;

  const inspect = useInspectable();

  // Render set up
  const device = useDeviceContext();
  const suspense = useSuspenseContext();

  // Render shader
  const topology = propPipeline.primitive?.topology ?? 'triangle-list';

  const defines = useOne(() => (propDefines ? {
    ...DEFAULT_DEFINES,
    ...propDefines,
  } : DEFAULT_DEFINES), propDefines);

  // Shaders
  const {
    shader,
    uniforms,
    bindings,
    constants,
    volatiles,
  } = useLinkedShader(
    [vertexShader, fragmentShader],
    defines,
  );

  // Rendering pipeline
  const [pipeline, isStale] = useRenderPipelineAsync(
    renderContext,
    shader as any,
    propPipeline,
  );

  if (!pipeline) return suspense ? SUSPEND : NO_CALL;
  if (isStale) return SUSPEND;
  
  // Uniforms
  const uniform = useMemo(() => {
    if (globalBinding) return globalBinding(pipeline);
    return makeMultiUniforms(device, pipeline, globalDefs ?? [VIEW_UNIFORMS], 0);
  }, [device, pipeline, globalBinding, globalDefs]);

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

  const inspected = inspect({
    render: {
      vertexCount: 0,
      instanceCount: 0,
    },
  });
  
  const isStrip = topology === 'triangle-strip';

  if (!uniform) throw new Error();

  const isVolatileGlobal = typeof uniform?.bindGroup === 'function';

  return {
    [mode]: (passEncoder: GPURenderPassEncoder, countGeometry: (v: number, t: number) => void) => {
      const v = resolve(vertexCount || 0);
      const i = resolve(instanceCount || 0);

      const t = isStrip ? (v - 2) * i : Math.floor(v * i / 3);

      inspected.render.vertexCount = v;
      inspected.render.instanceCount = i;
      inspected.render.triangleCount = t;

      countGeometry(v * i, t);

      passEncoder.setPipeline(pipeline);

      if (globalUniforms) {
        uniform.pipe.fill(globalUniforms);
        uploadBuffer(device, uniform.buffer, uniform.pipe.data);
      }

      if (isVolatileGlobal) passEncoder.setBindGroup(0, uniform.bindGroup());
      passEncoder.setBindGroup(0, uniform.bindGroup);

      if (storage.pipe && storage.buffer) {
        storage.pipe.fill(constants);
        uploadBuffer(device, storage.buffer, storage.pipe.data);
      }

      if (storage.bindGroup) passEncoder.setBindGroup(1, storage.bindGroup);
      if (volatile.bindGroup) passEncoder.setBindGroup(2, volatile.bindGroup());

      if (indirect) passEncoder.drawIndirect(indirect.buffer, indirect.byteOffset ?? 0);
      else passEncoder.draw(v, i, 0, 0);
    },
  };
};

//setShaderLog(100);
//setTimeout(() => console.log(getShaderLog().map(s => [s.vertex.hash, s.fragment.hash])), 2000);
