declare module "@use-gpu/wgsl/mask/filtered.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getFilteredFragment: ParsedBundle;
  export const getFilteredTexture: ParsedBundle;
  export default __module;
}
