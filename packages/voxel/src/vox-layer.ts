import type { LC, LiveElement, Ref } from '@use-gpu/live';
import type { TextureSource, StorageSource } from '@use-gpu/core';

import { gather, use, quote, yeet, memo, useCallback, useOne } from '@use-gpu/live';
import {
  useMatrixContext,
  useBoundShader, useLambdaSource, useDebugContext, useShaderRef,
  FaceLayer, GeometryData, ShaderLitMaterial,
  makeBoxGeometry,
} from '@use-gpu/workbench';
import { wgsl, bindBundle, bindEntryPoint, bundleToAttributes } from '@use-gpu/shader/wgsl';

import { applyPBRMaterial } from '@use-gpu/wgsl/material/pbr-apply.wgsl';
import { getViewPosition, worldToDepth } from '@use-gpu/wgsl/use/view.wgsl';
import { SurfaceFragment, DepthFragment } from '@use-gpu/wgsl/use/types.wgsl';

import { vec3, mat3, mat4 } from 'gl-matrix';

const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x));

export type VoxLayerProps = {
  shape: TextureSource[],
  palette: StorageSource,
  pbr: StorageSource,
};

const vertexShader = wgsl`
@link fn getPosition(i: u32) -> vec4<f32>;
@link fn getSize(i: u32) -> vec3<f32>;

@export fn main(i: u32) -> vec4<f32> {
  let p = getPosition(i);
  let s = getSize(i);

  return vec4<f32>(p.xyz * s, 1.0);
};
`;

