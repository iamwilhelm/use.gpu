import {UniformAttribute, UniformType} from '../core/types';

import {mountGPU, makeSwapChain} from '../canvas/mount';
import {makeDepthTexture, makeDepthStencilState, makeDepthStencilAttachment} from '../core/depth';
import {makeColorState, makeColorAttachment} from '../core/color';
import {makeVertexBuffers, makeUniformBuffer} from '../core/buffer';
import {makeUniformBindings, makeUniformLayout, makeLayoutData, fillLayoutData} from '../core/uniform';
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

  const pipelineDesc: GPURenderPipelineDescriptor = {
    vertexStage:   makeShaderStage(device, makeShader(vertexShader)),
    fragmentStage: makeShaderStage(device, makeShader(fragmentShader)),
    primitiveTopology,
    depthStencilState,
    vertexState: {
      indexFormat: cube.indexFormat,
      vertexBuffers: cube.attributes,
    },
    colorStates,
  };

  const pipeline = device.createRenderPipeline(pipelineDesc);

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments,
    depthStencilAttachment,
  };

  const layout = makeUniformLayout(VIEW_UNIFORMS);
  const data = makeLayoutData(layout, 1);
  
  const buffer = makeUniformBuffer(device, data);
  const entries = makeUniformBindings([{resource: {buffer}}]);
  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries,
  });
}