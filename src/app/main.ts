import {mountGPU, makeSwapChain} from '../canvas/mount';
import {makeDepthTexture} from '../core/attach';
import {cube} from './app';
import Glslang from '../glslang-web-devel/glslang';

const SWAP_CHAIN_FORMAT = "bgra8unorm" as GPUTextureFormat;
const DEPTH_STENCIL_FORMAT = "depth24plus-stencil8" as GPUTextureFormat;

const ROOT_SELECTOR = '#use-gpu';

export const main = async () => {
  console.log("main()")
  const glslang = Glslang();
  const {adapter, device, canvas} = await mountGPU(ROOT_SELECTOR);

  const swapChain = makeSwapChain(device, canvas, SWAP_CHAIN_FORMAT);

  const {width, height} = canvas;
  const depthTexture = makeDepthTexture(device, width, height, DEPTH_STENCIL_FORMAT);

  const {vertices, attributes} = cube(device);

  //const pipeline = 
}