const surfaceShader = bindBundle(wgsl`
@link struct SurfaceFragment {};
@link struct DepthFragment {};

@link fn getViewPosition() -> vec4<f32>;
@link fn worldToDepth(p: vec4<f32>) -> f32;

@link fn getMatrix() -> mat4x4<f32>;
@link fn getRayMatrix() -> mat3x3<f32>;
@link fn getNormalMatrix() -> mat3x3<f32>;
@link fn getSize() -> vec3<i32>;

@link fn getIsInside() -> f32;
@link fn getInsideOrigin() -> vec3<f32>;

@link fn getTexture0(uvw: vec3<i32>, level: u32) -> u32;
@link fn getTexture1(uvw: vec3<i32>, level: u32) -> u32;
@link fn getTexture2(uvw: vec3<i32>, level: u32) -> u32;

@link fn getPalette(i: u32, level: u32) -> vec4<f32>;
@link fn getPBR(i: u32) -> vec4<f32>;

struct VoxelHit {
  position: vec3<f32>,
  normal: vec3<f32>,
  index: u32,
  steps: u32,
};

fn traceIntoVolume(origin: vec3<f32>, ray: vec3<f32>, size: vec3<i32>) -> VoxelHit {
  // Signs for ray direction
  let signs = sign(ray);

  // Magnitude for steps along X/Y/Z
  let absRay = abs(ray);
  let invAbs = 1.0001 / max(absRay, vec3<f32>(1e-5));

  // Minimum trace distance
  let front = max(vec3<f32>(size) * -signs, vec3<f32>(0.0));
  var front3 = (front - origin) * invAbs * signs;
  let distMin = max(0.0, max(front3.x, max(front3.y, front3.z))) + 1e-5;

  // Maximum trace distance
  let back = max(vec3<f32>(size) * signs, vec3<f32>(0.0));
  let back3 = (back - origin) * invAbs * signs;
  let distMax = min(back3.x, min(back3.y, back3.z)) - distMin;

  let pos = origin + ray * distMin;

  // Initial axis for first hit
  front3 = (front - pos) * invAbs * signs;
  let axis = step(front3.yzx, front3) * step(front3.zxy, front3);

  return traceVolumeSteps(pos, ray, size, signs, invAbs, axis, distMax);
}

fn traceOnVolume(origin: vec3<f32>, ray: vec3<f32>, size: vec3<i32>) -> VoxelHit {
  // Signs for ray direction
  let signs = sign(ray);

  // Magnitude for steps along X/Y/Z
  let absRay = abs(ray);
  let invAbs = 1.0001 / max(absRay, vec3<f32>(1e-5));

  // Determine surface axis
  let front = max(vec3<f32>(size) * -signs, vec3<f32>(0.0));
  let front3 = (front - origin) * invAbs * signs;
  let axis = step(front3.yzx, front3) * step(front3.zxy, front3);

  // Start just inside surface voxels
  var pos = origin + ray * 1e-5;
  var uvw = vec3<i32>(floor(pos));

  // Maximum trace distance
  let back = max(vec3<f32>(size) * signs, vec3<f32>(0.0));
  let back3 = (back - origin) * invAbs * signs;
  let distMax = min(back3.x, min(back3.y, back3.z));

  return traceVolumeSteps(pos, ray, size, signs, invAbs, axis, distMax);
}

fn traceVolumeSteps(
  pos: vec3<f32>,
  ray: vec3<f32>,
  size: vec3<i32>,
  signs: vec3<f32>,
  invAbs: vec3<f32>,
  initialAxis: vec3<f32>,
  distMax: f32,
) -> VoxelHit {
  var steps = 0u;
  var mip: u32 = 2;
  var dist: f32 = 0.0;

  // Signs for ray direction
  let signI = vec3<i32>(signs);
  let signF = -signs;
  let baseF = max(vec3<f32>(0.0), -signF);

  var axis = initialAxis;
  for (var i = 0u; i < 8u; i++) {

    if (mip > 0) {
      let level = f32(1 << mip);
      let maxSteps = 12 + (mip - 1) * 128;
      let invAbsL = invAbs * level;

      let current = (pos + dist * ray) / level;
      let fl = floor(current);

      var offset = (baseF + (current - fl) * signF) * invAbsL + dist;
      var uvw = vec3<i32>(fl);

      for (var j = 0u; j <= maxSteps; j++) {
        steps++;

        if (j == maxSteps) {
          mip++;
          break;
        }

        var index: u32;
        if (mip == 2) { index = getTexture2(uvw, 0u); }
        else { index = getTexture1(uvw, 0u); }

        if (index > 0u) {
          mip--;
          break;
        }

        axis = step(offset, offset.yzx) * step(offset, offset.zxy);
        dist = dot(axis, offset);
        offset += invAbsL * axis;
        uvw += signI * vec3<i32>(axis);

        if (dist >= distMax) { break; }
      }
    }

    if (mip == 0) {
      let current = pos + dist * ray;
      let fl = floor(current);

      var offset = (baseF + (current - fl) * signF) * invAbs + dist;
      var uvw = vec3<i32>(fl);

      for (var j = 0u; j < 12u; j++) {
        steps++;

        let index = getTexture0(uvw, 0u);
        if (index > 0u) {
          return VoxelHit(pos + dist * ray, axis * signF, index, steps);
        }

        axis = step(offset, offset.yzx) * step(offset, offset.zxy);
        dist = dot(axis, offset);
        offset += invAbs * axis;
        uvw += signI * vec3<i32>(axis);

        if (dist >= distMax) { break; }
      }

      mip = 2;
    }

    if (dist >= distMax) { break; }
  }

  return VoxelHit(pos, ray, 0u, steps);
};

@export fn main(
  color: vec4<f32>,
  uv: vec4<f32>,
  st: vec4<f32>,
  normal: vec4<f32>,
  tangent: vec4<f32>,
  position: vec4<f32>,
) -> SurfaceFragment {
  let viewPosition = getViewPosition().xyz;
  let surfacePosition = position.xyz;
  let toSurface = surfacePosition - viewPosition;

  let r = getRayMatrix();
  let s = getSize();

  let ray = normalize(r * toSurface);

  var hit: VoxelHit;
  if (getIsInside() > 0.0) {
    hit = traceIntoVolume(getInsideOrigin(), ray, s);
  }
  else {
    let origin = saturate(uv.xyz) * vec3<f32>(s);
    hit = traceOnVolume(origin, ray, s);
  }
  
  var albedo: vec4<f32>;
  var emissive: vec4<f32>;
  var material: vec4<f32>;
  
  if (DEBUG_STEPS) {
    let t = f32(hit.steps) / 64.0;
    let stripe = f32(hit.steps & 1) * 0.025 * 0.0;
    albedo = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    emissive = max(vec4<f32>(0.0), vec4<f32>(t * t * t, t, 1.0 - t, 0.0)) + stripe;
    emissive = mix(emissive, emissive * emissive, .75);
    material = vec4<f32>(0.0);
  }
  else {
    if (hit.index == 0u) { discard; }

    let palette = getPalette(hit.index, 0u);
    let pbr = getPBR(hit.index - 1);
  
    albedo = palette * (1.0 - pbr.z);
    emissive = palette * pbr.z;
    material = vec4<f32>(pbr.x, pbr.y, 0.0, 0.0);
  }

  let m = getMatrix();
  let n = getNormalMatrix();
  let worldPosition = m * vec4<f32>(hit.position - vec3<f32>(s) / 2.0, 1.0);

  let occlusion = 1.0;
  let depth = worldToDepth(worldPosition);

  return SurfaceFragment(
    worldPosition,
    vec4<f32>(n * hit.normal, 0.0),
    albedo,
    emissive,
    material,
    occlusion,
    depth,
  );
}

@export fn mainDepthOnly(
  alpha: f32,
  uv: vec4<f32>,
  st: vec4<f32>,
  position: vec4<f32>,
) -> DepthFragment {
  let viewPosition = getViewPosition().xyz;
  let surfacePosition = position.xyz;
  let toSurface = surfacePosition - viewPosition;

  let r = getRayMatrix();
  let s = getSize();

  let ray = normalize(r * toSurface);

  var hit: VoxelHit;
  if (getIsInside() > 0.0) {
    hit = traceIntoVolume(getInsideOrigin(), ray, s);
  }
  else {
    let origin = saturate(uv.xyz) * vec3<f32>(s);
    hit = traceOnVolume(origin, ray, s);
  }
  
  if (hit.index == 0u) { discard; }

  let m = getMatrix();
  let worldPosition = m * vec4<f32>(hit.position - vec3<f32>(s) / 2.0, 1.0);
  let depth = worldToDepth(worldPosition);

  return DepthFragment(alpha, depth);
}
`, {SurfaceFragment, DepthFragment, getViewPosition, worldToDepth});

