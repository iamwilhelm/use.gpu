# Use.GPU Test Bed App

This package is **not installable**. It hosts a demo app used to showcase and debug Use.GPU.

<span className="warning-box">
  <span className="m-icon m-icon-outlined" title="Warning">warning_amber</span>WebGPU is <a href="https://caniuse.com/webgpu">only available for developers</a>, locked behind a browser flag. A dev build of Chrome or Firefox is recommended.</a>.
</span>

- **Chrome**: enable `chrome://flags/#enable-unsafe-webgpu`.
- **Firefox**: enable `dom.webgpu.enabled`

## Usage

**To open it, run the following commands in the `use-gpu` repo root:**

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
