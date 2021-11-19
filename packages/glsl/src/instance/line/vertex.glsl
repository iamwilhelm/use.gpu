#pragma import {viewUniforms, worldToClip3D} from 'use/view'
#pragma import {getQuadIndex} from 'geometry/quad'

float NaN = 0.0/0.0;

vec4 getPosition(int);
int getSegment(int);
float getSize(int);

layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec2 fragUV;

// o--o--o  o--o--o  o--o
// 1  3  2  1  3  2  1  2

vec2 turn(vec2 xy) {
  return vec2(xy.y, -xy.x);
}

void main() {
  int vertexIndex = gl_VertexIndex;
  int instanceIndex = gl_InstanceIndex;

  ivec2 ij = getQuadIndex(vertexIndex);

  int segmentLeft = getSegment(instanceIndex);
  if (segmentLeft == 2) {
    gl_Position = vec4(NaN, NaN, NaN, NaN);
    return;
  }

  vec2 uv = vec2(ij) * 2.0 - 1.0;
  int cornerIndex = instanceIndex + ij.x;
  int segment = getSegment(cornerIndex);
  float size = getSize(cornerIndex);

  vec4 beforePos = getPosition(cornerIndex - 1);
  vec4 centerPos = getPosition(cornerIndex);
  vec4 afterPos = getPosition(cornerIndex + 1);

  vec3 beforeClip = worldToClip3D(beforePos);
  vec3 posClip = worldToClip3D(centerPos);
  vec3 afterClip = worldToClip3D(afterPos);

  vec2 before = beforeClip.xy * viewUniforms.viewSize;
  vec2 pos = posClip.xy * viewUniforms.viewSize;
  vec2 after = afterClip.xy * viewUniforms.viewSize;

  vec2 left = pos - before;
  vec2 right = after - pos;
  vec2 nLeft = normalize(left);
  vec2 nRight = normalize(right);

  vec2 nMid;
  float scale = 1.0;
  if (segment == 3) {
    nMid = normalize((nLeft + nRight) / 2.0);
    scale = 1.0 / dot(nMid, nLeft);
  }
  else if (segment == 2) {
    nMid = nLeft;
  }
  else if (segment == 1) {
    nMid = nRight;
  }
  nMid = turn(nMid) * scale;

  vec2 xy = nMid * (float(ij.y) * 2.0 - 1.0);
  pos.xy += xy * size;

  gl_Position = vec4(pos * viewUniforms.viewResolution, posClip.z, 1.0);
  fragColor = vec4(0.2, 0.4, 1.0, 1.0);
  fragUV = uv;
}
