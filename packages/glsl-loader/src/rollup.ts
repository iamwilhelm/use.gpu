import { extname } from 'path';
import { transpileGLSL } from './transpile';

export default function rollupGLSL() {
  return {
    name: '@use-gpu/glsl-loader',
		transform(code: string, id: string) {
			const ext = extname(id);
      if (ext !== '.glsl') return null;
      return transpileGLSL(code, id, true);
    }
  };
}
