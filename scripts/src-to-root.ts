import { statSync, readFileSync, writeFileSync } from 'fs';
import glob from 'glob';
import mapValues from 'lodash/mapValues';

const pkg = process.argv[2];
if (pkg == null) {
  process.exit();
}

const {version} = JSON.parse(readFileSync('../../package.json').toString());
const convert = (s: string) => s.replace(/(^|\.?\/)src\//, './');

const files = glob.sync(`../../build/packages/${pkg}/package.json`);
for (const file of files) {
  let data = readFileSync(file).toString();
  let json = JSON.parse(data);
  json.version = version;

  if (json.main.match(/(^|\/)src\//)) {
    console.log(json.name, json.main, convert(json.main), file);

    json.main = convert(json.main);
    if (json.types) json.types = convert(json.types);

    if (json.exports) {
      for (let k in json.exports) {
        let v = json.exports[k];
        if (typeof v === 'string') {
          json.exports[k] = convert(v);
        }
        if (typeof v === 'object') {
          json.exports[k] = mapValues(v, (v: string, k: string) => convert(v));
        }
      }
    }
  }

  data = JSON.stringify(json, null, 2);
  writeFileSync(file, data);
}
