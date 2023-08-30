declare module "@use-gpu/wgsl/debug/line-helper.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const emitPoint: ParsedBundle;
  export const emitLine: ParsedBundle;
  export default __module;
}
