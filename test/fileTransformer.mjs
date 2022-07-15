import * as WGSL from '../build/packages/shader/wgsl.js';
import path from 'path';

const {transpileWGSL} = WGSL;

export const process = (src, filename, config, options) => {
  return transpileWGSL(src, filename, false);
};

export default {process};
