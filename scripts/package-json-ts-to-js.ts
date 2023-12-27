import { statSync, readFileSync, writeFileSync } from 'fs';
import glob from 'glob';
import mapValues from 'lodash/mapValues';

const pkg = process.env.NPM_PACKAGE;
if (pkg == null) {
  console.log("Can't build package.json - NPM_PACKAGE not set");
  process.exit(1);
}

const files = glob.sync(`../../build/packages/${pkg}/package.json`);
for (const file of files) {
  let data = readFileSync(file).toString();
  let json = JSON.parse(data);

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
