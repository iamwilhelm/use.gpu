/** @module Shader */
import GLSL from './glsl';
import WGSL from './wgsl';

export const GLSLLinker = GLSL;
export const WGSLLinker = WGSL;

export { getBundleHash, getBundleKey, getBundleEntry, getBundleLabel, toBundle, toModule } from './util';
export * from './types';
