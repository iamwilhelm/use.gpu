import type { LC } from '@use-gpu/live';
import type { Tracks } from '@use-gpu/workbench';

import React, { use } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat,
  RawData, PointLayer,
  OrbitCamera, OrbitControls,
  Animate,
  LinearRGB,
} from '@use-gpu/workbench';
import {
  Plot, Spherical, Axis, Grid, Label, Line, Sampled, Scale, Surface, Tick, Transpose,
} from '@use-gpu/plot';
import {
  WebMercator, MVTiles, MapboxProvider,
} from '@use-gpu/map';

import { PlotControls } from '../../ui/plot-controls';

const π = Math.PI;
const τ = π*2;
const EPS = 1e-3;

const numberFormatter = (x: number) => x.toFixed(2).replace(/\.0+$/, '');

const thetaFormatter = (θ: number) => {
  if (θ === 0) return '0';
  const num = Math.abs(θ / π);
  const denom = Math.abs(π / θ);
  return `${θ < 0 ? '-' : ''}${num > 1 + EPS ? numberFormatter(num) : ''}π${denom > 1 + EPS ? '/' + numberFormatter(denom) : ''}`;
};

export const MapWebMercatorPage: LC = () => {
  
  const accessToken = process.env.MAPBOX_TOKEN;
  
  const tracks = {
    zoom: [
      [0, 1],
      [10, 2.5],
      [20, 2.5],
      [30, 2.5],
      [40, 5],
      [50, 5],
      [60, 1],
    ],
    long: [
      [0, 0],
      [10, 0],
      [20, 0],
      [30, 50],
      [40, 50],
      [50, 0],
      [60, 0],
    ],
    lat: [
      [0, 0],
      [10, 30],
      [20, 30],
      [30, 30],
      [40, -30],
      [50, -30],
      [60, 0],
    ],
    bend: [
      [0, 0],
      [10, 0],
      [20, 1],
      [30, 1],
      [40, 1],
      [50, 1],
      [60, 0],
    ],
  } as Tracks;

  const view = () => (
    <Loop>
      <LinearRGB>
        <Pass>
          {/*
          <RawData format="vec3<f32>" data={[0, 0, 0]} length={1} render={
            (data) => <PointLayer positions={data} color={[1, 1, 1, 1]} size={20} />
          } />
          */}

          <Plot>
            <Animate
              loop
              delay={1}
              tracks={tracks}
              duration={65}
            >
              <WebMercator
                native
                centered
                bend={1}
                xrange={[[-1, 1], [-2/3, 2/3]]}
                long={90}
                lat={20}
                zoom={1}
                scale={[3, 3, 3]}
              >
                <MapboxProvider accessToken={accessToken}>
                  <MVTiles />
                </MapboxProvider>
              </WebMercator>
              <WebMercator
                centered
                bend={1}
                xrange={[[-1, 1], [-2/3, 2/3]]}
                long={90}
                lat={20}
                zoom={1}
                scale={[3, 3, 3]}
              >
                <Grid
                  axes='xy'
                  origin={[0, 0, 0]}
                  width={2}
                  first={{ unit: 360, base: 2, detail: 48, divide: 8, end: true }}
                  second={{ unit: 360, base: 2, detail: 48, divide: 8, end: true }}
                  depth={0.5}
                  zBias={-1}
                />

                <Axis
                  axis='x'
                  width={5}
                  color={[0.75, 0.75, 0.75, 1]}
                  depth={0.5}
                  detail={64}
                />
                <Scale
                  unit={360}
                  base={2}
                  divide={8}
                  axis='x'
                >
                  <Tick
                    size={20}
                    width={5}
                    offset={[0, 1, 0]}
                    color={[0.75, 0.75, 0.75, 1]}
                    depth={0.5}
                  />
                </Scale>

                <Axis
                  axis='y'
                  width={5}
                  origin={[45, 0, 0]}
                  color={[0.75, 0.75, 0.75, 1]}
                  detail={32}
                  depth={0.5}
                />
                <Scale
                  origin={[45, 0, 0]}
                  unit={360}
                  base={2}
                  divide={8}
                  axis='y'
                >
                  <Tick
                    size={20}
                    width={5}
                    offset={[1, 0, 0]}
                    color={[0.75, 0.75, 0.75, 1]}
                    depth={0.5}
                  />
                </Scale>
                
                <Grid
                  axes='xy'
                  origin={[0, 0, 1]}
                  width={2}
                  first={{ unit: 360, base: 2, detail: 48, divide: 8, end: true }}
                  second={{ unit: 360, base: 2, detail: 48, divide: 8, end: true }}
                  color={[0.25, 0.25, 0.25, 1]}
                  depth={0.5}
                  zBias={-1}
                />

              </WebMercator>
            </Animate>
          </Plot>
        </Pass>
      </LinearRGB>
    </Loop>
  );

  const root = document.querySelector('#use-gpu .canvas');

  return (
  /*
    <PlotControls
      container={root}
      hasNormalize
      render={({normalize}) => */
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
              {view()}
            </OrbitCamera>
          }
        />
   //   }
//    />
  );
};
