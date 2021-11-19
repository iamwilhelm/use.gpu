#pragma import {viewUniforms, worldToClip3D} from 'use/view'
#pragma import {getStripIndex} from 'geometry/strip'

#define JOIN_SIZE 3
#define JOIN_STYLE joinRound

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

vec2 joinMiter(vec2 left, vec2 right, int segment, int joinIndex) {
  vec2 mid;
  float scale = 1.0;

  if (joinIndex == 0) return left;
  if (joinIndex == JOIN_SIZE) return right;

  if (segment == 3) {
    mid = normalize((left + right) / 2.0);
    scale = 1.0 / dot(mid, left);
  }
  else if (segment == 2) {
    mid = left;
  }
  else if (segment == 1) {
    mid = right;
  }
  return mid * scale;
}

vec2 joinRound(vec2 left, vec2 right, int segment, int joinIndex) {
  vec2 mid;

  if (joinIndex == 0) return left;
  if (joinIndex == JOIN_SIZE) return right;

  if (segment == 3) {
    float f = float(joinIndex) / float(JOIN_SIZE);
    mid = normalize(mix(left, right, f));
  }
  else if (segment == 2) {
    mid = left;
  }
  else if (segment == 1) {
    mid = right;
  }
  return mid;
}

vec2 joinBevel(vec2 left, vec2 right, int segment, int joinIndex) {
  if (joinIndex > 0) return right;
  return left;
}

void main() {
  int vertexIndex = gl_VertexIndex;
  int instanceIndex = gl_InstanceIndex;

  ivec2 ij = getStripIndex(vertexIndex);

  int segmentLeft = getSegment(instanceIndex);
  if (segmentLeft == 2) {
    gl_Position = vec4(NaN, NaN, NaN, NaN);
    return;
  }

  vec2 uv = vec2(ij) * 2.0 - 1.0;

  int cornerIndex, joinIndex;
  if (ij.x == 0) {
    joinIndex = JOIN_SIZE;
    cornerIndex = instanceIndex;
  }
  else {
    joinIndex = ij.x - 1;
    cornerIndex = instanceIndex + 1;
  }

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

  vec2 left = turn(normalize(pos - before));
  vec2 right = turn(normalize(after - pos));
  vec2 mid = JOIN_STYLE(left, right, segment, joinIndex);

  vec2 xy = mid * (float(ij.y) * 2.0 - 1.0);
  pos.xy += xy * size;

  gl_Position = vec4(pos * viewUniforms.viewResolution, posClip.z, 1.0);
  fragColor = vec4(0.2, 0.4, 1.0, 1.0);
  fragUV = uv;
}
