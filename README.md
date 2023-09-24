# Use.GPU

A set of **declarative, reactive WebGPU legos**. Compose graphs, meshes and shaders on the fly.

It's a **stand-alone Typescript+Rust/WASM library** with its own React-like run-time. If you're familiar with React, you will feel right at home.

It has a built-in **shader linker and binding generator**, which means a lot of the tedium of raw GPU programming is eliminated, without compromising on flexibility.

- [**Documentation**](https://usegpu.live)
- [**Demos**](https://usegpu.live/demo/index.html)

----

Use.GPU is in the **alpha stage**. Don't expect production-quality code or docs.

----

The library offers components at different levels of abstraction:
- All-in 2D/3D plotting (axes, grids, curves, labels, ...)
- Data-driven geometry layers (lines, points, text, ...)
- Raw rendering tools (passes, render-to-texture, ...)

This enables completely free-form tinkering for any graphics skill level.

Use.GPU has an incremental architecture, which updates with minimal recomputation. This is done by embracing effect-based programming, with React-like memoization hooks. The result is a program that always has the same state you'd get if it was run entirely from scratch.

**Questions? Join Use.GPU Discord**: https://discord.gg/WxtZ28aUC3

## Repo Tools

- `yarn start` - Run demo app at http://localhost:8777
- `yarn build` - Build packages
- `yarn test` - Run unit tests

**Quick Start**:

This repo includes a configuration for [Gitpod](https://www.gitpod.io/), which is a cloud dev environment similar to Github Codespaces. Gitpod provides a free tier of service and can be launched directly from the Gitlab UI. The Gitpod environment is preconfigured with all necessary dependencies, and will automatically run the demo app when launched.

* In Gitlab, use the dropdown next to "Web IDE", near the Clone button, to select Gitpod.

**Prerequisites**: `node`, `yarn`, `rust`, `wasm-pack`

- `node`: https://nodejs.org/en/
- `yarn`: https://yarnpkg.com/getting-started/install
- `rust`: https://www.rust-lang.org/tools/install
- `wasm-pack`: https://rustwasm.github.io/wasm-pack/installer/

**Dependencies**: 
- run `yarn install` to grab dependent packages, and run code generation for the lib.

See [Contributing](https://usegpu.live/docs/contributing) for some orientation.
