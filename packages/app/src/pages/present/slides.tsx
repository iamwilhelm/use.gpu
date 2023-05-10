import type { LC, PropsWithChildren } from '@use-gpu/live';

import React, { use } from '@use-gpu/live';

import {
  Loop, Pass, Flat,
  ArrayData, Data, RawData,
  PanControls,
  Pick, Cursor,
  Animate,
  LinearRGB,
} from '@use-gpu/workbench';
import {
  Present, Slide, Step,
} from '@use-gpu/present';
import {
  UI, Layout, Absolute, Block, Inline, Text,
} from '@use-gpu/layout';
import { vec3 } from 'gl-matrix';

let t = 0;

export const PresentSlidesPage: LC = () => {
  
  return (
    <Loop>
      <LinearRGB>
        <View>
          <Pass>
            <UI>
              <Present>
                <Slide>
                  <Layout>
                    <Absolute>
                      <Block><Inline><Text size={24}>Hello</Text></Inline></Block>
                      <Step>
                        <Block><Inline><Text size={24}>Hello</Text></Inline></Block>
                      </Step>
                      <Step>
                        <Block><Inline><Text size={24}>Hello</Text></Inline></Block>
                      </Step>
                    </Absolute>
                  </Layout>
                </Slide>
              </Present>
            </UI>
          </Pass>
        </View>
      </LinearRGB>
    </Loop>
  );
}

const View = ({children}: PropsWithChildren<object>) => (
  <PanControls
    render={(x, y, zoom) =>
      <Flat x={x} y={y} zoom={zoom}>
        {children}
      </Flat>
    }
  />
);
