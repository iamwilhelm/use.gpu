import type { LC, PropsWithChildren } from '@use-gpu/live';

import React, { Gather, yeet, use, useMemo } from '@use-gpu/live';
import { wgsl } from '@use-gpu/shader/wgsl';

import {
  Loop, Pass, Flat,
  ArrayData, Data, DataShader, RawData,
  OrbitCamera, OrbitControls,
  Pick, Cursor, Fetch,
  PointLayer,
  LinearRGB,
} from '@use-gpu/workbench';
import {
  Plot, Cartesian, Axis, Grid, Label, Line, Sampled, Scale, Surface, Tick, Transpose,
} from '@use-gpu/plot';
import { BinaryControls } from '../../ui/binary-controls';
import { vec3 } from 'gl-matrix';

let t = 0;

// Turn binary buffer into XYZ points for consecutive byte triplets.
const arrayBufferToXYZ = (buffer: ArrayBuffer, mode: string) => {
  const data = new Uint8Array(buffer);
  const l = data.length;

  // Allocate space for positions and colors (vec4<u8> = u32)
  const n = Math.max(1, l - 2);
  const alloc = Math.max(4, Math.min(256 * 256 * 256 * 4, n * 4));
  const positions = new Uint8Array(alloc);
  const colors = new Uint8Array(alloc);

  // Build 3D histogram of triplets
  const histo = new Uint32Array(256 * 256 * 256);
  let max = 0;
  for (let i = 0; i < n; ++i) {
    const x = data[i];
    const y = data[i + 1];
    const z = data[i + 2];
    const k = (z << 16) | (y << 8) | x;

    const v = histo[k] = histo[k] + 1;
    max = Math.max(max, v);
  }

  // Make data points for non-empty bins
  const h = histo.length;
  let bins = 0;
  for (let k = 0, p = 0, c = 0; k < h; ++k) if (histo[k]) {
    const v = histo[k] / max;

    const x = k & 0xFF;
    const y = (k >>> 8) & 0xFF;
    const z = (k >>> 16) & 0xFF;

    const luma = Math.sqrt(v);

    positions[p++] = x;
    positions[p++] = y;
    positions[p++] = z;
    positions[p++] = 1;

    if (mode === 'spatial') {
      colors[c++] = 255 * ((.5 + x * .5) * luma);
      colors[c++] = 255 * ((.5 + y * .5) * luma);
      colors[c++] = 255 * ((.5 + z * .5) * luma);
    }
    else if (mode === 'histogram') {
      colors[c++] = 255 * (luma * luma * luma);
      colors[c++] = 255 * (luma * luma);
      colors[c++] = 255 * (luma * (1 - luma));
    }
    colors[c++] = 255;

    bins++;
  }

  return {
    count: bins,
    fields: [
      ['vec4<u8>', new Uint32Array(positions.buffer)],
      ['vec4<u8>', new Uint32Array(colors.buffer)],
    ],
  };
};

// uint8 -> f32 unpack
// could just use Float32Arrays but we're feeling frugal
//
// because u8 doesn't exist in WGSL, vec4<u8> arrives as a vec4<u32>
const positionShader = wgsl`
  @optional @link fn getData(i: u32) -> vec4<u32>;

  fn main(i: u32) -> vec4<f32> {
    let position = getData(i);
    return vec4<f32>(position) + vec4<f32>(0.5, 0.5, 0.5, 0.0);
  }
`;

const colorShader = wgsl`
  @optional @link fn getData(i: u32) -> vec4<u32>;

  fn main(i: u32) -> vec4<f32> {
    let color = getData(i);
    return vec4<f32>(color) / 255.0;
  }
`;

export const GeometryBinaryPage: LC = () => {

  const root = document.querySelector('#use-gpu .canvas');

  return (
    <BinaryControls
      container={root}
      render={({mode, buffer}) => {
        const data = useMemo(() => buffer ? arrayBufferToXYZ(buffer, mode) : null, [buffer, mode]);
        return (
          <Loop>
            <LinearRGB>
              <Cursor cursor="move" />
              <Camera>
                <Pass>
                  <Plot>
                    <Cartesian
                      range={[[0, 256], [0, 256], [0, 256]]}
                    >
                      {data ? (
                        <Data
                          fields={data.fields}
                          render={(
                            positions: StorageSource,
                            colors: StorageSource,
                          ) => (
                            <Gather
                              children={[
                                <DataShader shader={positionShader} source={positions} />,
                                <DataShader shader={colorShader} source={colors} />,
                              ]}
                              then={([positions, colors]) => (
                                <PointLayer
                                  count={data.count}
                                  positions={positions}
                                  colors={colors}
                                  size={3}
                                  mode="transparent"
                                  depth={0.5}
                                />
                              )}
                            />
                          )}
                        />
                      ) : null}
                      <Grid
                        axes='xy'
                        width={2}
                        first={{ divide: 16, base: 2, end: true }}
                        second={{ divide: 16, base: 2, end: true }}
                        depth={0.5}
                        zBias={-1}
                        auto
                      />
                      <Grid
                        axes='xz'
                        width={2}
                        first={{ divide: 16, base: 2, end: true }}
                        second={{ divide: 16, base: 2, end: true }}
                        depth={0.5}
                        zBias={-1}
                        auto
                      />
                      <Grid
                        axes='yz'
                        width={2}
                        first={{ divide: 16, base: 2, end: true }}
                        second={{ divide: 16, base: 2, end: true }}
                        depth={0.5}
                        zBias={-1}
                        auto
                      />

                      <Axis
                        axis='x'
                        width={3}
                        origin={[-1, -1, -1]}
                        color={[0.75, 0.75, 0.75, 1]}
                        depth={0.5}
                      />
                      <Scale
                        divide={4}
                        base={2}
                        end
                        axis='x'
                        origin={[-1, -1, -1]}
                      >
                        <Tick
                          size={10}
                          width={3}
                          offset={[0, 1, 0]}
                          color={[0.75, 0.75, 0.75, 1]}
                          depth={0.5}
                        />
                      </Scale>

                      <Axis
                        axis='y'
                        width={3}
                        origin={[-1, -1, -1]}
                        color={[0.75, 0.75, 0.75, 1]}
                        depth={0.5}
                      />
                      <Scale
                        divide={4}
                        base={2}
                        end
                        axis='y'
                        origin={[-1, -1, -1]}
                      >
                        <Tick
                          size={10}
                          width={3}
                          offset={[0, 0, 1]}
                          color={[0.75, 0.75, 0.75, 1]}
                          depth={0.5}
                        />
                      </Scale>

                      <Axis
                        axis='z'
                        width={3}
                        origin={[-1, -1, -1]}
                        color={[0.75, 0.75, 0.75, 1]}
                        depth={0.5}
                      />
                      <Scale
                        divide={4}
                        base={2}
                        end
                        axis='z'
                        origin={[-1, -1, -1]}
                      >
                        <Tick
                          size={10}
                          width={3}
                          offset={[0, 1, 0]}
                          color={[0.75, 0.75, 0.75, 1]}
                          depth={0.5}
                        />
                      </Scale>

                    </Cartesian>
                  </Plot>
                </Pass>
              </Camera>
            </LinearRGB>
          </Loop>
        );
      }}
    />
  );
}

const Camera = ({children}: PropsWithChildren<object>) => (
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
