import { createFilter } from '@rollup/pluginutils';
import { transpileGLSL } from '@use-gpu/shader/glsl';

export const glsl = (userOptions = {}) => {
  const options = Object.assign(
      {
          exclude: [],
          include: [
              '**/*.glsl'
          ],
      },
      userOptions
  );

  const filter = createFilter(options.include, options.exclude);

  return {
    name: '@use-gpu/glsl-loader',

    transform(source: string, id: string) {
      if (!filter(id)) return;

      const code = transpileGLSL(source, id, { esModule: true, minify: true }).output;
      return { code, map: { mappings: '' }};
    }
  };
}

export default glsl;
