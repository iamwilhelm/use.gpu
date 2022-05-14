declare module "@use-gpu/wgsl/plot/surface.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getSurfaceIndex: ParsedBundle;
  export const getSurfaceNormal: ParsedBundle;
  export default __module;
}
