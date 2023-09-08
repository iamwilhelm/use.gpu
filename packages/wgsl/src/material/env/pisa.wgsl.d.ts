declare module "@use-gpu/wgsl/material/env/pisa.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const SH_DIFFUSE: ParsedBundle;
  export const SH_SPECULAR: ParsedBundle;
  export default __module;
}
