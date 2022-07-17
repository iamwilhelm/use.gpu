import { readFileSync } from "fs";

const data = readFileSync('./dist/import.bundle.js').toString();
if (data.indexOf('__WGSL_LOADER_GENERATED') === -1) {
  console.error("No WGSL loader generated .wgsl detected");
  process.exit(1);
}
console.log("WGSL Ok!")
