struct ViewUniforms {
  projectionMatrix: mat4x4<f32>,
  viewMatrix: mat4x4<f32>,
  viewPosition: vec4<f32>,
  viewNearFar: vec2<f32>,
  viewResolution: vec2<f32>,
  viewSize: vec2<f32>,
  viewWorldDepth: vec2<f32>,
  viewPixelRatio: f32,
};

@export @group(VIEW) @binding(VIEW) var<uniform> viewUniforms: ViewUniforms;

@export fn getViewPosition() -> vec4<f32> { return viewUniforms.viewPosition; }
@export fn getViewResolution() -> vec2<f32> { return viewUniforms.viewResolution; }
@export fn getViewSize() -> vec2<f32> { return viewUniforms.viewSize; }
@export fn getViewNearFar() -> vec2<f32> { return viewUniforms.viewNearFar; }

@export fn to3D(position: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(position.xyz, 1.0);
}

@export fn worldToView(position: vec4<f32>) -> vec4<f32> {
  return viewUniforms.viewMatrix * position;
}

@export fn viewToClip(position: vec4<f32>) -> vec4<f32> {
  return viewUniforms.projectionMatrix * position;
}

@export fn worldToClip(position: vec4<f32>) -> vec4<f32> {
  return viewToClip(worldToView(position));
}

@export fn toClip3D(position: vec4<f32>) -> vec3<f32> {
  return position.xyz / position.w;
}

@export fn worldToClip3D(position: vec4<f32>) -> vec3<f32> {
  return toClip3D(worldToClip(position));
}

@export fn clip3DToScreen(position: vec3<f32>) -> vec2<f32> {
  return position.xy * viewUniforms.viewSize;
}

@export fn screenToClip3D(position: vec2<f32>, z: f32) -> vec3<f32> {
  return vec3(position.xy * viewUniforms.viewResolution, z);
}

@export fn clipLineIntoView(anchor: vec4<f32>, head: vec4<f32>) -> vec4<f32> {
  let near = viewUniforms.viewNearFar.x * 2.0;

  let d = anchor - head;
  if (dot(d, d) == 0.0) { return worldToView(anchor); }

  let a = worldToView(anchor);
  let b = worldToView(head);

  if (-a.z < near) {
    if (abs(b.z - a.z) > 0.001) {
      let ratio = (near + a.z) / (a.z - b.z);
      return mix(a, b, ratio);
    }
  }

  return a;
}

@export fn getViewScale() -> f32 {
  let m = viewUniforms.projectionMatrix;
  return 2.0 / length(m[1]);
}

@export fn getWorldScale(w: f32, f: f32) -> f32 {
  let v = viewUniforms.viewResolution;
  return getPerspectiveScale(w, f) * v.y * w;
}

@export fn getPerspectiveScale(w: f32, f: f32) -> f32 {
  let m = viewUniforms.projectionMatrix;
  let worldScale = length(m[1]) * viewUniforms.viewWorldDepth.x;
  let clipScale = mix(1.0, worldScale / w, f);
  let pixelScale = clipScale * viewUniforms.viewPixelRatio;
  return pixelScale;
}

@export fn applyZBias3(position: vec3<f32>, zBias: f32, w: f32) -> vec3<f32> {
  let m = viewUniforms.projectionMatrix;
  let v = viewUniforms.viewResolution;
  let zw = m[2].w;

  if (zw < 0.0) {
    // reversed z - perspective
    let z = m[3].z / (-w + w * zBias * v.y * viewUniforms.viewWorldDepth.y) + m[2].z;
    return vec3<f32>(position.xy, -z);
  }
  else if (zw > 0.0) {
    // normal z - perspective
    let z = m[3].z / (w + w * zBias * v.y * viewUniforms.viewWorldDepth.y) + m[2].z;
    return vec3<f32>(position.xy, z);
  }
  else {
    // orthographic - reversed z
    let w = (position.z - m[3].z) / m[2].z;
    let z = (w - w * zBias * v.y * viewUniforms.viewWorldDepth.y) * m[2].z + m[3].z;
    return vec3<f32>(position.xy, z);
  }
}

@export fn applyZBias(position: vec4<f32>, zBias: f32) -> vec4<f32> {
  let m = viewUniforms.projectionMatrix;
  let v = viewUniforms.viewResolution;
  let w = position.w;

  let zw = m[2].w;
  if (zw < 0.0) {
    // reversed z - perspective
    let z = m[3].z / (-w + w * zBias * v.y * viewUniforms.viewWorldDepth.y) + m[2].z;
    return vec4<f32>(position.xy, -z * w, w);
  }
  else if (zw > 0.0) {
    // normal z - perspective
    let z = m[3].z / (w + w * zBias * v.y * viewUniforms.viewWorldDepth.y) + m[2].z;
    return vec4<f32>(position.xy, z * w, w);
  }
  else {
    // orthographic - reversed z
    return position;
    let w = (position.z - m[3].z) / m[2].z;
    let z = (w + w * 0.0 * zBias * v.y * viewUniforms.viewWorldDepth.y) * m[2].z + m[3].z;
    return vec4<f32>(position.xy, -z, 1.0);
  }
}

