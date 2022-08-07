import type { LC } from '@use-gpu/live';
import type { Emit, StorageSource } from '@use-gpu/core';

import React, { use } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat,
  ArrayData, Data, RawData,
  OrbitCamera, OrbitControls,
  Pick, Cursor,
  Animate,
  LinearRGB,
  DualContourLayer, PointLayer,
} from '@use-gpu/workbench';
import {
  Plot, Cartesian, Polar, Axis, Grid, Sampled,
} from '@use-gpu/plot';

let t = 0;
let π = Math.PI;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const f = (x: number, y: number, z: number, t: number) => {
  x = x * 2;
  y = y * 2;
  z = z * 2;
  

  //return Math.max(Math.abs(x), Math.abs(y) - Math.cos(t / 3), Math.abs(z*.99)) - 5.02 - Math.cos(t / 5);
  //return Math.sqrt(x*x + (y-1)*(y-1) + z*z) - 4.0 - Math.cos(t / 5);

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

  /*
  const v  = f(x, y, z, t);
  const vx = f(x + e, y, z, t);
  const vy = f(x, y + e, z, t);
  const vz = f(x, y, z + e, t);
  
  const nx = vx - v;
  const ny = vy - v;
  const nz = vz - v;
  */

  const nx = f(x + e, y, z, t) - f(x - e, y, z, t);
  const ny = f(x, y + e, z, t) - f(x, y - e, z, t);
  const nz = f(x, y, z + e, t) - f(x, y, z - e, t);

  const nl = 1/Math.sqrt(nx*nx + ny*ny + nz*nz);

  emit(nx*nl, ny*nl, nz*nl);
};

export const PlotImplicitSurfacePage: LC = () => {
  
  const view = (
    <Loop>
      <LinearRGB>
        <Cursor cursor="move" />
        <Pass>
          <Plot>
            <Animate prop='bend' keyframes={[[0, 0], [23, 1.0]]} pause={1} mirror>
              <Polar
                bend={0}
                range={[[-π, π], [1, 5], [-π, π]]}
                scale={[π, 2, π]}
              >
                <Grid
                  axes='xy'
                  width={2}
                  first={{ detail: 3, divide: 5 }}
                  second={{ detail: 32, divide: 5 }}
                  depth={0.5}
                  zBias={-1}
                />
                <Grid
                  axes='xz'
                  width={2}
                  origin={[-3, 0, -3]}
                  first={{ detail: 3, divide: 5 }}
                  second={{ detail: 32, divide: 5 }}
                  depth={0.5}
                  zBias={-1}
                />

                <Axis
                  axis='x'
                  detail={32}
                  width={5}
                  origin={[0, 0, 0]}
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
                  origin={[0, 0, 0]}
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
                      format='f32'
                      size={[36, 24, 36]}
                      padding={1}
                      expr={EXPR_VALUE}
                      time
                      live
                      render={(values: StorageSource) => (
                        <Sampled
                          axes='xyz'
                          format='vec3<f32>'
                          size={[36, 24, 36]}
                          padding={1}
                          expr={EXPR_NORMAL}
                          time
                          live
                          render={(normals: StorageSource) => [
                            <DualContourLayer
                              values={values}
                              normals={normals}
                              method="linear"
                              padding={1}
                              range={[[-π, π], [1, 5], [-π, π]]}
                              color={[0.4, 1.0, 0.6, 1.0]}
                            />,
                            /*
                            <PointLayer
                              positions={positions}
                              colors={normals}
                              size={3}
                              depth={1}
                            />,
                            */
                          ]}
                        />  
                      )}
                    />
                  )}
                />
              </Polar>
            </Animate>
          </Plot>
        </Pass>
      </LinearRGB>
    </Loop>
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
