declare module "@use-gpu/glsl/mask/masked.glsl" {
  type ParsedBundle = import('@use-gpu/shader/glsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getMaskedFragment: ParsedBundle;
  export default __module;
}
