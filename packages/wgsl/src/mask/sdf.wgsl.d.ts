declare module "@use-gpu/wgsl/mask/sdf.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const circleSDF: ParsedBundle;
  export const diamondSDF: ParsedBundle;
  export const squareSDF: ParsedBundle;
  export const triangleSDF: ParsedBundle;
  export const upSDF: ParsedBundle;
  export const downSDF: ParsedBundle;
  export const leftSDF: ParsedBundle;
  export const rightSDF: ParsedBundle;
  export default __module;
}
