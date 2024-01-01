import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { TextureSource } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import React, { Gather, memo, useContext, useOne } from '@use-gpu/live';
import { seq } from '@use-gpu/core';
import { bindBundle, wgsl } from '@use-gpu/shader/wgsl';
import { vec3 } from 'gl-matrix';

import {
  Loop, Pass, FlatCamera, Animate, LinearRGB, Environment,
  GeometryData, PBRMaterial, ImageCubeTexture, PrefilteredEnvMap, ShaderLitMaterial,
  OrbitCamera, OrbitControls, PanControls,
  Pick, Cursor, PointLayer, LineLayer,
  AxisHelper, KeyboardContext,

  makeSphereGeometry,
  useShader, useShaderRef,
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

import { EnvMapControls } from '../../ui/envmap-controls';

const π = Math.PI;
const τ = π * 2;

const keyframes = [
  [0, 0],
  [5, 1.0],
  [10, 0],
] as any[];

export const MaterialEnvMapPage: LC = (props) => {
  const geometry = useOne(() => makeSphereGeometry({ width: 2, uvw: true, detail: [32, 64] }));

  const { useKeyboard } = useContext(KeyboardContext);
  const { keyboard } = useKeyboard();
  const {keys} = keyboard;
  const zooming = !!keys.alt;
  const panning = !!keys.shift;

  const root = document.querySelector('#use-gpu .canvas');

  return (
    <EnvMapControls container={root} hasDebug render={(envPreset, envMap, seamFix, debugGrid) => (
      <Gather
        children={[
          <GeometryData {...geometry} />,
          envMap,
        ]}
        then={([
          mesh,
          texture,
        ]: [
          Record<string, ShaderSource>,
          TextureSource,
        ]) => (
          <Camera active={!zooming && !panning}>
            <PrefilteredEnvMap
              texture={texture}
              gain={1}
              seamFix={seamFix}
              debugGrid={debugGrid}
            >{
              (cubeMap, texture) =>
                <Loop>
                  <LinearRGB tonemap="aces" gain={3}>
                    <Cursor cursor='move' />
                    <Pass lights>

                      {/*<AxisHelper size={2} width={3} />*/}

                      <Environment map={cubeMap} preset={envPreset}>
                        <Scene>
                          {
                            seq(8).flatMap(i =>
                              seq(8).map(j => (
                                <Node position={[i - 3.5, 0, j - 3.5]} scale={[0.35, 0.35, 0.35]}>
                                  <PBRMaterial
                                    albedo={[0.6, 0.85, 1.0, 1.0]}
                                    metalness={i / 7}
                                    roughness={j / 7}
                                  >
                                    <Mesh mesh={mesh} shaded />
                                  </PBRMaterial>
                                </Node>
                              ))
                            )
                          }
                        </Scene>
                      </Environment>

                    </Pass>
                    <PanControls
                      x={-window.innerWidth/2} y={-window.innerHeight/2} zoom={1/2}
                      active={panning || zooming}
                      scroll={zooming}
                    >{
                      (x, y, zoom) =>
                        texture ? (
                          <FlatCamera x={x} y={y} zoom={zoom}>
                            <Pass overlay>
                              <UI>
                                <Layout>
                                  <Block margin={[0, 0, 0, 0]}>
                                    <Absolute left={0} top={0}>
                                      <Block
                                        width={512}
                                        height={texture.size[1] / texture.size[0] * 512}
                                        fill={[0, 0, 0, .25]}
                                        image={{texture, fit: 'scale'}}
                                      />
                                    </Absolute>
                                  </Block>
                                </Layout>
                              </UI>
                            </Pass>
                          </FlatCamera>
                        ) : null
                      }
                    }</PanControls>
                </LinearRGB>
              </Loop>
            }</PrefilteredEnvMap>
          </Camera>
        )}
      />
    )} />
  );
};

type CameraProps = {
  active: boolean,
};

const Camera: LC<CameraProps> = ({active, children}: PropsWithChildren<CameraProps>) => {
  return (
    <OrbitControls
      active={active}
      radius={6.5}
      bearing={-2.4}
      pitch={0.2}
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
