declare module "@use-gpu/wgsl/instance/vertex/tick.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getTickV: ParsedBundle;
  export const getTickPosition: ParsedBundle;
  export default __module;
}
