import { ShaderStage } from '@webgpu/glslang';
import Glslang from './glslang-web-devel/glslang';

export type Compiler = (code: string, stage: ShaderStage) => Uint32Array;

const init = async (): Promise<Compiler> => {
  const glslang = await Glslang();
  return (code: string, stage: ShaderStage) => glslang.compileGLSL(code, stage, false);
};

export default init;