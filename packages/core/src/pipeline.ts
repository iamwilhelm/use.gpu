import {Glslang} from '@webgpu/glslang';
import {ShaderLanguages, ShaderLanguage, ShaderModuleDescriptor, ShaderStageDescriptor} from './types';

export const LANGUAGES = (glslang: Glslang): ShaderLanguages => ({
  [ShaderLanguage.GLSL]: {
    transform: (glsl: string, stage: any) => glslang.compileGLSL(glsl, stage, false),
  }
});

export const makeShader = (code: string, entryPoint: string = 'main'): ShaderModuleDescriptor => ({code, entryPoint});

export const makeShaderStage = (device: GPUDevice, descriptor: ShaderModuleDescriptor, extra: any = {}): ShaderStageDescriptor => {
  const {code, entryPoint} = descriptor;

  const gpuDescriptor = {code} as GPUShaderModuleDescriptor;
  const module = device.createShaderModule(gpuDescriptor);

  return {module, entryPoint, ...extra};
}
