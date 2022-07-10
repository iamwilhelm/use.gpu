module.exports = {
  "categorizeByGroup": true,
  "categoryOrder": ["Live Components", "React Components", "Component", "Components", "Traits", "Providers", "*"],
  "entryPoints": [
    "./packages/core",
    "./packages/gltf",
    "./packages/inspect",
    "./packages/layout",
    "./packages/live",
    "./packages/plot",
    "./packages/react",
    "./packages/shader",
    "./packages/state",
    "./packages/text",
    "./packages/traits",
    "./packages/webgpu",
    "./packages/wgsl-loader",
    "./packages/workbench",
  ],
  "entryPointStrategy": "packages",
  /*
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
  },
  */
  "name": "Use.GPU",
  "readme": "./md/root.md",
  "out": "docs",
}

