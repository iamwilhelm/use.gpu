#pragma import {MeshVertex} from 'use/types'
#pragma import {viewUniforms, worldToClip3D} from 'use/view'
#pragma import {getStripIndex} from 'geometry/strip'

float NaN = 0.0/0.0;

vec4 getPosition(int);
int getSegment(int);
float getSize(int);

// o--o--o  o--o--o  o--o
// 1  3  2  1  3  2  1  2

vec2 turn(vec2 xy) {
  return vec2(xy.y, -xy.x);
}

vec2 slerp(float d, vec2 a, vec2 b, float t) {
  float th = acos(d);
  vec2 ab = sin(vec2((1.0 - t) * th, t * th));
  return normalize(a * ab.x + b * ab.y);
}

vec2 joinBevel(vec2 left, vec2 right, int segment, float arc) {
  if (arc > 0) return right;
  return left;
}

vec2 joinMiter(vec2 left, vec2 right, int segment, float arc) {
  vec2 mid;
  float scale = 1.0;

  if (arc == 0.0) return left;
  if (arc == 1.0) return right;

  mid = normalize((left + right) / 2.0);
  scale = min(2.0, 1.0 / dot(mid, left));

  return mid * scale;
}

vec2 joinRound(vec2 left, vec2 right, int segment, float arc) {
  vec2 mid;

  if (arc == 0.0) return left;
  if (arc == 1.0) return right;

  float d = dot(left, right);
  if (d > 0.999) return left;
  return slerp(d, left, right, arc);
  /*
  if (d < -0.999) {
    mid = normalize(turn(left) + turn(-right));
    if (t < 0.5) return slerp(0.0, left, mid, t*2.0);
    else return slerp(0.0, mid, right, t*2.0 - 1.0);
  }
  */

  //return normalize(mix(left, right, t));
}

#pragma export
vec3 getLineJoin(vec3 beforePoint, vec3 centerPoint, vec3 afterPoint, float arc, float y, float size, int segment, int style) {
  vec2 before = beforePoint.xy * viewUniforms.viewSize;
  vec2 center = centerPoint.xy * viewUniforms.viewSize;
  vec2 after = afterPoint.xy * viewUniforms.viewSize;

  vec2 left = turn(normalize(center - before));
  vec2 right = turn(normalize(after - center));

  vec2 mid;
  if (segment == 2) {
    mid = left;
  }
  else if (segment == 1) {
    mid = right;
  }
  else {
    float c = cross(vec3(left, 0.0), vec3(right, 0.0)).z;
    if (c * y < 0.0) {
      mid = joinMiter(left, right, segment, arc);
    }
    else {
      if (style == 0) mid = joinBevel(left, right, segment, arc);
      if (style == 1) mid = joinMiter(left, right, segment, arc);
      if (style == 2) mid = joinRound(left, right, segment, arc);
    }
  }

  vec2 offset = size * mid * y;
  center.xy += offset;

  return vec3(center * viewUniforms.viewResolution, centerPoint.z);
}

#pragma export
MeshVertex getLineVertex(int vertexIndex, int instanceIndex) {
  ivec2 ij = getStripIndex(vertexIndex);

  int segmentLeft = getSegment(instanceIndex);
  if (segmentLeft == 2) {
    return MeshVertex(
      vec4(NaN, NaN, NaN, NaN),
      vec4(NaN, NaN, NaN, NaN),
      vec2(NaN, NaN)
    );
  }

  vec2 uv = vec2(ij);
  vec2 xy = uv * 2.0 - 1.0;

  int cornerIndex, joinIndex;
  if (ij.x == 0) {
    joinIndex = LINE_JOIN_SIZE;
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

  vec3 before = worldToClip3D(beforePos);
  vec3 center = worldToClip3D(centerPos);
  vec3 after = worldToClip3D(afterPos);

  float arc = joinIndex / float(LINE_JOIN_SIZE);
  vec3 lineJoin = getLineJoin(before, center, after, arc, xy.y, size, segment, LINE_JOIN_STYLE);

  return MeshVertex(
    vec4(lineJoin, 1.0),
    vec4(0.2, 0.4, 1.0, 1.0),
    uv
  );
}
