import { readFileSync, writeFileSync } from 'fs';
import glob from 'glob';

const {version} = JSON.parse(readFileSync('./package.json').toString());
const stringify = (s: string) => JSON.stringify(s.toString());

const files = glob.sync('./build/**/package.json');
for (const file of files) {
  let data = readFileSync(file).toString();
  data = data.replace(/(index)\.ts/g, '$1.js');
  data = data.replace(/(types)\.ts/g, '$1.d.ts');
  data = data.replace(/"version": "[^"]+"/, `"version": ${stringify(version)}`);
  writeFileSync(file, data);
}
