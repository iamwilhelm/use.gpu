import { createFilter } from 'rollup-pluginutils';
import { transpileGLSL } from './transpile';
import MagicString from 'magic-string';

export const glsl = (userOptions = {}) => {
  const options = Object.assign(
      {
          include: [
              '**/*.glsl'
          ]
      },
      userOptions
  );

  const filter = createFilter(options.include, options.exclude);

	return {
		name: '@use-gpu/glsl-loader',

		transform(source, id) {
			if (!filter(id)) return;

			const code = transpileGLSL(code, source, true);
			const magicString = new MagicString(code);

			let result = { code: magicString.toString() };
      return { code: result, map: { mappings: '' }};
		}
	};
}

export default glsl;
