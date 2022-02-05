export * from '../types';

export type ShaderCompiler = (code: string, stage: string) => Uint8Array | Uint32Array;
