import { LC } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode, Point4 } from '@use-gpu/core/types';

import React from '@use-gpu/live/jsx';
import { LayoutControls } from '../../ui/layout-controls';

import {
  LinearRGB, Draw, Pass, Flat, UI, Layout, Absolute, Block, Flex, Inline, Overflow, Text, Element,
  PanControls,
  DebugProvider,
} from '@use-gpu/components';

const TRANSPARENT = [1, 1, 1, 0.1] as Point4;

const FILL = [0.4, 0.7, 1, 0.5] as Point4;

export const LayoutAlignPage: LC = () => {

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
                  <Flex margin={10} gap={[10, 5]} align="start"   anchor="center" height={200} fill={[1, 1, 1, 0.1]}>{BOXES}</Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Flex Center</Label>
                  <Flex margin={10} gap={[10, 5]} align="center"  anchor="center" height={200} fill={[1, 1, 1, 0.1]}>{BOXES}</Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Flex End</Label>
                  <Flex margin={10} gap={[10, 5]} align="end"     anchor="center" height={200} fill={[1, 1, 1, 0.1]}>{BOXES}</Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Flex Justify</Label>
                  <Flex wrap margin={10} gap={[10, 5]} align="justify" anchor="center" height={250} fill={[1, 1, 1, 0.1]}>{BOXES}{BOXES}</Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Flex Between</Label>
                  <Flex wrap margin={10} gap={[10, 5]} align="between" anchor="center" height={250} fill={[1, 1, 1, 0.1]}>{BOXES}{BOXES}</Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Flex Evenly</Label>
                  <Flex wrap margin={10} gap={[10, 5]} align="evenly"  anchor="center" height={250} fill={[1, 1, 1, 0.1]}>{BOXES}{BOXES}</Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Flex Grow</Label>
                  <Flex wrap margin={10} gap={[10, 5]} align="evenly"  anchor="center" height={250} fill={[1, 1, 1, 0.1]}>
                    <Element width={200} height={50} grow={0} fill={FILL} />
                    <Element width={200} height={50} grow={1} fill={FILL} />
                    <Element width={200} height={50} grow={0} fill={FILL} />
                    <Element width={200} height={50} grow={0} fill={FILL} />
                    <Element width={200} height={50} grow={0} fill={FILL} />
                    <Element width={200} height={50} grow={1} fill={FILL} />
                    <Element width={200} height={50} grow={0} fill={FILL} />
                    <Element width={200} height={50} grow={1} fill={FILL} />
                    <Element width={200} height={50} grow={1} fill={FILL} />
                  </Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Block Direction X</Label>
                  <Block margin={10} direction='x'>{BOXES}</Block>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                  <Label>Flex / Block / Inline X</Label>
                  <Flex>
                    <Element width={200} height={50} grow={0} fill={FILL} />
                    <Block grow={1} padding={10}>
                      <Inline><Text color={[1, 1, 1, 1]}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text></Inline>
                    </Block>
                    <Element width={200} height={50} grow={0} fill={FILL} />
                  </Flex>
                  <Block fill={[1, 1, 1, 0.5]} height={2} />

                </Block>

              </Overflow>
            </Absolute>
          </Layout>
        </UI>
      </Pass>
    </LinearRGB>
  );

  const root = document.querySelector('#use-gpu .canvas');

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