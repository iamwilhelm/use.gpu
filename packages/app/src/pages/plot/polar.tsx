import { LC } from '@use-gpu/live/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { use } from '@use-gpu/live';
import React from '@use-gpu/live/jsx';

import {
  Loop, Draw, Pass, Flat,
  ArrayData, Data, RawData,
  OrbitCamera, OrbitControls,
  Pick, Cursor,
  Animation,
  LinearRGB,
} from '@use-gpu/workbench';
import {
  Plot, Polar, Axis, Grid, Label, Line, Sampled, Scale, Surface, Tick, Transpose,
} from '@use-gpu/plot';
const π = Math.PI;
const EPS = 1e-3;

const numberFormatter = (x: number) => x.toFixed(2).replace(/\.0+$/, '');

const thetaFormatter = (θ: number) => {
  if (θ === 0) return '0';
  const num = Math.abs(θ / π);
  const denom = Math.abs(π / θ);
  return `${θ < 0 ? '-' : ''}${num > 1 + EPS ? numberFormatter(num) : ''}π${denom > 1 + EPS ? '/' + numberFormatter(denom) : ''}`;
};

export const PlotPolarPage: LC = () => {
  
  const view = (
    <Loop>
      <Draw>
        <Pass>
          <Plot>
            <Animation
              loop
              mirror
              delay={0}
              frames={[
                [0, 0],
                [1, 0],
                [10, 1],
                [11, 1],
              ]}
              prop='bend'
            >
              <Polar
                on="x"
                range={[[-π, π], [0, 1]]}
                scale={[1, 1/2, 1/2]}
              >
                <Grid
                  axes='xy'
                  width={2}
                  first={{ unit: π, base: 2, divide: 8, end: true }}
                  second={{ detail: 64, divide: 5 }}
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
                  unit={π}
                  base={2}
                  divide={4}
                  end={true}
                  axis='x'
                >
                  <Tick
                    size={20}
                    width={5}
                    offset={[0, 1, 0]}
                    color={[0.75, 0.75, 0.75, 1]}
                    depth={0.5}
                  />
                  <Label
                    placement='bottom'
                    color='#80808080'
                    size={24}
                    offset={16}
                    expand={5}
                    depth={0.5}
                    format={thetaFormatter}
                  />
                  <Label
                    placement='bottom'
                    color='#ffffff'
                    size={24}
                    offset={16}
                    expand={0}
                    depth={0.5}
                    format={thetaFormatter}
                  />
                </Scale>

                <Axis
                  axis='y'
                  width={5}
                  color={[0.75, 0.75, 0.75, 1]}
                  detail={8}
                  depth={0.5}
                />

                <Sampled
                  axes='x'
                  format='vec2<f32>'
                  size={[256]}
                  expr={(emit, θ) => {
                    const r = Math.cos(θ * 8) * .4 + .6;
                    emit(θ, r);
                  }}
                >
                  <Line
                    width={4}
                    color={0x3090FF}
                    depth={0.5}
                    zBias={1}
                  />
                </Sampled>
              </Polar>
            </Animation>
          </Plot>
        </Pass>
      </Draw>
    </Loop>
  );

  return (
    <Flat relative>
      {view}
    </Flat>
  );
};
