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
            <Overflow>

              <Block margin={10} fill={[1, 1, 1, 0.1]}>

								<Label>Flex Start</Label>
                <Flex margin={10} gap={10} align="start"   anchor="center" height={200}>{BOXES}</Flex>
                <Flex margin={10} gap={10} align="center"  anchor="center" height={200}>{BOXES}</Flex>
                <Flex margin={10} gap={10} align="end"     anchor="center" height={200}>{BOXES}</Flex>

                <Flex wrap margin={10} gap={10} align="justify" anchor="center" height={250}>{BOXES}{BOXES}</Flex>
                <Flex wrap margin={10} gap={10} align="between" anchor="center" height={250}>{BOXES}{BOXES}</Flex>
                <Flex wrap margin={10} gap={10} align="evenly"  anchor="center" height={250}>{BOXES}{BOXES}</Flex>

              </Block>

              <Block margin={10} direction='x'>{BOXES}</Block>

            </Overflow>
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

const Label = ({children}: {children: string}) => <Inline><Text>{children}</Text></Inline>