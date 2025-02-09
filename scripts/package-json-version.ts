import { statSync, readFileSync, writeFileSync } from 'fs';
import glob from 'glob';
import mapValues from 'lodash/mapValues.js';

const {version} = JSON.parse(readFileSync('../../package.json').toString());

const pkg = process.env.NPM_PACKAGE;
if (pkg == null) {
  console.log("Can't build package.json - NPM_PACKAGE not set");
  process.exit(1);
}

const files = [
  ...glob.sync(`../../build/packages/${pkg}/package.json`),
  './package.json',
];
for (const file of files) {
  let data = readFileSync(file).toString();
  let json = JSON.parse(data);

  json.version = version;

  data = JSON.stringify(json, null, 2);
  writeFileSync(file, data);
}

const targets = [
  ...glob.sync(`../../build/packages/${pkg}/package.json`),
  './package.json',
];
for (const file of targets) {
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
