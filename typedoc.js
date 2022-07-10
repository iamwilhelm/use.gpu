module.exports = {
  "categorizeByGroup": false,
  "categoryOrder": ["Live Components", "React Components", "Traits", "Providers", "*"],
  "entryPoints": [
    "./packages/core/src/index.ts",
    "./packages/gltf/src/index.ts",
    "./packages/inspect/src/index.ts",
    "./packages/layout/src/index.ts",
    "./packages/live/src/index.ts",
    "./packages/plot/src/index.ts",
    "./packages/react/src/index.ts",
    "./packages/shader/wgsl/index.ts",
    "./packages/state/src/index.ts",
    "./packages/text/src/index.ts",
    "./packages/webgpu/src/index.ts",
    "./packages/wgsl-loader/src/index.ts",
    "./packages/workbench/src/index.ts",
  ],
  "pluginPages": {
    /*
    pages: [
        { title: 'Getting started', source: 'getting-started.md', children: [
            { title: 'Configuration', source: 'configuration.md' },
        ] },
        { title: 'Additional resources', childrenDir: 'additional-resources', children: [
            { title: 'Some cool docs', source: 'some-cool-docs.md' },
        ] },
    ],
    */
  },
  "name": "Use.GPU",
  "readme": "./md/root.md",
  "out": "docs",
}

