// File generated by build.mjs. Do not edit directly.
export const GLSLModules = {
  "fragment/pbr": "// https://www.shadertoy.com/view/XlKSDR\n\nfloat PI = 3.141592;\nfloat F_DIELECTRIC = 0.04;\n\nfloat saturate(float x) {\n  return max(x, 0.0);\n}\n\nfloat pow5(float x) {\n  float x2 = x * x;\n  return x2 * x2 * x;\n}\n\n// D - Normal distribution term\nfloat ndfGGX2(float cosTheta, float alpha) {\n  float alphaSqr = alpha * alpha;\n  float denom = cosTheta * cosTheta * (alphaSqr - 1.0) + 1.0f;\n  return alphaSqr / (PI * denom * denom);\n}\n\nfloat ndfGGX(float cosTheta, float alpha) {\n  float oneMinus = 1.0 - cosTheta * cosTheta;\n  float a = cosTheta * alpha;\n  float k = alpha / (oneMinus + a * a);\n  float d = k * k * (1.0 / PI);\n  return d;\n}\n\n// F - Schlick approximation of Fresnel\nvec3 fresnelSchlick(float cosTheta, vec3 F0) {\n  float FT = pow5(1.0f - cosTheta);\n  return F0 + (1.0 - F0) * FT;\n}\n\nfloat fresnelSchlick(float cosTheta, float f0, float f90) {\n  return f0 + (f90 - f0) * pow(1.0 - cosTheta, 5.0);\n}\n\nfloat fdBurley(float dotNL, float dotNV, float dotLH, float alpha) {\n  float f90 = 0.5 + 2.0 * alpha * dotLH * dotLH;\n  float lightScatter = fresnelSchlick(dotNL, 1.0, f90);\n  float viewScatter = fresnelSchlick(dotNV, 1.0, f90);\n  return lightScatter * viewScatter * (1.0 / PI);\n}\n\n// G - Geometric attenuation term\nfloat G1X(float dotNX, float k) {\n\treturn 1.0f / (dotNX * (1.0f - k) + k);\n}\n\nfloat smithGGXCorrelated(float dotNL, float dotNV, float alpha) {\n  float a2 = alpha * alpha;\n  float GGXL = dotNV * sqrt((dotNL - a2 * dotNL) * dotNL + a2);\n  float GGXV = dotNL * sqrt((dotNV - a2 * dotNV) * dotNV + a2);\n  return 0.5 / (GGXL + GGXV);\n}\n\nfloat geometricGGX(float dotNL, float dotNV, float alpha) {\n\tfloat k = alpha / 2.0f;\n\treturn G1X(dotNL, k) * G1X(dotNV, k);\n}\n\n// N, L, V must be normalized\n#pragma export\nvec3 PBR(vec3 N, vec3 L, vec3 V, vec3 albedo, float metalness, float roughness) {\n\n\tvec3 diffuseColor = albedo * (1.0 - metalness);\n\tvec3 F0 = mix(vec3(F_DIELECTRIC), albedo, metalness);\n\n  float alpha = roughness * roughness;\n\tfloat dotNV = saturate(dot(N, V));\n\n  float radiance = 3.1415;\n\n  vec3 H = normalize(V + L);\n\tfloat dotNL = saturate(dot(N, L));\n\tfloat dotNH = saturate(dot(N, H));\n\tfloat dotLH = saturate(dot(L, H));\n\n  vec3 F = fresnelSchlick(dotLH, F0);\n  float D = ndfGGX(dotNH, alpha);\n  float G = smithGGXCorrelated(dotNL, dotNV, alpha);\n  //float G2 = geometricGGX(dotNL, dotNV, alpha);\n  //return vec3(abs(G - G2) / 100.0);\n  \n  vec3 Fd = albedo * fdBurley(dotNL, dotNV, dotLH, alpha);\n  vec3 Fs = F * D * G;\n\n  vec3 direct = (Fd + Fs) * radiance * dotNL;\n  return direct;\n}\n",
  "geometry/line": "#pragma import {viewUniforms} from 'use/view'\n\n// segments\n//\n// o--o--o  o--o--o--o  o--o\n// 1  3  2  1  3  3  2  1  2\n\nvec2 turn(vec2 xy) {\n  return vec2(xy.y, -xy.x);\n}\n\nvec2 slerp(float d, vec2 a, vec2 b, float t) {\n  float th = acos(d);\n  vec2 ab = sin(vec2((1.0 - t) * th, t * th));\n  return normalize(a * ab.x + b * ab.y);\n}\n\n#pragma export\nvec2 lineJoinBevel(vec2 left, vec2 right, int segment, float arc) {\n  if (arc > 0) return right;\n  return left;\n}\n\n#pragma export\nvec2 lineJoinMiter(vec2 left, vec2 right, int segment, float arc) {\n  vec2 mid;\n  float scale = 1.0;\n\n  if (arc == 0.0) return left;\n  if (arc == 1.0) return right;\n\n  mid = normalize((left + right) / 2.0);\n  scale = min(2.0, 1.0 / dot(mid, left));\n\n  return mid * scale;\n}\n\n#pragma export\nvec2 lineJoinRound(vec2 left, vec2 right, int segment, float arc) {\n  vec2 mid;\n\n  if (arc == 0.0) return left;\n  if (arc == 1.0) return right;\n\n  float d = dot(left, right);\n  if (d > 0.999) return left;\n  return slerp(d, left, right, arc);\n  /*\n  if (d < -0.999) {\n    mid = normalize(turn(left) + turn(-right));\n    if (t < 0.5) return slerp(0.0, left, mid, t*2.0);\n    else return slerp(0.0, mid, right, t*2.0 - 1.0);\n  }\n  */\n\n  //return normalize(mix(left, right, t));\n}\n\n#pragma export\nvec3 getLineJoin(vec3 beforePoint, vec3 centerPoint, vec3 afterPoint, float arc, float y, float size, int segment, int style) {\n  vec2 before = beforePoint.xy * viewUniforms.viewSize;\n  vec2 center = centerPoint.xy * viewUniforms.viewSize;\n  vec2 after = afterPoint.xy * viewUniforms.viewSize;\n\n  vec2 left = turn(normalize(center - before));\n  vec2 right = turn(normalize(after - center));\n\n  vec2 mid;\n  if (segment == 2) {\n    mid = left;\n  }\n  else if (segment == 1) {\n    mid = right;\n  }\n  else {\n    float c = cross(vec3(left, 0.0), vec3(right, 0.0)).z;\n    if (c * y < 0.0) {\n      mid = lineJoinMiter(left, right, segment, arc);\n    }\n    else {\n      if (style == 0) mid = lineJoinBevel(left, right, segment, arc);\n      if (style == 1) mid = lineJoinMiter(left, right, segment, arc);\n      if (style == 2) mid = lineJoinRound(left, right, segment, arc);\n    }\n  }\n\n  vec2 offset = size * mid * y;\n  center.xy += offset;\n\n  return vec3(center * viewUniforms.viewResolution, centerPoint.z);\n}\n",
  "geometry/quad": "const ivec2 QUAD[] = {\n  ivec2(0, 0),\n  ivec2(1, 0),\n  ivec2(0, 1),\n  ivec2(1, 1),\n};\n\n#pragma export\nivec2 getQuadIndex(int vertex) {\n  return QUAD[vertex];\n}\n\n#pragma export\nvec2 getQuadUV(int vertex) {\n  return vec2(getQuadIndex(vertex));\n}\n",
  "geometry/strip": "#pragma export\nivec2 getStripIndex(int vertex) {\n  int x = vertex >> 1;\n  int y = vertex & 1;\n  return ivec2(x, y);\n}\n\n#pragma export\nvec2 getStripUV(int vertex) {\n  return vec2(getStripIndex(vertex));\n}\n",
  "instance/fragment/solid": "#pragma import {viewUniforms} from 'use/view';\n\n#ifdef IS_PICKING\nlayout(location = 0) in flat uint fragIndex;\n#else\nlayout(location = 0) in vec4 fragColor;\nlayout(location = 1) in vec2 fragUV;\n#endif\n\nlayout(location = 0) out vec4 outColor;\n\nvoid main() {\n  #ifdef IS_PICKING\n  float r = (fragIndex & 0xFF);\n  float g = ((fragIndex >> 8) & 0xFF);\n  float b = ((fragIndex >> 16) & 0xFF);\n  float a = ((fragIndex >> 24) & 0xFF);\n  outColor = vec4(r, g, b, a);\n  #else\n  outColor = vec4(fragColor.xyz, fragColor.w);\n  #endif\n}\n",
  "instance/line/fragment": "#pragma import {viewUniforms} from 'use/view';\n\nlayout(location = 0) in vec4 fragColor;\nlayout(location = 1) in vec2 fragUV;\n\nlayout(location = 0) out vec4 outColor;\n\nvoid main() {\n  outColor = vec4(fragColor.xyz, fragColor.w);\n}\n",
  "instance/quad/fragment": "#pragma import {viewUniforms} from 'use/view';\n\nlayout(location = 0) in vec4 fragColor;\nlayout(location = 1) in vec2 fragUV;\n\nlayout(location = 0) out vec4 outColor;\n\nfloat getGrid(vec2 uv) {\n  vec2 xy = abs(fract(uv) - 0.5);\n  return max(xy.x, xy.y) > 0.45 ? 1.0 : 0.5;\n}\n\nvoid main() {\n  outColor = vec4(fragColor.xyz * getGrid(fragUV), fragColor.w);\n}\n",
  "instance/vertex/line": "#pragma import {MeshVertex} from 'use/types'\n#pragma import {worldToClip3D} from 'use/view'\n#pragma import {getStripIndex} from 'geometry/strip'\n#pragma import {getLineJoin} from 'geometry/line'\n\nfloat NaN = 0.0/0.0;\n\nvec4 getPosition(int);\nint getSegment(int);\nfloat getSize(int);\n\n#pragma export\nMeshVertex getLineVertex(int vertexIndex, int instanceIndex) {\n  ivec2 ij = getStripIndex(vertexIndex);\n\n  int segmentLeft = getSegment(instanceIndex);\n  if (segmentLeft == 2) {\n    return MeshVertex(\n      vec4(NaN, NaN, NaN, NaN),\n      vec4(NaN, NaN, NaN, NaN),\n      vec2(NaN, NaN)\n    );\n  }\n\n  vec2 uv = vec2(ij);\n  vec2 xy = uv * 2.0 - 1.0;\n\n  int cornerIndex, joinIndex;\n  if (ij.x == 0) {\n    joinIndex = LINE_JOIN_SIZE;\n    cornerIndex = instanceIndex;\n  }\n  else {\n    joinIndex = ij.x - 1;\n    cornerIndex = instanceIndex + 1;\n  }\n\n  int segment = getSegment(cornerIndex);\n  float size = getSize(cornerIndex);\n\n  vec4 beforePos = getPosition(cornerIndex - 1);\n  vec4 centerPos = getPosition(cornerIndex);\n  vec4 afterPos = getPosition(cornerIndex + 1);\n\n  vec3 before = worldToClip3D(beforePos);\n  vec3 center = worldToClip3D(centerPos);\n  vec3 after = worldToClip3D(afterPos);\n\n  float arc = joinIndex / float(LINE_JOIN_SIZE);\n  vec3 lineJoin = getLineJoin(before, center, after, arc, xy.y, size, segment, LINE_JOIN_STYLE);\n\n  return MeshVertex(\n    vec4(lineJoin, 1.0),\n    vec4(0.2, 0.4, 1.0, 1.0),\n    uv\n  );\n}\n",
  "instance/vertex/quad": "#pragma import {MeshVertex} from 'use/types'\n#pragma import {viewUniforms, worldToClip} from 'use/view'\n#pragma import {getQuadUV} from 'geometry/quad'\n\nvec4 getPosition(int);\nfloat getSize(int);\n\n#pragma export\nMeshVertex getQuadVertex(int vertexIndex, int instanceIndex) {\n  vec4 instancePosition = getPosition(instanceIndex);\n  float instanceSize = getSize(instanceIndex);\n\n  vec4 position = worldToClip(instancePosition);\n\n  vec2 uv = getQuadUV(vertexIndex);\n  vec2 xy = uv * 2.0 - 1.0;\n  position.xy += xy * viewUniforms.viewResolution * (instanceSize * position.w);\n\n  return MeshVertex(\n    position,\n    vec4(abs(instancePosition.xyz), 1.0),\n    uv\n  );\n}",
  "instance/virtual": "#pragma import {MeshVertex} from 'use/types'\n\nMeshVertex getVertex(int, int);\n\n#ifdef IS_PICKING\nlayout(location = 0) out flat uint fragIndex;\n#else\nlayout(location = 0) out vec4 fragColor;\nlayout(location = 1) out vec2 fragUV;\n#endif\n\nvoid main() {\n  int vertexIndex = gl_VertexIndex;\n  int instanceIndex = gl_InstanceIndex;\n\n  MeshVertex v = getVertex(vertexIndex, instanceIndex);\n\n  gl_Position = v.position;\n#ifdef IS_PICKING\n  fragIndex = uint(instanceIndex);\n#else\n  fragColor = v.color;\n  fragUV = v.uv;\n#endif\n}",
  "instance/wireframe-strip": "#pragma import {MeshVertex} from 'use/types'\n#pragma import {getQuadIndex} from 'geometry/quad'\n#pragma import {getStripIndex} from 'geometry/strip'\n#pragma import {getLineJoin} from 'geometry/line'\n\nMeshVertex getVertex(int, int);\n\nlayout(location = 0) out vec4 fragColor;\nlayout(location = 1) out vec2 fragUV;\n\nvoid main() {\n  int vertexIndex = gl_VertexIndex;\n  int instanceIndex = gl_InstanceIndex;\n\n  ivec2 ij = getQuadIndex(vertexIndex);\n  vec2 xy = vec2(ij) * 2.0 - 1.0;\n\n  int f = instanceIndex % WIREFRAME_STRIP_SEGMENTS;\n  int i = instanceIndex / WIREFRAME_STRIP_SEGMENTS;\n\n  ivec2 stripIndex = getStripIndex(f);\n  int edgeIndex = stripIndex.y;\n  int triIndex = stripIndex.x;\n\n  MeshVertex a = getVertex(triIndex, i);\n  MeshVertex b = getVertex(triIndex + 1 + edgeIndex, i);\n\n  vec3 left = a.position.xyz / a.position.w;\n  vec3 right = b.position.xyz / b.position.w;\n\n  vec3 join = (ij.x > 0)\n    ? getLineJoin(left, left, right, 0.0, xy.y, 2.0, 1, 0)\n    : getLineJoin(left, right, right, 0.0, xy.y, 2.0, 2, 0);\n\n  gl_Position = vec4(join, 1.0);\n  fragColor = vec4(1.0, 1.0, 1.0, 1.0);\n  fragUV = vec2(0.0, 0.0);\n}\n",
  "use/types": "#pragma export\nstruct MeshVertex {\n  vec4 position;\n  //vec3 normal;\n  vec4 color;\n  vec2 uv;\n};",
  "use/view": "#pragma export\nlayout(set = 0, binding = 0) uniform ViewUniforms {\n  mat4 projectionMatrix;\n  mat4 viewMatrix;\n  vec4 viewPosition;\n  vec2 viewResolution;\n  vec2 viewSize;\n} viewUniforms;\n\n#pragma export\nvec4 worldToView(vec4 position) {\n  return viewUniforms.viewMatrix * position;\n}\n\n#pragma export\nvec4 viewToClip(vec4 position) {\n  return viewUniforms.projectionMatrix * position;\n}\n\n#pragma export\nvec4 worldToClip(vec4 position) {\n  return viewToClip(worldToView(position));\n}\n\n#pragma export\nvec3 clipToScreen3D(vec4 position) {\n  return vec3(position.xy * viewUniforms.viewSize, position.z);\n}\n\n#pragma export\nvec3 screenToClip3D(vec4 position) {\n  return vec3(position.xy * viewUniforms.viewResolution, position.z);\n}\n\n#pragma export\nvec3 worldToClip3D(vec4 position) {\n  position = viewToClip(worldToView(position));\n  return position.xyz / position.w;\n}\n",
};
export default GLSLModules;
