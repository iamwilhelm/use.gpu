import fs from 'fs';
import glob from 'glob';

const files = glob.sync('./build/**/package.json');
for (const file of files) {
  let data = fs.readFileSync(file).toString();
  data = data.replace(/(index)\.ts/g, '$1.js')
  data = data.replace(/(types)\.ts/g, '$1.d.ts')
  fs.writeFileSync(file, data);
}
