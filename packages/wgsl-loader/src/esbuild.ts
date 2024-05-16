import { readFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { transpileWGSL } from '@use-gpu/shader/wgsl';

// Currently no options.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const wgsl = (userOptions = {}) => ({
	name: 'wgsl',
	setup(build: any) {
		const { minify } = build.initialOptions;
		build.onLoad({ filter: /\.wgsl$/ }, async (args: any) => {
			const source = await readFile(args.path, 'utf8');
			const filename = relative(process.cwd(), args.path);

			return { contents: transpileWGSL(source, filename, true, minify) };
		});
	}
});
