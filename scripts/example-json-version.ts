import { statSync, readFileSync, writeFileSync } from 'fs';
import glob from 'glob';
import mapValues from 'lodash/mapValues';

const {version} = JSON.parse(readFileSync('./package.json').toString());

const files = [
  './examples/ts-webpack/package.json',
];

for (const file of files) {
  let data = readFileSync(file).toString();
  let json = JSON.parse(data);

  const {dependencies} = json;
  if (dependencies) {
    for (const k in dependencies) {
      if (k.match(/^@use-gpu\//)) {
        dependencies[k] = '^' + version;
      }
    }
  }

  data = JSON.stringify(json, null, 2);
  writeFileSync(file, data);
}