const VERTEX_BINDINGS = bundleToAttributes(vertexShader);
const SURFACE_BINDINGS = bundleToAttributes(surfaceShader);

const INSIDE_PIPELINE = {
  depthStencil: {
    compare: 'always',
  },
};

export const VoxLayer: LC<VoxLayerProps> = memo((props: VoxLayerProps) => {
  const {
    shape,
    palette,
    pbr,
  } = props;

  const geometry = useOne(() => makeBoxGeometry({
    uvw: true,
    offset: [0.5, 0.5, 0.5],
    tile: [0.5, 0.5, 0.5],
  }));

  return gather(
    use(GeometryData, {geometry}),
    ([mesh]: Record<string, StorageSource>) => {
      const {positions, normals, uvs} = mesh;

      const DEBUG_STEPS = useDebugContext()?.voxel?.iterations;
      const defs = useOne(() => ({DEBUG_STEPS}), DEBUG_STEPS);

      const parent = useMatrixContext();
      const [matrix, inverse, ray, normal] = useOne(() => {
        const m = mat4.clone(parent);
        const i = mat4.clone(m);
        mat4.invert(i, i);

        const r = mat3.fromMat4(mat3.create(), parent);
        mat3.invert(r, r);

        const n = mat3.normalFromMat4(mat3.create(), parent);
        return [m, i, r, n];
      }, parent);

      const local3 = vec3.create();
      const origin3 = vec3.create();

      const size = useCallback(() => shape[0].size, [shape]);
      const inside = useCallback((uniforms: Record<string, Ref<any>>) => {
        const {size} = shape[0];
        const sx = size[0] / 2;
        const sy = size[1] / 2;
        const sz = size[2] / 2;

        const {viewPosition, viewMatrix, viewNearFar} = uniforms;
        const {current: viewP} = viewPosition;
        const {current: viewM} = viewMatrix;
        const {current: viewNF} = viewNearFar;

        vec3.copy(local3, viewP);
        vec3.transformMat4(local3, local3, inverse);

        local3[0] = clamp(local3[0], -sx, sx);
        local3[1] = clamp(local3[1], -sy, sy);
        local3[2] = clamp(local3[2], -sz, sz);

        vec3.transformMat4(local3, local3, matrix);
        
        const z = local3[0] * viewM[2] + local3[1] * viewM[6] + local3[2] * viewM[10] + viewM[14];
        return z + viewNF[0] * 4;
      }, [matrix, inverse])

      const origin = useCallback((uniforms: Record<string, Ref<any>>) => {
        const {size} = shape[0];
        const sx = size[0] / 2;
        const sy = size[1] / 2;
        const sz = size[2] / 2;

        const {viewPosition} = uniforms;
        const {current: viewP} = viewPosition;
        vec3.copy(origin3, viewP);
        vec3.transformMat4(origin3, origin3, inverse);
        origin3[0] += sx;
        origin3[1] += sy;
        origin3[2] += sz;

        return origin3;
      }, [inverse]);

      const boundPosition = useBoundShader(vertexShader, VERTEX_BINDINGS, [positions, size]);
      const getPosition = useLambdaSource(boundPosition, positions);

      const insideRef = useShaderRef(false);
      const originRef = useShaderRef([0, 0, 0]);

      const getSurface = useBoundShader(surfaceShader, SURFACE_BINDINGS, [
        matrix, ray, normal, size, insideRef, originRef,
        ...shape, palette, pbr,
      ], defs);
      const getDepth = bindEntryPoint(getSurface, "mainDepthOnly");

      return [
        use(ShaderLitMaterial, {
          depth: getDepth,
          surface: getSurface,
          apply: applyPBRMaterial,
          children: [
            use(FaceLayer, {
              positions: getPosition,
              uvs,
              normals,
              depth: true,
              shaded: true,
              shouldDispatch: (uniforms: Record<string, any>) => {
                insideRef.current = inside(uniforms);
                return insideRef.current < 0;
              },
            }),
            use(FaceLayer, {
              positions: getPosition,
              uvs,
              normals,
              depth: true,
              shaded: true,
              side: 'back',
              pipeline: INSIDE_PIPELINE,
              shouldDispatch: (uniforms: Record<string, any>) => {
                //insideRef.current = inside(uniforms);
                originRef.current = origin(uniforms);
                return insideRef.current >= 0;
              },
            }),
          ],
        })
      ];
    }
  );
}, 'VoxLayer');
