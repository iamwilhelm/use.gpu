import {statSync, readFileSync, writeFileSync} from 'fs';
import {dirname, basename, join} from 'path';
import {gatherMany} from "./getdocs-ts";
import glob from 'glob';

const OUTPUT_FILE = './build/docs.json';

const DOCS_REPO = '../use.gpu-site';
const DOCS_FILE = '../use.gpu-site/docs/ts-docs.json';
const DOCS_PKG  = '../use.gpu-site/docs/packages';

let packages = ['core', 'gltf', 'glyph', 'inspect', 'layout', 'live', 'plot', 'map', 'react', 'state', 'traits', 'webgpu', 'workbench'];
let files = [
  ...packages.map(pkg => [pkg, [`./packages/${pkg}/src/index.ts`]]),
  ['app', ['./packages/app/src/index.tsx']],
  ['shader', ['./packages/shader/src/docs.ts']],
] as [string, string[]][];

const map: Record<string, any> = {};

// Gather docs one package at a time to prevent TS crash / stack error
for (const [pkg, filenames] of files) {
  const id = '@use-gpu/' + pkg;
  if (!map[id]) map[id] = {};

  const many = gatherMany(filenames.map((filename: string) => ({filename})));
  for (const items of many) Object.assign(map[id], items);
}

const data = map;
const {version} = JSON.parse(readFileSync('./package.json').toString());
data.meta = {version};

const json = JSON.stringify(data, null, 2);
writeFileSync(OUTPUT_FILE, json);

// Copy package.jsons / README.md to use.gpu-site repo
try {
  statSync(DOCS_REPO);
  writeFileSync(DOCS_FILE, json);

  const packageJsons = glob.sync('./build/packages/*/package.json');
  for (const file of packageJsons) {
    const pkg = basename(dirname(file));
    const target = join(DOCS_PKG, pkg + '.json');
    writeFileSync(target, readFileSync(file));
  }

  const readmes = glob.sync('./build/packages/*/README.md');
  for (const file of readmes) {
    const pkg = basename(dirname(file));
    const target = join(DOCS_PKG, pkg + '.readme');
    writeFileSync(target, readFileSync(file));
  }
} catch (e) {
  console.error(e);
  process.exit(1)
}
