// File generated by build.ts. Do not edit directly.
  
declare module "@use-gpu/wgsl/app/fragment/mesh.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const lightUniforms: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/app/vertex/mesh-pick.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/app/vertex/mesh.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/codec/f16.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const toF16u: ParsedBundle;
  export const fromF16u: ParsedBundle;
  export const toF16u4: ParsedBundle;
  export const fromF16u4: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/codec/octahedral.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const encodeOctahedral: ParsedBundle;
  export const decodeOctahedral: ParsedBundle;
  export const wrapOctahedral: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/codec/rgbm.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const decodeRGBM16: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/compute/memo2.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const memoSample: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/contour/fit-linear.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/contour/fit-quadratic.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/contour/scan.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/contour/solve.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const approx3x3: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/contour/types.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const IndirectDrawMetaAtomic: ParsedBundle;
  export const IndirectDrawMeta: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/debug/line-helper.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const emitPoint: ParsedBundle;
  export const emitLine: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/fragment/aces.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const tonemapACES: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/fragment/gain.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const gainColor: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/fragment/lod-bias.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getLODBiasedTexture: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/fragment/pbr.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const PBRParams: ParsedBundle;
  export const PBR: ParsedBundle;
  export const IBLResult: ParsedBundle;
  export const IBL: ParsedBundle;
  export const environmentBRDF: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/fragment/sdf-2d.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const SDF: ParsedBundle;
  export const getUVScale: ParsedBundle;
  export const getBoxSDF: ParsedBundle;
  export const getBorderBoxSDF: ParsedBundle;
  export const getRoundedBorderBoxSDF: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/anchor.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getLineAnchor: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/arrow.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getArrowSize: ParsedBundle;
  export const getArrowCorrection: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/face.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getFaceSegment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/line.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const lineJoinBevel: ParsedBundle;
  export const lineJoinMiter: ParsedBundle;
  export const lineJoinRound: ParsedBundle;
  export const getLineJoin: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/normal.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getOrthoVector: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/quad.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getQuadIndex: ParsedBundle;
  export const getQuadUV: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/segment.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getLineSegment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/strip.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getStripIndex: ParsedBundle;
  export const getStripUV: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/geometry/trim.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getLineTrim: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/fragment/deferred-emissive.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getDeferredEmissiveFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/fragment/deferred-light.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getDeferredLightFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/fragment/lit.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getLitFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/fragment/solid.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getSolidFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/fragment/ui.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getUIFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/identity.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getIndex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/index/anchor.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getAnchorIndex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/index/face.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getInstancedFaceIndex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/index/interleave.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getInterleaveIndex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/index/repeat.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getInstanceRepeatIndex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/surface/material.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getMaterialSurface: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/surface/normal-map.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getNormalMapSurface: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/surface/solid.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getSolidSurface: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/arrow.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getArrowVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/deferred-light.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getDeferredLightVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/dual-contour.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getDualContourVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/face.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getFaceVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/full-screen.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getFullScreenVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/instanced.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getInstancedVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/label.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getLabelVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/line.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getLineVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/quad.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getQuadVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/tick.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getTickPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/instance/vertex/ui-rectangle.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getUIRectangleVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/layout/clip.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getCombinedClip: ParsedBundle;
  export const getTransformedClip: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/layout/layout.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getLayoutPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/layout/rectangle.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const transformRectangle: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/layout/scroll.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getScrolledPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/layout/shift.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getShiftedRectangle: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/mask/masked.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getMaskedColor: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/mask/passthru.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getPassThruColor: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/mask/point.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getFilledMask: ParsedBundle;
  export const getOutlinedMask: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/mask/scissor.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getScissorColor: ParsedBundle;
  export const isScissored: ParsedBundle;
  export default __module;
}

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

