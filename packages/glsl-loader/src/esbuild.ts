import { readFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { transpileGLSL } from '@use-gpu/shader/glsl';

// Currently no options.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const glsl = (userOptions = {}) => ({
	name: 'glsl',
	setup(build: any) {
		const { minify } = build.initialOptions;
		build.onLoad({ filter: /\.glsl$/ }, async (args: any) => {
			const source = await readFile(args.path, 'utf8');
			const filename = relative(process.cwd(), args.path);

			return {
        contents: transpileGLSL(source, filename, {
          esModule: true,
          minify,
        }).output;
      };
		});
	}
});
