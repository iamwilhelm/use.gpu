import type { LC } from '@use-gpu/live';
import type { Emit, StorageTarget } from '@use-gpu/core';

import React, { Gather, use, useMemo } from '@use-gpu/live';
import { wgsl } from '@use-gpu/shader/wgsl';

import {
  Loop, Flat, Draw, Pass, OrbitCamera, RawData, PointLayer, Pick,
  ComputeData, Compute, Stage, Iterate, Kernel, Suspense, RawFullScreen,
  useBoundShader, useLambdaSource, useShaderRefs,
} from '@use-gpu/workbench';
import {
  UI, Layout, Absolute, Block, Element, Inline, Text,
} from '@use-gpu/layout';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { main as generateInitial }  from './cfd-compute/initial.wgsl';
import { main as pushVelocity }     from './cfd-compute/push.wgsl';
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

    return vec4<f32>(vec3<f32>(
      tone.x * tone.x * tone.z + tone.y * tone.y * tone.y,
      tone.y * tone.z,
      tone.z + tone.y * tone.y
    ) * value.z, 1.0);
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

const VisualizeField = ({field}: {field: StorageTarget}) => {
  const boundShader = useBoundShader(colorizeShader, BINDINGS, [field, () => field.size, 1]);
  const textureSource = useLambdaSource(boundShader, field);
  return (
    <RawFullScreen texture={textureSource} />
  );
};

const DebugField = ({field, gain}: {field: StorageTarget, gain: number}) => {
  const boundShader = useBoundShader(debugShader, BINDINGS, [field, () => field.size, gain || 1]);
  const textureSource = useLambdaSource(boundShader, field);
  return (
    <Element width={field.size[0] / 2} height={field.size[1] / 2} image={{texture: textureSource}} />
  );
};

const PushVelocity = ({
  field, x, y, moveX, moveY,
}: {
  field: StorageTarget, x: number, y: number, moveX: number, moveY: number,
}) => {
  const [xy, moveXY] = useShaderRefs([x / 2, y / 2], [moveX, moveY]);

  return (
    <Compute>
      <Stage target={field}>
        <Kernel shader={pushVelocity} args={[xy, moveXY]} />
      </Stage>
    </Compute>
  );
};

export const RTTCFDComputePage: LC = () => {

  const advectForwards = useBoundShader(advectVelocity, [], [], {TIME_STEP: 1.0});
  const advectBackwards = useBoundShader(advectVelocity, [], [], {TIME_STEP: -1.0});

  return (
    <Gather
      children={[
        // Velocity + density field
        <ComputeData
          format="vec4<f32>"
          history={3}
          resolution={1/2}
        />,
        // Divergence
        <ComputeData
          format="f32"
          resolution={1/2}
        />,
        // Pressure
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

        <Pick all move render={(pick) => <PushVelocity field={velocity} {...pick} />} />
        <Loop live>

          <Compute>
            <Suspense>
              <Stage target={divergence}>
                <Kernel shader={updateDivergence} source={velocity} />
              </Stage>
              <Stage target={pressure}>
                <Iterate count={50}>
                  <Kernel shader={updatePressure} source={divergence} history swap />
                </Iterate>
              </Stage>
              <Stage target={velocity}>
                <Kernel shader={generateInitial} initial args={[() => Math.random()]} />
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
                      <Block direction="x">
                        <Block border={1} padding={1} stroke='#444' fill="#000">
                          <DebugField field={divergence} gain={300} />
                          <Inline align="center"><Text lineHeight={28} color="#ccc">Divergence</Text></Inline>
                        </Block>
                        <Block border={[0, 1, 1, 1]} padding={1} stroke='#444' fill="#000">
                          <DebugField field={pressure} gain={3} />
                          <Inline align="center"><Text lineHeight={28} color="#ccc">Pressure</Text></Inline>
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
