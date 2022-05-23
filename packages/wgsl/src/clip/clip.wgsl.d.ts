declare module "@use-gpu/wgsl/clip/clip.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getCombinedClip: ParsedBundle;
  export const getTransformedClip: ParsedBundle;
  export default __module;
}
