// File generated by build.ts. Do not edit directly.
declare module '@use-gpu/glsl' {
  export const GLSLModules: Record<string, string>;
  export default GLSLModules;
}
  
declare module "@use-gpu/glsl/fragment/pbr.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export const PBR: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/glsl/geometry/line.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export const lineJoinBevel: ParsedBundle;
  export const lineJoinMiter: ParsedBundle;
  export const lineJoinRound: ParsedBundle;
  export const getLineJoin: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/glsl/geometry/quad.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getQuadIndex: ParsedBundle;
  export const getQuadUV: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/glsl/geometry/strip.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getStripIndex: ParsedBundle;
  export const getStripUV: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/glsl/instance/draw/mesh.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  
  export default __module;
}

declare module "@use-gpu/glsl/instance/draw/virtual.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  
  export default __module;
}

declare module "@use-gpu/glsl/instance/draw/wireframe-strip.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  
  export default __module;
}

declare module "@use-gpu/glsl/instance/fragment/mesh.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  
  export default __module;
}

declare module "@use-gpu/glsl/instance/fragment/solid.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  
  export default __module;
}

declare module "@use-gpu/glsl/instance/ui/fragment.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  
  export default __module;
}

declare module "@use-gpu/glsl/instance/ui/vertex.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  
  export default __module;
}

declare module "@use-gpu/glsl/instance/vertex/line.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getLineVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/glsl/instance/vertex/quad.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getQuadVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/glsl/mask/masked.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getMaskedFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/glsl/mask/passthru.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getPassThruFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/glsl/mask/point.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export const circle: ParsedBundle;
  export const diamond: ParsedBundle;
  export const square: ParsedBundle;
  export const circleOutlined: ParsedBundle;
  export const diamondOutlined: ParsedBundle;
  export const squareOutlined: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/glsl/use/light.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export const lightUniforms: ParsedBundle;
  export const LightUniforms: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/glsl/use/picking.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getPickingColor: ParsedBundle;
  export const pickingUniforms: ParsedBundle;
  export const PickingUniforms: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/glsl/use/types.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
  const __module: ParsedBundle;
  export const SolidVertex: ParsedBundle;
  export const MeshVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/glsl/use/view.glsl" {
  type ParsedBundle = import('@use-gpu/shader/types').ParsedBundle;
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
