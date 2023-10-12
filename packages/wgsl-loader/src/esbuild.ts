import { readFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { transpileWGSL } from '@use-gpu/shader/wgsl';

// Currently no options.
export const wgsl = (userOptions = {}) => ({
	name: 'wgsl',
	setup(build: any) {
		const { minify } = build.initialOptions;
		build.onLoad({ filter: /\.wgsl$/ }, async (args: any) => {
			let source = await readFile(args.path, 'utf8');
			let filename = relative(process.cwd(), args.path);

			return { contents: transpileWGSL(source, filename, true, minify) };
		});
	}
});
