// File generated by build.mjs. Do not edit directly.
export const GLSLModules = {
  "fragment/pbr": "// https://www.shadertoy.com/view/XlKSDR\n\nfloat PI = 3.141592;\nfloat F_DIELECTRIC = 0.04;\n\nfloat saturate(float x) {\n  return max(x, 0.0);\n}\n\nfloat pow5(float x) {\n  float x2 = x * x;\n  return x2 * x2 * x;\n}\n\n// D - Normal distribution term\nfloat ndfGGX2(float cosTheta, float alpha) {\n  float alphaSqr = alpha * alpha;\n  float denom = cosTheta * cosTheta * (alphaSqr - 1.0) + 1.0f;\n  return alphaSqr / (PI * denom * denom);\n}\n\nfloat ndfGGX(float cosTheta, float alpha) {\n  float oneMinus = 1.0 - cosTheta * cosTheta;\n  float a = cosTheta * alpha;\n  float k = alpha / (oneMinus + a * a);\n  float d = k * k * (1.0 / PI);\n  return d;\n}\n\n// F - Schlick approximation of Fresnel\nvec3 fresnelSchlick(float cosTheta, vec3 F0) {\n  float FT = pow5(1.0f - cosTheta);\n  return F0 + (1.0 - F0) * FT;\n}\n\nfloat fresnelSchlick(float cosTheta, float f0, float f90) {\n  return f0 + (f90 - f0) * pow(1.0 - cosTheta, 5.0);\n}\n\nfloat fdBurley(float dotNL, float dotNV, float dotLH, float alpha) {\n  float f90 = 0.5 + 2.0 * alpha * dotLH * dotLH;\n  float lightScatter = fresnelSchlick(dotNL, 1.0, f90);\n  float viewScatter = fresnelSchlick(dotNV, 1.0, f90);\n  return lightScatter * viewScatter * (1.0 / PI);\n}\n\n// G - Geometric attenuation term\nfloat G1X(float dotNX, float k) {\n\treturn 1.0f / (dotNX * (1.0f - k) + k);\n}\n\nfloat smithGGXCorrelated(float dotNL, float dotNV, float alpha) {\n  float a2 = alpha * alpha;\n  float GGXL = dotNV * sqrt((dotNL - a2 * dotNL) * dotNL + a2);\n  float GGXV = dotNL * sqrt((dotNV - a2 * dotNV) * dotNV + a2);\n  return 0.5 / (GGXL + GGXV);\n}\n\nfloat geometricGGX(float dotNL, float dotNV, float alpha) {\n\tfloat k = alpha / 2.0f;\n\treturn G1X(dotNL, k) * G1X(dotNV, k);\n}\n\n// N, L, V must be normalized\n#pragma export\nvec3 PBR(vec3 N, vec3 L, vec3 V, vec3 albedo, float metalness, float roughness) {\n\n\tvec3 diffuseColor = albedo * (1.0 - metalness);\n\tvec3 F0 = mix(vec3(F_DIELECTRIC), albedo, metalness);\n\n  float alpha = roughness * roughness;\n\tfloat dotNV = saturate(dot(N, V));\n\n  float radiance = 3.1415;\n\n  vec3 H = normalize(V + L);\n\tfloat dotNL = saturate(dot(N, L));\n\tfloat dotNH = saturate(dot(N, H));\n\tfloat dotLH = saturate(dot(L, H));\n\n  vec3 F = fresnelSchlick(dotLH, F0);\n  float D = ndfGGX(dotNH, alpha);\n  float G = smithGGXCorrelated(dotNL, dotNV, alpha);\n  //float G2 = geometricGGX(dotNL, dotNV, alpha);\n  //return vec3(abs(G - G2) / 100.0);\n  \n  vec3 Fd = albedo * fdBurley(dotNL, dotNV, dotLH, alpha);\n  vec3 Fs = F * D * G;\n\n  vec3 direct = (Fd + Fs) * radiance * dotNL;\n  return direct;\n}\n",
  "geometry/quad": "const ivec2 QUAD[] = {\n  ivec2(0, 0),\n  ivec2(1, 0),\n  ivec2(0, 1),\n  ivec2(1, 1),\n};\n\n#pragma export\nivec2 getQuadIndex(int vertex) {\n  return QUAD[vertex];\n  /*\n  vertex = min(vertex, 6 - vertex);\n  ivec2 iuv = vertex & ivec2(1, 2);\n  iuv.y = iuv.y >> 1;\n\n  return iuv;\n  */\n}\n\n#pragma export\nvec2 getQuadUV(int vertex) {\n  return vec2(getQuadIndex(vertex));\n}\n\n#pragma export\nMeshVertex getQuad(int vertex) {\n  vec2 uv = getQuadUV(vertex);\n  vec4 position = vec4(uv * 2.0 - 1.0, 0.0, 1.0);\n  vec4 color = vec4(1.0, 0.0, 1.0, 1.0);\n  return MeshVertex(position, color, uv);\n}\n",
  "instance/quad/fragment": "#pragma import {viewUniforms} from 'use/view';\n\nlayout(location = 0) in vec4 fragColor;\nlayout(location = 1) in vec2 fragUV;\n\nlayout(location = 0) out vec4 outColor;\n\nfloat getGrid(vec2 uv) {\n  vec2 xy = abs(fract(uv) - 0.5);\n  return max(xy.x, xy.y) > 0.45 ? 1.0 : 0.5;\n}\n\nvoid main() {\n  outColor = vec4(fragColor.xyz * getGrid(fragUV), fragColor.w);\n}\n",
  "instance/quad/vertex": "#pragma import {MeshVertex} from 'use/types'\n#pragma import {viewUniforms, worldToClip} from 'use/view'\n#pragma import {getQuadUV} from 'geometry/quad'\n\nlayout(location = 0) out vec4 fragColor;\nlayout(location = 1) out vec2 fragUV;\n\nvoid main() {\n  int vertexIndex = gl_VertexIndex;\n  int instanceIndex = gl_InstanceIndex;\n\n  float r = float(instanceIndex);\n  vec4 instancePosition = vec4(cos(r), sin(r * 1.341 + r * r), cos(r + cos(r)*1.173), 1.0);\n\n  vec4 position = worldToClip(instancePosition);\n\n  vec2 uv = getQuadUV(vertexIndex);\n  vec2 xy = uv * 2.0 - 1.0;\n  position.xy += xy * viewUniforms.viewResolution * (50.0 * position.w);\n\n  gl_Position = position;\n  fragColor = vec4(abs(instancePosition), 1.0);\n  fragUV = uv;\n}",
  "use/types": "struct MeshVertex {\n  vec4 position;\n  vec4 color;\n  vec2 uv;\n};\n",
  "use/view": "layout(set = 0, binding = 0) uniform ViewUniforms {\n  mat4 projectionMatrix;\n  mat4 viewMatrix;\n  vec4 viewPosition;\n  vec2 viewResolution;\n} viewUniforms;\n\nexport vec4 worldToView(vec4 position) {\n  return view.viewMatrix * position;\n}\n\nexport vec4 viewToClip(vec4 position) {\n  return view.projectionMatrix * position;\n}\n\nexport vec4 worldToClip(vec4 position) {\n  return viewToClip(worldToView(position));\n}",
};
export default GLSLModules;
