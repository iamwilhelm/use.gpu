import { createFilter } from '@rollup/pluginutils';
import { transpileWGSL } from '@use-gpu/shader/wgsl';
import MagicString from 'magic-string';

export const wgsl = (userOptions = {}) => {
  const options = Object.assign(
      {
          exclude: [],
          include: [
              '**/*.wgsl'
          ],
      },
      userOptions
  );

  const filter = createFilter(options.include, options.exclude);

  return {
    name: '@use-gpu/wgsl-loader',

    transform(source: string, id: string) {
      if (!filter(id)) return;

      const code = transpileWGSL(source, id, true);
      const magicString = new MagicString(code);

      const result = magicString.toString();
      return { code: result, map: { mappings: '' }};
    }
  };
}

export default wgsl;