declare module "@use-gpu/wgsl/mask/textured.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getTextureColor: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/basic-material.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getBasicMaterial: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/env/field.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const SH_DIFFUSE: ParsedBundle;
  export const SH_SPECULAR: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/env/park.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const SH_DIFFUSE: ParsedBundle;
  export const SH_SPECULAR: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/env/pisa.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const SH_DIFFUSE: ParsedBundle;
  export const SH_SPECULAR: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/env/road.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const SH_DIFFUSE: ParsedBundle;
  export const SH_SPECULAR: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/light.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const applyLight: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/lights-default-env.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getDefaultEnvironment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/lights-default.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const applyLights: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/lights.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const applyLights: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/pbr-apply.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const applyPBRMaterial: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/pbr-default.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getDefaultPBRMaterial: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/pbr-environment.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const applyPBREnvironment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/material/pbr-material.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getPBRMaterial: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/array.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const unpackIndex: ParsedBundle;
  export const packIndex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/axis.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getAxisPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/grid-auto.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getGridAutoState: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/grid.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getGridPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/loop.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const loopSurface: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/scale.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getScalePosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/surface-normal.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getSurfaceNormal: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/surface.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getSurfaceIndex: ParsedBundle;
  export const getSurfaceUV: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/plot/volume.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getVolumeGradient: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/pmrem/pmrem-blur.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const pmremBlur: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/pmrem/pmrem-copy.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const pmremCopy: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/pmrem/pmrem-diffuse-render.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const pmremDiffuseRender: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/pmrem/pmrem-diffuse-sh.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const pmremDiffuseSH: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/pmrem/pmrem-init.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const pmremInit: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/pmrem/pmrem-read.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const sampleEnvMap: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/present/fragment.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getScreenFragment: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/present/mask.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getSlideMask: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/present/motion.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getSlideMotion: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/present/screen.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getScreenVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/deferred-light.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/deferred-shaded.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export const mainWithDepth: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/deferred-solid.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/depth-copy.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/depth-frag.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/depth.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/pick.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/shaded.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export const mainWithDepth: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/solid.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/fragment/ui.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/pick.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getPickingID: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/sample/cube-to-omni.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getCubeToOmniSample: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/sample/equi-to-cube.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getEquiToCubeSample: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/vertex/virtual-depth.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export const mainWithDepth: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/vertex/virtual-light.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/vertex/virtual-pick.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/vertex/virtual-shaded.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/vertex/virtual-solid.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/vertex/virtual-ui.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/wireframe/wireframe-indirect.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const main: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/wireframe/wireframe-list.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getWireframeListVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/render/wireframe/wireframe-strip.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getWireframeStripVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/shadow/directional.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const applyDirectionalShadow: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/shadow/point.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const applyPointShadow: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/transform/cartesian.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getCartesianPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/transform/diff-chain.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getChainDifferential: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/transform/diff-epsilon.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getEpsilonDifferential: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/transform/diff-matrix.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getMatrixDifferential: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/transform/instance.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const loadInstance: ParsedBundle;
  export const getTransformMatrix: ParsedBundle;
  export const getNormalMatrix: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/transform/polar.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getPolarPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/transform/scissor.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getScissorLevel: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/transform/spherical.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getSphericalPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/transform/stereographic.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getStereographicPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/transform/web-mercator.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getWebMercatorPosition: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/use/array.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const sizeToModulus2: ParsedBundle;
  export const sizeToModulus3: ParsedBundle;
  export const sizeToModulus4: ParsedBundle;
  export const packIndex2: ParsedBundle;
  export const packIndex3: ParsedBundle;
  export const packIndex4: ParsedBundle;
  export const unpackIndex2: ParsedBundle;
  export const unpackIndex3: ParsedBundle;
  export const unpackIndex4: ParsedBundle;
  export const clipIndex2: ParsedBundle;
  export const clipIndex3: ParsedBundle;
  export const clipIndex4: ParsedBundle;
  export const wrapIndex2: ParsedBundle;
  export const wrapIndex3: ParsedBundle;
  export const wrapIndex4: ParsedBundle;
  export const wrapIndex2i: ParsedBundle;
  export const wrapIndex3i: ParsedBundle;
  export const wrapIndex4i: ParsedBundle;
  export const clampIndex2: ParsedBundle;
  export const clampIndex3: ParsedBundle;
  export const clampIndex4: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/use/color.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const premultiply: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/use/gamma.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
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

declare module "@use-gpu/wgsl/use/light.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getLightCount: ParsedBundle;
  export const getLight: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/use/shadow.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const sampleShadow: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/use/types.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const Light: ParsedBundle;
  export const PickVertex: ParsedBundle;
  export const LightVertex: ParsedBundle;
  export const SolidVertex: ParsedBundle;
  export const ShadedVertex: ParsedBundle;
  export const UIVertex: ParsedBundle;
  export const DepthFragment: ParsedBundle;
  export const SurfaceFragment: ParsedBundle;
  export const MeshVertex: ParsedBundle;
  export default __module;
}

declare module "@use-gpu/wgsl/use/view.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const viewUniforms: ParsedBundle;
  export const getViewPosition: ParsedBundle;
  export const getViewResolution: ParsedBundle;
  export const getViewSize: ParsedBundle;
  export const getViewNearFar: ParsedBundle;
  export const getViewPixelRatio: ParsedBundle;
  export const getViewVector: ParsedBundle;
  export const to3D: ParsedBundle;
  export const worldToView: ParsedBundle;
  export const viewToClip: ParsedBundle;
  export const worldToClip: ParsedBundle;
  export const clipToWorld: ParsedBundle;
  export const worldToDepth: ParsedBundle;
  export const clipToWorld3D: ParsedBundle;
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
