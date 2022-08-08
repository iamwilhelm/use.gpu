import type { LC } from '@use-gpu/live';
import type { Emit, ComputeSource } from '@use-gpu/core';

import React, { Gather, use, useMemo } from '@use-gpu/live';
import { wgsl } from '@use-gpu/shader/wgsl';

import {
  Loop, Draw, Pass, OrbitCamera, RawData, PointLayer,
  LinearRGB, Feedback, ComputeData, Compute, Iterate, Kernel, Readback, RawFullScreen,
  useBoundShader, useLambdaSource,
} from '@use-gpu/workbench';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { main as generateInitial } from './compute/initial.wgsl';
import { main as updateDivergence } from './compute/divergence.wgsl';
import { main as updatePressure } from './compute/pressure.wgsl';
import { main as projectVelocity } from './compute/project.wgsl';
import { main as advectVelocity } from './compute/advect.wgsl';

const colorizeShader = wgsl`
  @link fn getVelocitySample(i: u32) -> vec4<f32> {};
  @link fn getSize(i: u32) -> vec4<u32> {};

  fn main(uv: vec2<f32>) -> vec4<f32> {
    let size = getSize(0u);
    let iuv = vec2<u32>(uv * vec2<f32>(size.xy));
    let i = iuv.x + iuv.y * size.x;

    let value = getVelocitySample(i);

    return vec4<f32>(value.xy * .5 + .5, value.z, 1.0);
  }
`;

const BINDINGS = bundleToAttributes(colorizeShader);

const VisualizeField = (velocityDensity: StorageSource) => {
  const boundShader = useBoundShader(colorizeShader, BINDINGS, [velocityDensity, () => velocityDensity.size]);
  const textureSource = useLambdaSource(boundShader, velocityDensity);
  return (
    <Draw>
      <Pass>
        <RawFullScreen texture={textureSource} />
      </Pass>
    </Draw>
  );
};

export const RTTComputePage: LC = () => {
  const then = (source: StorageSource) => {
    console.log({source});
    return (
      <Compute><Readback source={source} then={(data) => { console.log(data); }} /></Compute>
    );
  };

  return (
    <Gather
      children={[
        <ComputeData
          format="vec4<f32>"
          history={1}
          resolution={1/2}
        />,
        <ComputeData
          format="f32"
          resolution={1/2}
        />,
        <ComputeData
          format="f32"
          history={1}
          resolution={1/2}
        />
      ]}
      then={([
        velocity,
        divergence,
        pressure,
      ]: ComputeSource[]) => (<>
        <Loop live>
          <Compute target={divergence}>
            <Kernel shader={updateDivergence} source={velocity} />
          </Compute>
            <Compute target={pressure}>
            <Iterate count={30}>
              <Kernel shader={updatePressure} source={divergence} history swap />
            </Iterate>
          </Compute>
          <Compute target={velocity}>
            <Kernel shader={generateInitial} initial />
            <Kernel shader={projectVelocity} source={pressure} history swap />
            <Kernel shader={advectVelocity} history swap />
          </Compute>
          {use(VisualizeField, velocity)}
        </Loop>
      </>)}
    />
  );
};
