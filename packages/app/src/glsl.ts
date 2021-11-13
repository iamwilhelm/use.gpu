import { ShaderStage } from '@webgpu/glslang';
import { ShaderCompiler } from '@use-gpu/core/types';
import Glslang from './glslang-web-devel/glslang';

export type Compiler = (code: string, stage: ShaderStage) => Uint32Array;

const DBG = true;

const init = async (): Promise<ShaderCompiler> => {
  const glslang = await Glslang();
  return (code: string, stage: ShaderStage) => {
    if (DBG) {
      const lines = code.split("\n").map((line, i) => `${i+1}: ${line}`);
      console.info(lines.join("\n"));
    }
    return glslang.compileGLSL(code, stage, false);
  }
};

export default init;