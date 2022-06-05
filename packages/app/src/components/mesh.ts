import { LiveComponent } from '@use-gpu/live/types';
import { ViewUniforms, UniformPipe, UniformAttribute, UniformType, VertexData, RenderPassMode, DataTexture } from '@use-gpu/core/types';
import { ViewContext, DeviceContext, PickingContext, usePickingContext } from '@use-gpu/components';
import { yeet, memo, useContext, useNoContext, useFiber, useMemo, useOne, useState, useResource, tagFunction } from '@use-gpu/live';
import {
  makeVertexBuffers, makeRawTexture, makeMultiUniforms,
  makeRenderPipeline, makeShaderModule, makeShaderBinding, makeSampler, makeTextureBinding,
  uploadBuffer, uploadDataTexture,
} from '@use-gpu/core';
import { linkBundle, bindingToModule, bundleToAttribute } from '@use-gpu/shader/wgsl';
import { useInspectable, useNativeColor } from '@use-gpu/components';

import instanceDrawMesh from '@use-gpu/wgsl/render/vertex/mesh.wgsl';
import instanceDrawMeshPick from '@use-gpu/wgsl/render/vertex/mesh-pick.wgsl';

import instanceFragmentMesh from '@use-gpu/wgsl/render/fragment/mesh.wgsl';
import instanceFragmentPickGeometry from '@use-gpu/wgsl/render/fragment/pick.wgsl';

const ID_BINDING = bundleToAttribute(instanceDrawMeshPick, 'getId');

export const MESH_UNIFORM_DEFS: UniformAttribute[] = [
  {
    name: 'lightPosition',
    format: 'vec4<f32>',
  },
  {
    name: 'lightColor',
    format: 'vec4<f32>',
  },
];

const LIGHT = [-2.5, 3, 2, 1];

export type MeshProps = {
  mesh: VertexData,
  texture: DataTexture,
  mode?: RenderPassMode,
  id?: number,
  blink?: number,
};

export const Mesh: LiveComponent<MeshProps> = memo((props: MeshProps) => {
  const {
    mesh,
    texture,
    mode = RenderPassMode.Opaque,
    id = 0,
    blink,
  } = props;

  const blinkState = !!((blink || 0) % 2);

  const device = useContext(DeviceContext);
  const {viewUniforms, viewDefs} = useContext(ViewContext);
  
  const isDebug = mode === RenderPassMode.Debug;
  const isPicking = mode === RenderPassMode.Picking;
  const {renderContext} = usePickingContext(isPicking);
  const {colorStates, depthStencilState, colorInput, colorSpace, samples} = renderContext;

  const vertexBuffers = useMemo(() =>
    makeVertexBuffers(device, mesh.vertices), [device, mesh]);

  const sourceTexture = useMemo(() => {
    const t = makeRawTexture(device, texture);
    uploadDataTexture(device, t, texture);
    return t;
  }, [device, texture]);

  const toColorSpace = useNativeColor(colorInput, colorSpace);
  const defines = {
    '@group(VIEW)': '@group(0)',
    '@binding(VIEW)': '@binding(0)',
    '@group(LIGHT)': '@group(0)',
    '@binding(LIGHT)': '@binding(1)',
    'PICKING_ID': id,
  };

  // Render shader
  const vertexShader   = isPicking ? instanceDrawMeshPick     : instanceDrawMesh;
  const fragmentShader = isPicking ? instanceFragmentPickGeometry : instanceFragmentMesh;

  const fiber = useFiber();
  const inspect = useInspectable();

  // Rendering pipeline
  const pipeline = useMemo(() => {
    const vertexLinked = linkBundle(vertexShader, {toColorSpace}, defines);
    const fragmentLinked = linkBundle(fragmentShader, {toColorSpace}, defines);

    const vertex = makeShaderModule(vertexLinked, vertexShader.hash);
    const fragment = makeShaderModule(fragmentLinked, fragmentShader.hash);
    
    inspect({vertex});
    inspect({fragment});

    return makeRenderPipeline(
      device,
      renderContext,
      vertex,
      fragment,
      {
        primitive: {
          topology: "triangle-list",
          cullMode: "back",
        },
        vertex:   {buffers: mesh.attributes},
        fragment: {},
      }
    );
  }, [device, colorStates, depthStencilState, samples, toColorSpace]);

  // Uniforms
  const [uniform, sampled] = useMemo(() => {
    const meshDefs = MESH_UNIFORM_DEFS;
    const defs = isPicking ? [viewDefs] : [viewDefs, meshDefs];
    const uniform = makeMultiUniforms(device, pipeline, defs, 0);

    let sampled;
    if (!isPicking) {
      const sampler = makeSampler(device, { });
      sampled = makeTextureBinding(device, pipeline, sampler, sourceTexture, 1);
    }

    return [uniform, sampled];
  }, [device, viewDefs, isPicking, pipeline]);

  // Return a lambda back to parent(s)
  return yeet({
    [mode]: tagFunction((passEncoder: GPURenderPassEncoder) => {
      const l = blinkState ? 1 : 0.5;

      uniform.pipe.fill(viewUniforms);
      uniform.pipe.fill({ lightPosition: LIGHT, lightColor: [l, l, l, 1] });
      uploadBuffer(device, uniform.buffer, uniform.pipe.data);

      passEncoder.setPipeline(pipeline);
      passEncoder.setBindGroup(0, uniform.bindGroup);
      if (sampled) passEncoder.setBindGroup(1, sampled);
      passEncoder.setVertexBuffer(0, vertexBuffers[0]);
      passEncoder.draw(mesh.count, 1, 0, 0);
    })
  }); 
}, 'Mesh');
