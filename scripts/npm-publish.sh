#!/bin/bash
set -e
yarn run build
yarn publish --ignore-scripts --access public build/packages/core
yarn publish --ignore-scripts --access public build/packages/glsl-loader
yarn publish --ignore-scripts --access public build/packages/gltf
yarn publish --ignore-scripts --access public build/packages/glyph
yarn publish --ignore-scripts --access public build/packages/inspect
yarn publish --ignore-scripts --access public build/packages/layout
yarn publish --ignore-scripts --access public build/packages/live
yarn publish --ignore-scripts --access public build/packages/plot
yarn publish --ignore-scripts --access public build/packages/react
yarn publish --ignore-scripts --access public build/packages/shader
yarn publish --ignore-scripts --access public build/packages/state
yarn publish --ignore-scripts --access public build/packages/traits
yarn publish --ignore-scripts --access public build/packages/webgpu
yarn publish --ignore-scripts --access public build/packages/wgsl
yarn publish --ignore-scripts --access public build/packages/wgsl-loader
yarn publish --ignore-scripts --access public build/packages/workbench