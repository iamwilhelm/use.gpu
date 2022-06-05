// File generated by build.ts. Do not edit directly.
declare module '@use-gpu/wgsl' {
  export const WGSLModules: Record<string, string>;
  export default WGSLModules;
}
  
declare module "@use-gpu/wgsl/fragment/pbr.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const PBR: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/fragment/sdf-2d.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const SDF: ParsedBundle;
  export const getUVScale: ParsedBundle;
  export const getBoxSDF: ParsedBundle;
  export const getBorderBoxSDF: ParsedBundle;
  export const getRoundedBorderBoxSDF: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/anchor.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getLineAnchor: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/arrow.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getArrowSize: ParsedBundle;
  export const getArrowCorrection: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/face.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getFaceSegment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/line.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const lineJoinBevel: ParsedBundle;
  export const lineJoinMiter: ParsedBundle;
  export const lineJoinRound: ParsedBundle;
  export const getLineJoin: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/quad.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getQuadIndex: ParsedBundle;
  export const getQuadUV: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/segment.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getLineSegment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/strip.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getStripIndex: ParsedBundle;
  export const getStripUV: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/trim.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getLineTrim: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/fragment/shaded.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getShadedFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/fragment/ui.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getUIFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/identity.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getIndex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/interleave.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getIndex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/arrow.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getArrowVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/face.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getFaceVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/full-screen.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getFullScreenVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/label.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getLabelVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/line.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getLineVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/quad.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getQuadVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/tick.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getTickPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/ui-rectangle.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getUIRectangleVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/layout/clip.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getCombinedClip: ParsedBundle;
  export const getTransformedClip: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/layout/layout.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getLayoutPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/layout/scroll.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getScrolledPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/layout/shift.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getShiftedRectangle: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/mask/masked.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getMaskedFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/mask/passthru.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getPassThruFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/mask/point.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const circle: ParsedBundle;
  export const diamond: ParsedBundle;
  export const square: ParsedBundle;
  export const circleOutlined: ParsedBundle;
  export const diamondOutlined: ParsedBundle;
  export const squareOutlined: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/mask/textured.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getTextureFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/pbr.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const applyPBRMaterial: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/array.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const unpackIndex: ParsedBundle;
  export const packIndex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/axis.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getAxisPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/grid.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getGridPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/scale.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getScalePosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/surface.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getSurfaceIndex: ParsedBundle;
  export const getSurfaceNormal: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/mesh.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/pick.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/shaded.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/solid.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/ui.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/vertex/mesh-pick.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/vertex/mesh.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/vertex/virtual-pick.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/vertex/virtual-shaded.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/vertex/virtual-solid.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/vertex/virtual-ui.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/wireframe/wireframe-list.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getWireframeListVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/wireframe/wireframe-strip.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getWireframeStripVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/transform/cartesian.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const getCartesianPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/use/color.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const premultiply: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/use/gamma.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const toLinear: ParsedBundle;
  export const toLinear2: ParsedBundle;
  export const toLinear3: ParsedBundle;
  export const toLinear4: ParsedBundle;
  export const toGamma: ParsedBundle;
  export const toGamma2: ParsedBundle;
  export const toGamma3: ParsedBundle;
  export const toGamma4: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/use/light-old.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const lightUniforms: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/use/light.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  
  export default __module;
}

declare module "@use-gpu/wgsl/use/types.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const PickVertex: ParsedBundle;
  export const SolidVertex: ParsedBundle;
  export const ShadedVertex: ParsedBundle;
  export const UIVertex: ParsedBundle;
  export const MeshVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/use/view.wgsl" {
  type ParsedBundle = import('@use-gpu/shader/wgsl/types').ParsedBundle;
  const __module: ParsedBundle;
  export const viewUniforms: ParsedBundle;
  export const getViewPosition: ParsedBundle;
  export const getViewResolution: ParsedBundle;
  export const getViewSize: ParsedBundle;
  export const getViewNearFar: ParsedBundle;
  export const to3D: ParsedBundle;
  export const worldToView: ParsedBundle;
  export const viewToClip: ParsedBundle;
  export const worldToClip: ParsedBundle;
  export const toClip3D: ParsedBundle;
  export const worldToClip3D: ParsedBundle;
  export const clip3DToScreen: ParsedBundle;
  export const screenToClip3D: ParsedBundle;
  export const clipLineIntoView: ParsedBundle;
  export const getViewScale: ParsedBundle;
  export const getWorldScale: ParsedBundle;
  export const getPerspectiveScale: ParsedBundle;
  export const applyZBias3: ParsedBundle;
  export const applyZBias: ParsedBundle;
  export default __module;
}
