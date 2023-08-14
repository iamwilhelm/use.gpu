declare module "@use-gpu/wgsl/compute/memo2.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const memoSample: ParsedBundle;
  export default __module;
}
