declare module "@use-gpu/wgsl/pmrem/pmrem.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const sampleBlur: ParsedBundle;
  export default __module;
}
