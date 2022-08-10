import * as path from 'path';
import { readFileSync, statSync, writeFileSync } from 'fs';
import glob from 'glob';
import { loadModule } from '@use-gpu/shader/glsl';

type Glob = { arg: string, pattern: string };

const args = process.argv.slice(2);
const globs = [] as Glob[];

for (let i = 0; i < args.length; ++i) {
  const arg = args[i];
  const d = statSync(arg).isDirectory();
  if (d) globs.push({arg, pattern: arg + '/**/*.wgsl'});
  else globs.push({arg, pattern: arg});
}

if (!globs.length) {
  console.log(`Usage: ./node_modules/.bin/glsl-tsgen [file or *.glsl]\n`);
  process.exit();
}

for (const {pattern, arg} of globs) {
  const files = glob.sync(pattern);
  for (const file of files) {
    const core = readFileSync(file).toString();
    const module = loadModule(core, file);
    const symbols = (module.table.visibles ?? []).map((s: string) => `export declare const ${s}: ParsedBundle;`);
    
    const abs = path.resolve(file);
    const dts = `type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
declare const __module: ParsedBundle;
${symbols.join("\n  ")}
export default __module;
`;
    console.log('Writing ' + file + '.d.ts');

    const dtsFile = abs.replace(/\.glsl$/, '.glsl.d.ts');
    writeFileSync(dtsFile, dts);
  }
}
