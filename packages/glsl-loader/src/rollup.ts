import { join, dirname, extname } from 'path';
import { readFileSync } from 'fs';
import { transpileGLSL } from './transpile';

const rollupGLSL = () => {
  return {
    name: 'glsl-loader',
    
    resolveId: (filePath: string, importer: string) => {
      console.log('resolveId', {filePath, importer})
      var dir = importer == null
        ? process.cwd()
        : dirname(importer);

      var fullPath = join(dir, filePath);

      if (extname(filePath) === ".glsl") {
        return fullPath;
      }
      return null;
    },

    load: (fullPath: string) => {
      console.log('load', {fullPath})
      if (extname(fullPath) === ".glsl") {
        const code = readFileSync(fullPath, { encoding: "utf8" });
        return transpileGLSL(code, fullPath, true);
      }
    },
  };
}

export { rollupGLSL };
export default rollupGLSL;