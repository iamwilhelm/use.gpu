import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { TextureSource } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import React, { Gather, memo, useOne } from '@use-gpu/live';
import { bindBundle, wgsl } from '@use-gpu/shader/wgsl';
import { vec3 } from 'gl-matrix';

import {
  Loop, Pass, Flat, Animate, LinearRGB,
  GeometryData, PBRMaterial, ImageCubeTexture,
  OrbitCamera, OrbitControls,
  Pick, Cursor,
  PointLight, AmbientLight,
  AxisHelper,
  ShaderLitMaterial,

  makeSphereGeometry,
  useBoundShader,
} from '@use-gpu/workbench';

import {
  Scene, Node, Mesh,
} from '@use-gpu/scene';

import { SurfaceFragment } from '@use-gpu/wgsl/use/types.wgsl';
import { getViewPosition } from '@use-gpu/wgsl/use/view.wgsl';
import { applyPBRMaterial } from '@use-gpu/wgsl/material/pbr-apply.wgsl';

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

  @optional @link fn getEnvironmentMap(uvw: vec3<f32>) -> vec4<f32> { return vec4<f32>(1.0); };

  fn main(
    N: vec3<f32>,
    V: vec3<f32>,
    surface: SurfaceFragment,
  ) -> vec3<f32> {
    let R = 2.0 * dot(N, V) * N - V;
    return getEnvironmentMap(R).xyz;
  };
`, {SurfaceFragment});

export const DebugEnvMapPage: LC = (props) => {
  const geometry = useOne(() => makeSphereGeometry({ width: 2, uvw: true }));

  let HDR = true;

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
        const environment = useBoundShader(getEnvironment, [texture]);

        return (
          <LinearRGB tonemap="aces" gain={1}>
            <Loop>
              <Cursor cursor='move' />
              <Camera>
                <Pass >

                  <AxisHelper size={2} width={3} />

                  <Scene>
                    <ShaderLitMaterial
                      surface={surface}
                      environment={environment}
                    >
                      <Mesh mesh={mesh} shaded />
                    </ShaderLitMaterial>
                  </Scene>

                </Pass>
              </Camera>
            </Loop>
          </LinearRGB>
        );
      }}
    />
  );
};

const Camera: LC = ({children}: PropsWithChildren<object>) => (
  <OrbitControls
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
