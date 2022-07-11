import { createFilter } from 'rollup-pluginutils';
import { transpileWGSL } from './transpile';
import MagicString from 'magic-string';

export const wgsl = (userOptions = {}) => {
  const options = Object.assign(
      {
          include: [
              '**/*.wgsl'
          ]
      },
      userOptions
  );

  const filter = createFilter(options.include, options.exclude);

	return {
		name: '@use-gpu/wgsl-loader',

		transform(source, id) {
			if (!filter(id)) return;

			const code = transpileWGSL(code, source, true);
			const magicString = new MagicString(code);

			let result = { code: magicString.toString() };
      return { code: result, map: { mappings: '' }};
		}
	};
}

export default wgsl;
