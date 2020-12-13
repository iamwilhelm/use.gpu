import {Glslang} from '@webgpu/glslang';
import {ShaderLanguages, ShaderLanguage, ShaderModuleDescriptor} from './types';

const LANGUAGES = (glslang: Glslang): ShaderLanguages => ({
  [ShaderLanguage.GLSL]: {
    transform: (glsl: string, stage: any) => glslang.compileGLSL(glsl, stage, false),
  }
});

export const createShaderStage = (device: GPUDevice, descriptor: ShaderModuleDescriptor) => {
  const {code, entryPoint} = descriptor;

  const gpuDescriptor = {code} as GPUShaderModuleDescriptor;
  const module = device.createShaderModule(gpuDescriptor);

  return {module, entryPoint};
}

/*
export const makeRenderPipeline = (
  vertex: ShaderModuleDescriptor,
  fragment: ShaderModuleDescriptor,
  primitiveTopology: string,
) => {

  const pipeline = device.createRenderPipeline({
    vertexStage: createShaderStage(vertex),
    fragmentStage: createShaderStage(fragment),

    primitiveTopology,
    depthStencilState: {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: "depth24plus-stencil8",
    },
    vertexState: {
      vertexBuffers: [
        {
          arrayStride: cubeVertexSize,
          attributes: [
            {
              // position
              shaderLocation: 0,
              offset: cubePositionOffset,
              format: "float4",
            },
            {
              // color
              shaderLocation: 1,
              offset: cubeColorOffset,
              format: "float4",
            },
          ],
        },
      ],
    },

    rasterizationState: {
      cullMode: "back",
    },

    colorStates: [
      {
        format: "bgra8unorm",
      },
    ],
  });

  return pipeline;
}
*/