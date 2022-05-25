import { LC } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import React from '@use-gpu/live/jsx';
import { LayoutControls } from '../../ui/layout-controls';

import {
  LinearRGB, Draw, Pass, Flat, UI, Layout, Absolute, Block, Flex, Inline, Overflow, Text, Element,
  PanControls,
  DebugProvider,
} from '@use-gpu/components';

const TRANSPARENT = [1, 1, 1, 0.1];

const FILL = [0.4, 0.7, 1, 0.5];

export const LayoutTestPage: LC = () => {

  const BOXES = (<>
    <Element width={180} height={50} fill={FILL} />
    <Element width={140} height={60} fill={FILL} />
    <Element width={160} height={30} fill={FILL} />
    <Element width={180} height={100} fill={FILL} />
    <Element width={180} height={50} fill={FILL} />
    <Element width={140} height={60} fill={FILL} />
  </>)

  const view = (
    <LinearRGB>
      <Pass>
        <UI>
          <Layout>
            <Absolute>
              <Overflow y="scroll">

                <Block margin={[10, 0, 10, 50]}>

                  <Label>Flex Start</Label>
                  <Flex margin={10} gap={10} align="start"   anchor="center" height={200} fill={[1, 1, 1, 0.1]}>{BOXES}</Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Flex Center</Label>
                  <Flex margin={10} gap={10} align="center"  anchor="center" height={200} fill={[1, 1, 1, 0.1]}>{BOXES}</Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Flex End</Label>
                  <Flex margin={10} gap={10} align="end"     anchor="center" height={200} fill={[1, 1, 1, 0.1]}>{BOXES}</Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Flex Justify</Label>
                  <Flex wrap margin={10} gap={10} align="justify" anchor="center" height={250} fill={[1, 1, 1, 0.1]}>{BOXES}{BOXES}</Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Flex Between</Label>
                  <Flex wrap margin={10} gap={10} align="between" anchor="center" height={250} fill={[1, 1, 1, 0.1]}>{BOXES}{BOXES}</Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Flex Evenly</Label>
                  <Flex wrap margin={10} gap={10} align="evenly"  anchor="center" height={250} fill={[1, 1, 1, 0.1]}>{BOXES}{BOXES}</Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />


                  <Label>Block Direction X</Label>
                  <Block margin={10} direction='x'>{BOXES}</Block>

                </Block>

              </Overflow>
            </Absolute>
          </Layout>
        </UI>
      </Pass>
    </LinearRGB>
  );

  const root = document.querySelector('#use-gpu');

  return (
    <LayoutControls
      container={root}
      render={(mode) => 
        <PanControls
          active={mode !== 'inspect'}
          render={(x, y, zoom) =>
            <DebugProvider
              debug={{
                sdf2d: { contours: mode === 'sdf' },
              }}
            >
              <Flat x={x} y={y} zoom={zoom}>
                {view}
              </Flat>
            </DebugProvider>
          }
      />}
    />
  );
};

const Label = ({children}: {children: string}) => <Inline margin={[0, 10, 0, 0]}><Text size={32} color={[1, 1, 1, 1]}>{children}</Text></Inline>