import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { transpileWGSL } from './transpile';

type Opts = Record<string, any>;

const INCLUDE_GLOB = ['**/*.wgsl'];
const DEFAULT_EXTENSION  = 'wgsl';

const rollupWGSL = () => {

  console.log('make wgsl rollup')
  let config: any;

  return {
    name: 'wgsl-loader',
    enforce: 'pre',

    configResolved: function (resolvedConfig) {
      console.log(config = resolvedConfig);
    },

    resolveId: function (source: string, importer: string) {
      console.log('resolveId', {source, importer})
      if (source.endsWith('.wgsl')) {
        return resolve(dirname(importer), source);
      }
    },

    load: function (fullPath: string) {
      console.log('load', {fullPath})
      if (fullPath.endsWith('.wgsl')) {
        const code = readFileSync(fullPath, { encoding: "utf8" });
        return { code: transpileWGSL(code, fullPath, true), map: null };
      }
    },
  };
}

export { rollupWGSL };
export default rollupWGSL;