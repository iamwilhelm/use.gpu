#pragma import {viewUniforms, worldToClip3D} from 'use/view'
#pragma import {getStripIndex} from 'geometry/strip'

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

vec2 slerp(float d, vec2 a, vec2 b, float t) {
  float th = acos(d);
  return normalize(a * sin((1.0 - t) * th) + b * sin(t * th));
}

vec2 miter(vec2 left, vec2 right, int segment, int joinIndex) {
  vec2 mid;
  float scale = 1.0;

  if (joinIndex == 0) return left;
  if (joinIndex == JOIN_SIZE) return right;

  mid = normalize((left + right) / 2.0);
  scale = min(2.0, 1.0 / dot(mid, left));

  return mid * scale;
}

vec2 round(vec2 left, vec2 right, int segment, int joinIndex) {
  vec2 mid;

  if (joinIndex == 0) return left;
  if (joinIndex == JOIN_SIZE) return right;

  float t = float(joinIndex) / float(JOIN_SIZE);
  float d = dot(left, right);
  if (d > 0.999) return left;
  return slerp(d, left, right, t);
  /*
  if (d < -0.999) {
    mid = normalize(turn(left) + turn(-right));
    if (t < 0.5) return slerp(0.0, left, mid, t*2.0);
    else return slerp(0.0, mid, right, t*2.0 - 1.0);
  }
  */

  //return normalize(mix(left, right, t));
}

vec2 bevel(vec2 left, vec2 right, int segment, int joinIndex) {
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

  vec2 mid;
  if (segment == 2) {
    mid = left;
  }
  else if (segment == 1) {
    mid = right;
  }
  else {
    float c = cross(vec3(left, 0.0), vec3(right, 0.0)).z;
    if (c * uv.y < 0) {
      mid = miter(left, right, segment, joinIndex);
    }
    else {
      mid = JOIN_STYLE(left, right, segment, joinIndex);    
    }
  }

  vec2 xy = mid * (float(ij.y) * 2.0 - 1.0);
  pos.xy += xy * size;

  gl_Position = vec4(pos * viewUniforms.viewResolution, posClip.z, 1.0);
  fragColor = vec4(0.2, 0.4, 1.0, 1.0);
  fragUV = uv;
}
