import path from 'path';
import fs from 'fs';
import glob from 'glob';

const PACKAGE_JSON = './package.json';

const files = glob.sync('./src/**/*.@(ts|tsx)');
const paths = files.filter(file => !file.match(/\.test\.|\/lib\/|\/index\./));
console.log(files.length, paths.length)

// Update exports in package.json
try {
  const PKG = JSON.parse(fs.readFileSync(PACKAGE_JSON).toString());
  const name = PKG.name.split('/')[1];
  const BUILD_TARGET = '../../build/packages/' + name + '/';
  
  PKG.exports = {".": "./src/index.ts"};
  for (let path of paths) {
    const name = path.replace(/.[a-z]+$/, '');
    const ref = name.replace(/\.\/src\//, './')
    const types = name + '.d.ts';

    const target = BUILD_TARGET + types;
    console.log(target)

    try {
      const stat = fs.statSync(target);
      if (stat) {
        PKG.exports[ref] = {
          "types": types,
          "import": path,
          "require": path,
        };
      }
    } catch (e) {
      console.log(target, e)
    }
  }
  const json = JSON.stringify(PKG, null, 2);
  fs.writeFileSync(PACKAGE_JSON, json);
} catch (e) {
  console.log(e)
}
