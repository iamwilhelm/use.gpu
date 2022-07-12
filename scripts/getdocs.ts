import {writeFileSync} from 'fs';
import {gatherMany} from "./getdocs-ts";

const OUTPUT_FILE = './build/docs.json';

const packages = ['core', 'gltf', 'glsl-loader', 'inspect', 'layout', 'live', 'plot', 'shader', 'state', 'text', 'traits', 'webgpu', 'wgsl-loader'];
//'react', 'workbench';

const opts = packages.map(pkg => ({filename: `./packages/${pkg}/src/index.ts`}));

const map: Record<string, any> = {};

const output = gatherMany(opts);
output.map((items, i) => {
  map['@use-gpu/' + packages[i]] = items;
})

const json = JSON.stringify(map, null, 2);
writeFileSync(OUTPUT_FILE, json);
