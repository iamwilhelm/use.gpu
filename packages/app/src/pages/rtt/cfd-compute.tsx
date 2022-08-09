import type { LC } from '@use-gpu/live';
import type { Emit, StorageTarget } from '@use-gpu/core';

import React, { Gather, use, useMemo } from '@use-gpu/live';
import { wgsl } from '@use-gpu/shader/wgsl';

import {
  Loop, Flat, Draw, Pass, OrbitCamera, RawData, PointLayer,
  ComputeData, Compute, Stage, Iterate, Kernel, Readback, Suspense, RawFullScreen,
  useBoundShader, useLambdaSource,
} from '@use-gpu/workbench';
import {
  UI, Layout, Absolute, Block, Inline, Text,
} from '@use-gpu/layout';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { main as generateInitial }  from './cfd-compute/initial.wgsl';
import { main as updateDivergence } from './cfd-compute/divergence.wgsl';
import { main as updatePressure }   from './cfd-compute/pressure.wgsl';
import { main as projectVelocity }  from './cfd-compute/project.wgsl';
import { main as advectVelocity }   from './cfd-compute/advect.wgsl';
import { main as advectMcCormack }  from './cfd-compute/mccormack.wgsl';

const colorizeShader = wgsl`
  @link fn getSample(i: u32) -> vec4<f32> {};
  @link fn getSize() -> vec4<u32> {};

  fn main(uv: vec2<f32>) -> vec4<f32> {
    let size = getSize();
    let iuv = vec2<u32>(uv * vec2<f32>(size.xy));
    let i = iuv.x + iuv.y * size.x;

    let value = getSample(i);

    let tone = normalize(vec3<f32>(value.xy, 1.0));

    return vec4<f32>(tone * value.z, 1.0);
  }
`;

const debugShader = wgsl`
  @link fn getSample(i: u32) -> vec4<f32> {};
  @link fn getSize() -> vec4<u32> {};
  @optional @link fn getGain() -> f32 { return 1.0; };

  fn main(uv: vec2<f32>) -> vec4<f32> {
    let gain = getGain();
    let size = getSize();
    let iuv = vec2<u32>(uv * vec2<f32>(size.xy));
    let i = iuv.x + iuv.y * size.x;

    let value = getSample(i).x * gain;
    return vec4<f32>(value, max(value * .2, -value * .3), -value, 1.0);
  }
`;

const BINDINGS = bundleToAttributes(debugShader);

const VisualizeField = ({field}: {field: StorageSource}) => {
  const boundShader = useBoundShader(colorizeShader, BINDINGS, [field, () => field.size, 1]);
  const textureSource = useLambdaSource(boundShader, field);
  return (
    <RawFullScreen texture={textureSource} />
  );
};

const DebugField = ({field, gain, width, height}: {field: StorageSource, gain: number, width: number, height: number}) => {
  console.log({gain, field})
  const boundShader = useBoundShader(debugShader, BINDINGS, [field, () => field.size, gain || 1]);
  const textureSource = useLambdaSource(boundShader, field);
  return (
    <Block width={width} height={height} image={{texture: textureSource}} />
  );
};

export const RTTCFDComputePage: LC = () => {
  const then = (source: StorageSource) => {
    console.log({source});
    return (
      <Stage><Readback source={source} then={(data) => { console.log(data); }} /></Stage>
    );
  };
  
  const w = window.innerWidth / 8;
  const h = window.innerHeight / 8;

  const advectForwards = useBoundShader(advectVelocity, [], [], {TIME_STEP: 1.0});
  const advectBackwards = useBoundShader(advectVelocity, [], [], {TIME_STEP: -1.0});

  return (
    <Gather
      children={[
        <ComputeData
          format="vec4<f32>"
          history={3}
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
      ]: StorageTarget[]) => (<>
        <Loop live>
          <Compute>
            <Suspense>
              <Stage target={divergence}>
                <Kernel shader={updateDivergence} source={velocity} />
              </Stage>
              <Stage target={pressure}>
                <Iterate count={30}>
                  <Kernel shader={updatePressure} source={divergence} history swap />
                </Iterate>
              </Stage>
              <Stage target={velocity}>
                <Kernel shader={generateInitial} initial source={Math.random()} />
                <Kernel shader={projectVelocity} source={pressure} history swap />
                <Kernel shader={advectForwards}  history swap />
                <Kernel shader={advectBackwards} history swap />
                <Kernel shader={advectMcCormack} history swap />
              </Stage>
            </Suspense>
          </Compute>

          <Flat>
            <Draw>
              <Pass>
                <VisualizeField field={velocity} />
                <UI>
                  <Layout>
                    <Absolute left={0} bottom={0}>
                      <Block direction="x" fill="#000">
                        <Block width={w}>
                          <DebugField field={divergence} gain={100} width={w} height={h} />
                          <Inline align="center"><Text lineHeight={28} color="#fff">Divergence</Text></Inline>
                        </Block>
                        <Block width={w}>
                          <DebugField field={pressure} width={w} height={h} />
                          <Inline align="center"><Text lineHeight={28} color="#fff">Pressure</Text></Inline>
                        </Block>
                      </Block>
                    </Absolute>
                  </Layout>
                </UI>

              </Pass>
            </Draw>
          </Flat>
        </Loop>
      </>)}
    />
  );
};
