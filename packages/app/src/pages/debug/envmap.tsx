import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { TextureSource } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import React, { Gather, memo, useOne } from '@use-gpu/live';
import { bindBundle, wgsl } from '@use-gpu/shader/wgsl';
import { vec3 } from 'gl-matrix';

import {
  Loop, Pass, Flat, Animate, LinearRGB,
  GeometryData, PBRMaterial, ImageCubeTexture,
  OrbitCamera, OrbitControls, PanControls,
  Pick, Cursor, Data, PointLayer,
  AxisHelper, PrefilteredEnvMap,
  ShaderLitMaterial,

  makeSphereGeometry,
  useBoundShader,
} from '@use-gpu/workbench';

import {
  Scene, Node, Mesh,
} from '@use-gpu/scene';
import {
  Cartesian, Grid, Embedded,
} from '@use-gpu/plot';
import {
  UI, Layout, Absolute, Block, Embed,
} from '@use-gpu/layout';

import { SurfaceFragment } from '@use-gpu/wgsl/use/types.wgsl';
import { getViewPosition } from '@use-gpu/wgsl/use/view.wgsl';
import { applyPBRMaterial } from '@use-gpu/wgsl/material/pbr-apply.wgsl';
import { encodeOctahedral } from '@use-gpu/wgsl/codec/octahedral.wgsl';

const π = Math.PI;
const τ = π * 2;

const φ_1_1 = 1.0 / 1.6180339887498950;
const φ_2_1 = 1.0 / 1.3247179572447458;
const φ_3_1 = 1.0 / 1.2207440846057596;
const φ_4_1 = 1.0 / 1.1673039782614187;

const φ_2_2 = φ_2_1 * φ_2_1;

const φ_3_2 = φ_3_1 * φ_3_1;
const φ_3_3 = φ_3_1 * φ_3_2;

const φ_4_2 = φ_4_1 * φ_4_1;
const φ_4_3 = φ_4_1 * φ_4_2;
const φ_4_4 = φ_4_2 * φ_4_2;

const fields = [
  ['vec2<f32>', o => o],
];

const sqr = (x: number) => x * x;

const emit = (n: number, f: (i: number, u: number) => number[]) => {
  const out = [];
  for (let i = 0; i < n; ++i) {
    out.push(f(i, (i + .5) / n));
  }
  return out;
}

const emit2 = (w: number, h: number, f: (i: number, j: number, u: number, v: number) => number[]) => {
  const out = [];
  for (let j = 0; j < h; ++j) {
    for (let i = 0; i < w; ++i) {
      out.push(f(i, j, (i + .5) / w, (j + .5) / h));
    }
  }
  return out;
}

const points1 = [];
false && points1.push(...emit(100, (i, u) => {
  const th = ((i * φ_1_1) % 1) * τ;
  const r = u;
  const lr = Math.sqrt(r);
  
  const xx = th;
  const yy = r - 1.5;
  //return [xx, yy];
  
  const x = Math.cos(th) * lr;
  const y = Math.sin(th) * lr;
  
  return [x, y];
}));
true && points1.push(...emit2(10, 10, (i, j, u, v) => {
  const th = (((i * φ_3_1 + j * φ_3_2) / 2) % 1) * τ;
  const r = (((j + 1) * φ_3_3) % 1);
  const lr = Math.sqrt(r);
  
  const xx = th;
  const yy = r - 2.5;
  //return [xx, yy];
  
  const x = Math.cos(th) * lr;
  const y = Math.sin(th) * lr;
  
  return [x, y];
}));

const points2 = [];
true && points2.push(...emit(100, (i, u) => {

  const th = ((i * φ_2_2) % 1) * τ;
  const r = (i * φ_2_1) % 1;
  const lr = Math.sqrt(r);
  
  const xx = th;
  const yy = r + .5;
  //return [xx, yy];

  const x = Math.cos(th) * lr;
  const y = Math.sin(th) * lr;
  
  return [x, y];
}));

const points3 = [];
/*
const n1 = points1.length;
const n2 = points2.length;
for (let i = 0; i < n1; ++i) {
  const [a, b] = points1[i];
  for (let j = 0; j < n2; ++j) {
    const [c, d] = points2[j];
    points3.push([a + c, b + d]);
  }
}
*/

const selfDist = (points: number[]) => {
  let countD = 0;
  let accumD = 0;

  let count = 0;
  let accumX = 0;
  let accumY = 0;
  let accumX2 = 0;
  let accumY2 = 0;

  let min = Infinity;
  let max = 0;

  const n = points.length;
  for (let i = 0; i < n; ++i) {
    const [x1, y1] = points[i];
    accumX += x1;
    accumY += y1;
    accumX2 += x1*x1;
    accumY2 += y1*y1;
    count++;

    for (let j = i + 1; j < n; ++j) {
      const [x2, y2] = points[j];
      const d = Math.sqrt(sqr(x1 - x2) + sqr(y1 - y2));
      if (d === 0) console.warn(i, '==', j)
      accumD += d;
      countD++;
      min = Math.min(min, d);
      max = Math.max(max, d);
    }
  }
  const avg = accumD / Math.max(1, countD);

  const m1x = accumX / Math.max(1, count);
  const m1y = accumY / Math.max(1, count);
  const m2x = accumX2 / Math.max(1, count);
  const m2y = accumY2 / Math.max(1, count);

  const mean = [m1x, m1y];
  const varX = m2x - m1x * m1x;
  const varY = m2y - m1y * m1y;
  const std = Math.sqrt(varX + varY);

  return {min, max, avg, count, mean, std};
};

console.log('p1', selfDist(points1));
console.log('p2', selfDist(points2));
console.log('p3', selfDist(points3));


