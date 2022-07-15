import { createFilter } from 'rollup-pluginutils';
import { transpileGLSL } from '@use-gpu/shader/glsl';
import MagicString from 'magic-string';

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

			const code = transpileGLSL(source, id, true);
			const magicString = new MagicString(code);

			let result = { code: magicString.toString() };
      return { code: result, map: { mappings: '' }};
		}
	};
}

export default glsl;
