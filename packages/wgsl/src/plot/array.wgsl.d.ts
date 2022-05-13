declare module "@use-gpu/wgsl/plot/array.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const unpackIndex: ParsedBundle;
  export const packIndex: ParsedBundle;
  export default __module;
}
