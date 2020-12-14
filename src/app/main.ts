import { mat4, vec3 } from 'gl-matrix';

import {UniformAttribute, UniformType} from '../core/types';

import {mountGPU, makeSwapChain} from '../canvas/mount';
import {makeDepthTexture, makeDepthStencilState, makeDepthStencilAttachment} from '../core/depth';
import {makeColorState, makeColorAttachment} from '../core/color';
import {makeVertexBuffers, makeUniformBuffer} from '../core/buffer';
import {makeUniformBindings, makeUniformLayout, makeLayoutData, makeLayoutFiller} from '../core/uniform';
import {makeShader, makeShaderStage} from '../core/pipeline';

import {makeCube} from './cube';

import vertexShader from './glsl/vertex.glsl';
import fragmentShader from './glsl/fragment.glsl';

import Glslang from '../glslang-web-devel/glslang';

const SWAP_CHAIN_FORMAT = "bgra8unorm" as GPUTextureFormat;
const DEPTH_STENCIL_FORMAT = "depth24plus-stencil8" as GPUTextureFormat;
const BACKGROUND_COLOR = [0.1, 0.2, 0.3, 1.0] as GPUColor;

const ROOT_SELECTOR = '#use-gpu';

const VIEW_UNIFORMS: UniformAttribute[] = [
  {
    name: 'projectionMatrix',
    format: UniformType.mat4,
  },
  {
    name: 'viewMatrix',
    format: UniformType.mat4,
  },
];

export const main = async () => {
  const glslang = await Glslang();
  const {adapter, device, canvas} = await mountGPU(ROOT_SELECTOR);

  const swapChain = makeSwapChain(device, canvas, SWAP_CHAIN_FORMAT);
  const colorStates = [makeColorState(SWAP_CHAIN_FORMAT)];
  const colorAttachments = [makeColorAttachment(BACKGROUND_COLOR)];

  const {width, height} = canvas;
  const depthTexture = makeDepthTexture(device, width, height, DEPTH_STENCIL_FORMAT);
  const depthStencilState = makeDepthStencilState(DEPTH_STENCIL_FORMAT);
  const depthStencilAttachment = makeDepthStencilAttachment(depthTexture);

  const cube = makeCube();
  const vertexBuffers = makeVertexBuffers(device, cube.vertices);

  const primitiveTopology = "triangle-list";
  const rasterizationState = {cullMode: "back"};

  const transpileGLSL = (code: string, stage: string) => glslang.compileGLSL(code, stage);

  const pipelineDesc: GPURenderPipelineDescriptor = {
    vertexStage:   makeShaderStage(device, makeShader(transpileGLSL(vertexShader, 'vertex'))),
    fragmentStage: makeShaderStage(device, makeShader(transpileGLSL(fragmentShader, 'fragment'))),
    primitiveTopology,
    depthStencilState,
    vertexState: {
      indexFormat: cube.indexFormat,
      vertexBuffers: cube.attributes,
    },
    colorStates,
  };

  const pipeline = device.createRenderPipeline(pipelineDesc);

  const layout = makeUniformLayout(VIEW_UNIFORMS);
  const uniformData = makeLayoutData(layout, 1);
  const fillUniformData = makeLayoutFiller(layout, uniformData);
  const buffer = makeUniformBuffer(device, uniformData);

  const entries = makeUniformBindings([{resource: {buffer}}]);
  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries,
  });

  let phi = 0.0;
  let theta = 0.0;

  const makeProjectionMatrix = () => {
    const aspect = width / height;
    const matrix = mat4.create();
    mat4.perspective(matrix, Math.PI / 2, aspect, 0.01, 100.0);

    const z = mat4.create();
    mat4.translate(z, z, vec3.fromValues(0, 0, 0.5));
    mat4.scale(z, z, vec3.fromValues(1, 1, 0.5));
    mat4.multiply(matrix, z, matrix);

    return matrix;
  }

  const makeViewMatrix = () => {
    const matrix = mat4.create();
    mat4.translate(matrix, matrix, vec3.fromValues(0, 0, -5));
    mat4.rotate(matrix, matrix, 1, vec3.fromValues(theta, phi, 0));
    return matrix;
  }

  const updateFrameState = (device: GPUDevice) => {
    const uniforms = {
      projectionMatrix: makeProjectionMatrix(),
      viewMatrix: makeViewMatrix(),
    };
    
    fillUniformData(uniforms);
    console.log(new Float32Array(uniformData));
    debugger;
    device.defaultQueue.writeBuffer(buffer, 0, uniformData, 0, layout.length);
  };

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments,
    depthStencilAttachment,
  };

  const renderFrame = (device: GPUDevice) => {
    renderPassDescriptor.colorAttachments[0].attachment = swapChain
      .getCurrentTexture()
      .createView();

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.setVertexBuffer(0, vertexBuffers[0]);
    passEncoder.draw(cube.count, 1, 0, 0);
    passEncoder.endPass();

    device.defaultQueue.submit([commandEncoder.finish()]);
  }
  
  const loop = () => {
    updateFrameState(device);
    renderFrame(device);
    requestAnimationFrame(loop);
  };
  
  requestAnimationFrame(loop);
}
