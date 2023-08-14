import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { TextureSource } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import React, { Gather, memo, useContext, useOne } from '@use-gpu/live';
import { bindBundle, wgsl } from '@use-gpu/shader/wgsl';
import { vec3 } from 'gl-matrix';

import {
  Loop, Pass, Flat, Animate, LinearRGB,
  GeometryData, PBRMaterial, ImageCubeTexture,
  OrbitCamera, OrbitControls, PanControls,
  Pick, Cursor, Data, PointLayer, LineLayer,
  LineSegments, CompositeData,
  AxisHelper, PrefilteredEnvMap,
  ShaderLitMaterial, KeyboardContext,

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

  @optional @link fn getEnvironmentMap(uvw: vec3<f32>, level: u32) -> vec4<f32> { return vec4<f32>(1.0); };

  fn main(
    N: vec3<f32>,
    V: vec3<f32>,
    surface: SurfaceFragment,
  ) -> vec3<f32> {
    let R = 2.0 * dot(N, V) * N - V;
    let indirect = getEnvironmentMap(N, 10u).xyz;
    
    let uv = encodeOctahedral(surface.normal.xyz);
    let grid = fract(uv * 64.0 + .25);
    let xy = select(vec2<f32>(0.0), vec2<f32>(1.0), grid > vec2<f32>(0.5));
    let dots = (xy.x * xy.y);
    return indirect + 0.0 * 0.025 * dots * vec3<f32>(uv * .5 + .5, 0.0);
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
                          <Block margin={[0, 600, 0, 0]}>
                            <PrefilteredEnvMap
                              texture={texture}
                              render={(cubeMap, texture) => texture ? (
                                <Absolute left={520} top={0}>
                                  <Block
                                    width={texture.size[0] * 500 / 512}
                                    height={texture.size[1] * 500 / 512}
                                    fill={[0, 0, 0, .25]}
                                    image={{texture, fit: 'scale'}}
                                  />
                                </Absolute>
                              ) : null}
                            />
                          </Block>
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

const Camera: LC = ({children}: PropsWithChildren<object>) => {
  const { useKeyboard } = useContext(KeyboardContext);
  const { keyboard } = useKeyboard();
  const {keys} = keyboard;

  return (
    <OrbitControls
      active={!keys['alt']}
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
}
