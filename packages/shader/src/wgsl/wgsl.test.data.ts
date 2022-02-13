// Testing shaders
export const WGSLModules = {
  "instance/vertex/quad": `
#pragma import {SolidVertex} from 'use/types'
#pragma import {viewUniforms, worldToClip, getPerspectiveScale} from 'use/view'
#pragma import {getQuadUV} from 'geometry/quad'

vec4 getPosition(int);
vec4 getColor(int);
vec2 getSize(int);
float getDepth(int);

#pragma export
SolidVertex getQuadVertex(int vertexIndex, int instanceIndex) {
  vec4 position = getPosition(instanceIndex);
  vec4 color = getColor(instanceIndex);
  vec2 size = getSize(instanceIndex);
  float depth = getDepth(instanceIndex);

  vec4 center = worldToClip(position);

  vec2 uv = getQuadUV(vertexIndex);
  vec2 xy = uv * 2.0 - 1.0;
  
  // Lerp between fixed size and full perspective.
  float pixelScale = getPerspectiveScale(center.w, depth);
  size *= pixelScale;

  #ifdef HAS_EDGE_BLEED
  xy = xy * (size + 0.5) / size;
  uv = xy * .5 + .5;
  #endif

  center.xy += xy * size * viewUniforms.viewResolution * center.w;

  return SolidVertex(
    center,
    color,
    uv
  );
}`,

  "instance/fragment/solid": `
#pragma import {getPickingColor} from 'use/picking';

vec4 getFragment(vec4, vec2);

#ifdef IS_PICKING
layout(location = 0) in flat uint fragIndex;
layout(location = 0) out uvec4 outColor;
#else
layout(location = 0) in vec4 fragColor;
layout(location = 1) in vec2 fragUV;

layout(location = 0) out vec4 outColor;
#endif

#ifdef IS_PICKING
void main() {
  outColor = getPickingColor(fragIndex);
}
#else
void main() {
  outColor = fragColor;
  outColor.xyz *= outColor.a;

  outColor = getFragment(outColor, fragUV);

  if (outColor.a <= 0.0) discard;
}
#endif
`,

  "use/view": `
#pragma export
layout(set = VIEW_BINDGROUP, binding = VIEW_BINDING) uniform ViewUniforms {
  mat4 projectionMatrix;
  mat4 viewMatrix;
  vec4 viewPosition;
  vec2 viewResolution;
  vec2 viewSize;
  float viewWorldUnit;
  float viewPixelRatio;
} viewUniforms;

#pragma export
vec4 worldToView(vec4 position) {
  return viewUniforms.viewMatrix * position;
}

#pragma export
vec4 viewToClip(vec4 position) {
  return viewUniforms.projectionMatrix * position;
}

#pragma export
vec4 worldToClip(vec4 position) {
  return viewToClip(worldToView(position));
}

#pragma export
vec3 clipToScreen3D(vec4 position) {
  return vec3(position.xy * viewUniforms.viewSize, position.z);
}

#pragma export
vec3 screenToClip3D(vec4 position) {
  return vec3(position.xy * viewUniforms.viewResolution, position.z);
}

#pragma export
vec3 worldToClip3D(vec4 position) {
  position = viewToClip(worldToView(position));
  return position.xyz / position.w;
}

#pragma export
float getPerspectiveScale(float w, float f) {
  mat4 m = viewUniforms.projectionMatrix;
  float worldScale = m[1][1] * viewUniforms.viewWorldUnit;
  float clipScale = mix(1.0, worldScale / w, f);
  float pixelScale = clipScale * viewUniforms.viewPixelRatio;
  return pixelScale;
}
`,

  "use/types": `
#pragma export
struct SolidVertex {
  vec4 position;
  vec4 color;
  vec2 uv;
};

#pragma export
struct MeshVertex {
  vec4 position;
  vec3 normal;
  vec4 color;
  vec2 uv;
};`,

  "geometry/quad": `
const ivec2 QUAD[] = {
  ivec2(0, 0),
  ivec2(1, 0),
  ivec2(0, 1),
  ivec2(1, 1),
};

#pragma export
ivec2 getQuadIndex(int vertex) {
  return QUAD[vertex];
}

#pragma export
vec2 getQuadUV(int vertex) {
  return vec2(getQuadIndex(vertex));
}
`,
};

export default WGSLModules;
