import { mat4, vec3 } from 'gl-matrix';

import { UniformAttribute, UniformType } from '../core/types';

import { mountGPU, makeSwapChain } from '../canvas/mount';
import { makeDepthTexture, makeDepthStencilState, makeDepthStencilAttachment } from '../core/depth';
import { makeColorState, makeColorAttachment } from '../core/color';
import { makeVertexBuffers, makeUniformBuffer, uploadBuffer } from '../core/buffer';
import { makeUniforms, makeUniformBindings } from '../core/uniform';
import { makeShader, makeShaderStage } from '../core/pipeline';
import { PROJECTION_UNIFORMS, VIEW_UNIFORMS, makeProjectionMatrix, makeOrbitMatrix } from '../camera/camera';

import GLSL from './glsl';
import {makeCube} from './cube';

import vertexShader from './glsl/vertex.glsl';
import fragmentShader from './glsl/fragment.glsl';

const SWAP_CHAIN_FORMAT = "bgra8unorm" as GPUTextureFormat;
const DEPTH_STENCIL_FORMAT = "depth24plus-stencil8" as GPUTextureFormat;
const BACKGROUND_COLOR = [0.1, 0.2, 0.3, 1.0] as GPUColor;

const DEFAULT_CAMERA = {
  fov: Math.PI / 3,
  near: 0.01,
  far: 100,
};

const ROOT_SELECTOR = '#use-gpu';

const UNIFORMS: UniformAttribute[] = [
  ...PROJECTION_UNIFORMS,
  ...VIEW_UNIFORMS,
];

export const main = async () => {
  const compileGLSL = await GLSL();
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


  const pipelineDesc: GPURenderPipelineDescriptor = {
    vertexStage:   makeShaderStage(device, makeShader(compileGLSL(vertexShader, 'vertex'))),
    fragmentStage: makeShaderStage(device, makeShader(compileGLSL(fragmentShader, 'fragment'))),
    primitiveTopology,
    depthStencilState,
    vertexState: {
      indexFormat: cube.indexFormat,
      vertexBuffers: cube.attributes,
    },
    colorStates,
  };
  const pipeline = device.createRenderPipeline(pipelineDesc);

  const {layout, data, fill} = makeUniforms(UNIFORMS);
  const buffer = makeUniformBuffer(device, data);
  const entries = makeUniformBindings([{resource: {buffer}}]);
  
  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries,
  });

  const updateFrameState = (device: GPUDevice) => {
    const {fov, near, far} = DEFAULT_CAMERA;
    const phi = 0.6;
    const theta = 0.4;
    
    const uniforms = {
      projectionMatrix: makeProjectionMatrix(width, height, fov, near, far),
      viewMatrix: makeOrbitMatrix(5, phi, theta),
    };
    
    fill(uniforms);
    uploadBuffer(device, buffer, data);
  };

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments,
    depthStencilAttachment,
  };

  const renderFrame = (device: GPUDevice) => {
    colorAttachments[0].attachment = swapChain
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
