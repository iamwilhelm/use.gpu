import type { LC } from '@use-gpu/live';
import type { Emit, StorageSource, Time } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

import React, { use } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat,
  ArrayData, Data, RawData,
  OrbitCamera, OrbitControls,
  Pick, Cursor,
  Animate, Keyframe,
  LinearRGB,
  PointLayer, DataShader,
} from '@use-gpu/workbench';
import {
  Plot, Cartesian, Polar, Axis, Grid, Sampled, ImplicitSurface,
} from '@use-gpu/plot';
import { wgsl } from '@use-gpu/shader/wgsl';
import { SurfaceControls } from '../../ui/surface-controls';

let t = 0;
let π = Math.PI;

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

const f = (x: number, y: number, z: number, t: number) => {
  x = x * 2;
  y = y * 2;
  z = z * 2;
  
  //return Math.max(Math.abs(x)/1.5, Math.abs(y - 6)*2 - Math.cos(t / 3) * .5, Math.abs(z*.59)) - 3.02 - Math.cos(t / 5)*.65;

  const f = Math.cos(t * .5) * .5 + .5;

  const swirl = Math.sin(x)*Math.cos(y) + Math.sin(y)*Math.cos(z) + Math.sin(z)*Math.cos(x);
  const grid = Math.cos(x) + Math.cos(y) + Math.cos(z);
  return lerp(swirl, grid, f);
}

const EXPR_POSITION = (emit: Emit, x: number, y: number, z: number, time: Time) => {
  const t = time.elapsed / 1000;
  emit(x, y, z, t);
}

const EXPR_VALUE = (emit: Emit, x: number, y: number, z: number, time: Time) => {
  const t = time.elapsed / 1000;
  emit(f(x, y, z, t));
}

const EXPR_NORMAL = (emit: Emit, x: number, y: number, z: number, time: Time) => {
  const t = time.elapsed / 1000;
  const e = 1e-3;

  const v  = f(x, y, z, t);
  const vx = f(x + e, y, z, t);
  const vy = f(x, y + e, z, t);
  const vz = f(x, y, z + e, t);
  
  const nx = vx - v;
  const ny = vy - v;
  const nz = vz - v;

  const nl = 1/Math.sqrt(nx*nx + ny*ny + nz*nz);

  emit(nx*nl, ny*nl, nz*nl);
};

export const PlotImplicitSurfacePage: LC = () => {
  
  const colorizeShader = wgsl`
    @link fn getSample(i: u32) -> f32 {};

    fn main(i: u32) -> vec4<f32> {
      let sample = getSample(i);
      return vec4<f32>(sample, max(0.0, sample * .2) + max(0.0, -sample * .3), -sample, 1.0);
    }
  `;

  const root = document.querySelector('#use-gpu .canvas');
  const keyframes = [[0, 0], [23, 1.0]] as Keyframe<number>[];

  const view = (
    <SurfaceControls
      container={root}
      hasInspect
      render={({inspect, mode, level}) =>
        <Loop>
          <LinearRGB>
            <Cursor cursor="move" />
            <Pass>
              <Plot>
                <Animate prop='bend' keyframes={keyframes} pause={1} mirror>
                  <Polar
                    bend={0}
                    range={[[-π, π], [1, 5], [-π, π]]}
                    scale={[π/2, 1, π/2]}
                  >
                    <Grid
                      axes='xy'
                      width={2}
                      first={{ unit: π, base: 2, detail: 3, divide: 5, end: true }}
                      second={{ detail: 32, divide: 5, end: true }}
                      depth={0.5}
                      zBias={-1}
                    />
                    <Grid
                      axes='xz'
                      width={2}
                      first={{ unit: π, base: 2, detail: 3, divide: 5, end: true }}
                      second={{ unit: π, base: 2, detail: 32, divide: 5, end: true }}
                      depth={0.5}
                      zBias={-1}
                    />

                    <Axis
                      axis='x'
                      detail={32}
                      width={5}
                      color={[0.75, 0.75, 0.75, 1]}
                      depth={0.5}
                    />
                    <Axis
                      axis='y'
                      width={5}
                      color={[0.75, 0.75, 0.75, 1]}
                      detail={8}
                      depth={0.5}
                    />
                    <Axis
                      axis='z'
                      width={5}
                      color={[0.75, 0.75, 0.75, 1]}
                      detail={8}
                      depth={0.5}
                    />
                    <Sampled
                      axes='xyz'
                      format='vec3<f32>'
                      size={[36, 24, 36]}
                      padding={1}
                      expr={EXPR_POSITION}
                      time
                      live
                      render={(positions: StorageSource) => (
                        <Sampled
                          axes='xyz'
                          format='vec3<f32>'
                          size={[36, 24, 36]}
                          padding={1}
                          expr={EXPR_NORMAL}
                          time
                          live
                          render={(normals: StorageSource) =>
                            <Sampled
                              axes='xyz'
                              format='f32'
                              size={[36, 24, 36]}
                              padding={1}
                              expr={EXPR_VALUE}
                              time
                              live
                              render={(values: StorageSource) => [
                                <ImplicitSurface
                                  normals={normals}
                                  level={level}
                                  method="linear"
                                  padding={1}
                                  color={[0.8, 0.8, 1.0, 1.0]}
                                />,
                                inspect ? (
                                  <DataShader
                                    shader={colorizeShader}
                                    source={values}
                                    render={(colorizedValues: ShaderModule) => (
                                      <PointLayer
                                        positions={positions}
                                        colors={mode === 'normal' ? normals : colorizedValues}
                                        size={3}
                                        depth={1}
                                      />
                                    )}
                                  />
                                ) : null,
                              ]}
                            />
                          }
                        />
                      )}
                    />
                  </Polar>
                </Animate>
              </Plot>
            </Pass>
          </LinearRGB>
        </Loop>
    } />
  );

  return (
    <OrbitControls
      radius={5}
      bearing={0.5}
      pitch={0.3}
      render={(radius: number, phi: number, theta: number) =>
        <OrbitCamera
          radius={radius}
          phi={phi}
          theta={theta}
        >
          {view}
        </OrbitCamera>
      }
    />
  );
};