const getSurface = bindBundle(wgsl`
  @link struct SurfaceFragment {};

  fn main(
    color: vec4<f32>,
    uv: vec4<f32>,
    st: vec4<f32>,
    normal: vec4<f32>,
    tangent: vec4<f32>,
    position: vec4<f32>,
  ) -> SurfaceFragment {

    return SurfaceFragment(
      position,
      normal,
      vec4<f32>(1.0),
      vec4<f32>(0.0),
      vec4<f32>(1.0, 0.1, 0.0, 0.0),
      1.0,
      0.0,
    );
  };
`, {SurfaceFragment});

const getEnvironment = bindBundle(wgsl`
  @link struct SurfaceFragment {};
  @link fn encodeOctahedral(xyz: vec3<f32>) -> vec2<f32>;

  @optional @link fn getEnvironmentMap(uvw: vec3<f32>) -> vec4<f32> { return vec4<f32>(1.0); };

  fn main(
    N: vec3<f32>,
    V: vec3<f32>,
    surface: SurfaceFragment,
  ) -> vec3<f32> {
    let R = 2.0 * dot(N, V) * N - V;
    //let indirect = getEnvironmentMap(R).xyz;
    let indirect = getEnvironmentMap(N).xyz;//getEnvironmentMap(R).xyz * 0.0;
    
    let uv = encodeOctahedral(surface.normal.xyz);
    let grid = fract(uv * 64.0 + .25);
    let xy = select(vec2<f32>(0.0), vec2<f32>(1.0), grid > vec2<f32>(0.5));
    let dots = (xy.x * xy.y);
    return indirect + 0.1 * dots * vec3<f32>(uv * .5 + .5, 0.0);
  };
`, {SurfaceFragment, encodeOctahedral});

export const DebugEnvMapPage: LC = (props) => {
  const geometry = useOne(() => makeSphereGeometry({ width: 2, uvw: true }));

  let HDR = false;

  return (
    <Gather
      children={[
        <GeometryData {...geometry} />,
        <ImageCubeTexture
          urls={HDR ? [
            "/textures/cube/pisaHDR/px.hdr",
            "/textures/cube/pisaHDR/nx.hdr",
            "/textures/cube/pisaHDR/py.hdr",
            "/textures/cube/pisaHDR/ny.hdr",
            "/textures/cube/pisaHDR/pz.hdr",
            "/textures/cube/pisaHDR/nz.hdr",
          ] : [
            "/textures/cube/pisaRGBM16/px.png",
            "/textures/cube/pisaRGBM16/nx.png",
            "/textures/cube/pisaRGBM16/py.png",
            "/textures/cube/pisaRGBM16/ny.png",
            "/textures/cube/pisaRGBM16/pz.png",
            "/textures/cube/pisaRGBM16/nz.png",
          ]}
          format={HDR ? "hdr" : "rgbm16"}
        />,
      ]}
      then={([
        mesh,
        texture,
      ]: [
        Record<string, ShaderSource>,
        TextureSource,
      ]) => {
        const surface = getSurface;

        return (
          <LinearRGB tonemap="aces" gain={1}>
            <Loop>
              <Cursor cursor='move' />
              <Camera>
                <Pass >
                
                  <AxisHelper size={2} width={3} />

                  <Scene>
                    <PrefilteredEnvMap
                      texture={texture}
                      render={(cubeMap) => {
                        const environment = useBoundShader(getEnvironment, [cubeMap]);
                        return (
                          <ShaderLitMaterial
                            surface={surface}
                            environment={environment}
                          >
                            <Mesh mesh={mesh} shaded />
                          </ShaderLitMaterial>
                        );
                      }}
                    />
                  </Scene>

                </Pass>
              </Camera>
              <PanControls
                active={true}
                render={(x, y, zoom) =>
                  <Flat x={x} y={y} zoom={zoom}>
                    <Pass overlay>
                      <UI>
                        <Layout>
                          <PrefilteredEnvMap
                            texture={texture}
                            render={(cubeMap, texture) => (
                              <Absolute left={520} top={0}>
                                <Block width={300} height={300} fill={[0, .5, 0, 1]} image={{texture, fit: 'scale'}} />
                              </Absolute>
                            )}
                          />
                          <Embed width={300} height={300}>
                            <Embedded>
                              <Cartesian
                                range={[[-4, 4], [-4, 4]]}
                                scale={[250, 250]}
                                position={[250, 250]}
                              >
                                <Grid axes="xy" width={2} />
                                <Data
                                  data={points1}
                                  fields={fields}
                                  render={(positions) => 
                                    <PointLayer positions={positions} size={5} color={[1, 0.5, 0.25, 1]} />
                                  }
                                />
                                <Data
                                  data={points2}
                                  fields={fields}
                                  render={(positions) => 
                                    <PointLayer positions={positions} size={5} color={[0.5, 0.75, 1, 1]} />
                                  }
                                />
                                <Data
                                  data={points3}
                                  fields={fields}
                                  render={(positions) => 
                                    <PointLayer positions={positions} size={5} color={[0.5, 0.5, 0.5, 0.5]} />
                                  }
                                />
                              </Cartesian>
                            </Embedded>
                          </Embed>
                        </Layout>
                      </UI>
                    </Pass>
                  </Flat>
                }
              />
            </Loop>
          </LinearRGB>
        );
      }}
    />
  );
};

const Camera: LC = ({children}: PropsWithChildren<object>) => (
  <OrbitControls
    active={true}
    radius={5}
    bearing={0.5}
    pitch={0.3}
    render={(radius: number, phi: number, theta: number, target: vec3) =>
      <OrbitCamera
        radius={radius}
        phi={phi}
        theta={theta}
        target={target}
      >
        {children}
      </OrbitCamera>
    }
  />
);
