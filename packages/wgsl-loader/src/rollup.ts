import { extname } from 'path';
import { transpileWGSL } from './transpile';

export default function rollupWGSL() {
  return {
    name: '@use-gpu/wgsl-loader',
		transform(code: string, id: string) {
			const ext = extname(id);
      if (ext !== '.wgsl') return null;
      return transpileWGSL(code, id, true);
    }
  };
}
