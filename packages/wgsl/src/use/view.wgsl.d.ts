declare module "@use-gpu/wgsl/use/view.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const viewUniforms: ParsedBundle;
  export const getViewPosition: ParsedBundle;
  export const getViewResolution: ParsedBundle;
  export const getViewSize: ParsedBundle;
  export const getViewNearFar: ParsedBundle;
  export const worldToView: ParsedBundle;
  export const viewToClip: ParsedBundle;
  export const worldToClip: ParsedBundle;
  export const toClip3D: ParsedBundle;
  export const worldToClip3D: ParsedBundle;
  export const clip3DToScreen: ParsedBundle;
  export const screenToClip3D: ParsedBundle;
  export const clipLineIntoView: ParsedBundle;
  export const getWorldScale: ParsedBundle;
  export const getPerspectiveScale: ParsedBundle;
  export default __module;
}
