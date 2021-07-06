# Use.gpu / Live

This is an experiment in reimplementing the core API of React without a target DOM. It uses a map-reduce mechanism instead to gather the contents of mounted things.

For background, see the [associated article series](https://acko.net/blog/live-headless-react/).

![public/cube.png](public/cube.png)

## Usage

**Prerequisites**: `node`, `yarn`

**Dependencies**: run `yarn install` to grab dependent packages.

**Demo app requires Chrome Canary with WebGPU enabled.**

- `yarn start` - Enable development webserver at http://localhost:8777
- `yarn build` - Build packages
- `yarn test` - Run unit tests

## Code

**Live**
 - `packages/live`: Live core (aka headless React)

**WebGPU**
 - `packages/app`: Simple test app for WebGPU.
 - `packages/components`: Demo WebGPU Live components.
 - `packages/core`: WebGPU sanity helpers
 - `packages/webgpu`: WebGPU canvas mounter
