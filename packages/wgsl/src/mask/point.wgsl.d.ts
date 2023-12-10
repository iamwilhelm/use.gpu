declare module "@use-gpu/wgsl/mask/point.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getFilledMask: ParsedBundle;
  export const getOutlinedMask: ParsedBundle;
  export default __module;
}
