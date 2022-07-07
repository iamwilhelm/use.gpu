import { statSync, readFileSync, writeFileSync } from 'fs';
import glob from 'glob';
import mapValues from 'lodash/mapValues';

const {version} = JSON.parse(readFileSync('./package.json').toString());

const files = glob.sync('./build/**/package.json');
for (const file of files) {
  let data = readFileSync(file).toString();
  let json = JSON.parse(data);
  json.version = version;

  if (json.main === 'src/index.ts') {
    json.main = 'src/index.js';

    const types = file.replace(/package\.json$/, 'src/types.d.ts');
    try {
      statSync(types);
      json.types = types;
    } catch (e) {};
    
    if (json.exports) {
      const convert = (value: string) => {
        value = value.replace(/(\.d)?\.ts$/, '.js');
        return value;
      };

      for (let k in json.exports) {
        let v = json.exports[k];
        if (typeof v === 'string') {
          json.exports[k] = convert(v);
        }
        if (typeof v === 'object') {
          json.exports[k] = mapValues(v, (v: string, k: string) => (k !== 'types') ? convert(v) : v);
        }
      }
    }
  }

  data = JSON.stringify(json, null, 2);
  writeFileSync(file, data);
}
