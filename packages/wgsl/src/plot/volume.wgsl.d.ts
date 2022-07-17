declare module "@use-gpu/wgsl/plot/volume.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getVolumeGradient: ParsedBundle;
  export default __module;
}
