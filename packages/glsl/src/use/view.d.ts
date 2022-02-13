declare module "@use-gpu/glsl/use/view.glsl" {
  type ParsedBundle = import('@use-gpu/shader/glsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const worldToView: ParsedBundle;
  export const viewToClip: ParsedBundle;
  export const worldToClip: ParsedBundle;
  export const clipToScreen3D: ParsedBundle;
  export const screenToClip3D: ParsedBundle;
  export const worldToClip3D: ParsedBundle;
  export const getPerspectiveScale: ParsedBundle;
  export const viewUniforms: ParsedBundle;
  export const ViewUniforms: ParsedBundle;
  export default __module;
}
