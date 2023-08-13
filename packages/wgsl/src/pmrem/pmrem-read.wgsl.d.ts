declare module "@use-gpu/wgsl/pmrem/pmrem-read.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const sampleCubeMap: ParsedBundle;
  export default __module;
}
