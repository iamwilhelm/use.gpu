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

export const LayoutTestPage: LC = () => {

  const view = (
    <LinearRGB>
      <Pass>
        <UI>
          <Layout>
						<Overflow>

							<Block margin={10} height={400} fill={[1, 1, 1, 0.1]}>

								<Flex>
	                <Element width={80}  height={50} />
	                <Element width={40}  height={60} />
	                <Element width={60}  height={50} />
	                <Element width={80}  height={70} />
								</Flex>
								
							</Block>
							
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
                layout: { inspect: mode === 'inspect' },
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
