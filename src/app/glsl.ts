import Glslang from '../glslang-web-devel/glslang';
import {ShaderStage} from '@webgpu/glslang';

const init = async () => {
  const glslang = await Glslang();
  return (code: string, stage: ShaderStage) => glslang.compileGLSL(code, stage, false);
};

export default init;