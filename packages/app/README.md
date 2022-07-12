# Use.GPU Test Bed App

This package hosts a demo app used to showcase and debug Use.GPU.

To run it, **don't `yarn install` it**. Instead just run the following commands in the `use-gpu` repo '/' root:

## Usage

- `yarn start` - Run demo app at [http://localhost:8777](http://localhost:8777)
- `yarn build` - Build packages
- `yarn test` - Run unit tests

**Prerequisites**: `node`, `yarn`, `rust`, `wasm-pack`

- `node`: [https://nodejs.org/en/](https://nodejs.org/en/)
- `yarn`: [https://yarnpkg.com/getting-started/install](https://yarnpkg.com/getting-started/install)
- `rust`: [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
- `wasm-pack`: [https://rustwasm.github.io/wasm-pack/installer/](https://rustwasm.github.io/wasm-pack/installer/)

**Dependencies**: 
- run `yarn install` to grab dependent packages, and run code generation for the lib.

**Demo app requires Chrome Dev/Canary with WebGPU enabled.**
- `chrome://flags/#enable-unsafe-webgpu`

