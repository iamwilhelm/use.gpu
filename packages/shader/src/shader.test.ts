import GLSLModules from '@use-gpu/glsl';
import { parseGLSL } from './shader';

describe('shader', () => {
  
  const code = GLSLModules['instance/quad/vertex'];
  const parsed = parseGLSL(code);
  
});