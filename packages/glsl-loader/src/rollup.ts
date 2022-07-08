import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { transpileGLSL } from './transpile';

type Opts = Record<string, any>;

const rollupGLSL = () => {
  return {
    name: 'glsl-loader',
    enforce: 'pre',

    resolveId: function (source: string, importer: string) {
      console.log('resolveId', {source, importer})
      if (source.endsWith('.glsl')) {
        if (source[0] === '.') return resolve(dirname(importer), source);
        return source;
      }
    },

    load: function (fullPath: string) {
      console.log('load', {fullPath})
      if (fullPath.endsWith('.glsl')) {
        const code = readFileSync(fullPath, { encoding: "utf8" });
        return { code: transpileGLSL(code, fullPath, true), map: null };
      }
    },
  };
}

export { rollupGLSL };
export default rollupGLSL;