import { resolve, dirname } from 'path';
import { statSync, readFileSync } from 'fs';
import { transpileWGSL } from './transpile';

type Opts = Record<string, any>;

const rollupWGSL = () => {
  return {
    name: 'wgsl-loader',
    enforce: 'pre',

    resolveId: function (source: string, importer: string) {
      if (source.endsWith('.wgsl')) {
        if (source[0] === '.') return resolve(dirname(importer), source);
        
        const npm = 'node_modules/' + source;
        try {
          statSync(npm);
          return npm;
        } catch (e) {};

        return source;
      }
    },

    load: function (fullPath: string) {
      if (fullPath.endsWith('.wgsl')) {
        fullPath = fullPath.replace(/^\/@fs\//, '');
        const code = readFileSync(fullPath, { encoding: "utf8" });
        return { code: transpileWGSL(code, fullPath, true), map: null };
      }
    },
  };
}

export { rollupWGSL };
export default rollupWGSL;