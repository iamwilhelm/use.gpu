const fs = require('fs');

const exists = (path) => {
  try {
    const stat = fs.statSync(path);
    return true;
  } catch (e) {}
  return false;
};

module.exports = {
  "entryPoints": [
    "./packages/core/src/index.ts",
    "./packages/gltf/src/index.ts",
    "./packages/live/src/index.ts",
    "./packages/react/src/index.ts",
    "./packages/shader/wgsl/index.ts",
    "./packages/state/src/index.ts",
    "./packages/text/src/index.ts",
    "./packages/webgpu/src/index.ts",
    "./packages/workbench/src/index.ts",
  ],
  "out": "docs",
}

