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
  Present, Slide, Step, KeyboardControls,
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
                <KeyboardControls />
                <Slide effect={{type: 'wipe', direction: 'left'}}>
                  <Absolute left={50} top={50} bottom={50} right={50}>
                    <Block padding={[10, 10, 10, 20]} fill="#404040"><Inline><Text size={48} color="#fff">Lorem ipsum</Text></Inline></Block>
                    
                    <Block padding={10}>
                      <Step effect={{type: 'wipe', duration: 0.5}}>
                        <Block padding={10} fill="#404040"><Inline><Text size={24} color="#fff">Hello</Text></Inline></Block>
                      </Step>
                      <Step effect={{type: 'move', direction: 'left', duration: 1}}>
                        <Block padding={10} fill="#404040"><Inline><Text size={24} color="#fff">Hello</Text></Inline></Block>
                      </Step>
                    </Block>
                  </Absolute>
                </Slide>
                <Slide effect={{type: 'wipe', direction: 'left', duration: 1}}>
                  <Absolute left={50} top={50} bottom={50} right={50}>
                    <Block padding={[10, 10, 10, 20]} fill="#404040"><Inline><Text size={48} color="#fff">Lorem ipsum 2</Text></Inline></Block>
                    
                    <Block padding={10}>
                      <Step effect={{type: 'wipe', duration: 0.5}}>
                        <Block padding={10} fill="#404040"><Inline><Text size={24} color="#fff">Hello</Text></Inline></Block>
                        <Block padding={10} fill="#404040"><Inline><Text size={24} color="#fff">Hello</Text></Inline></Block>
                      </Step>
                      <Step effect={{type: 'move', direction: 'left', duration: 1}}>
                        <Block padding={10} fill="#404040"><Inline><Text size={24} color="#fff">Hello</Text></Inline></Block>
                        <Block padding={10} fill="#404040"><Inline><Text size={24} color="#fff">Hello</Text></Inline></Block>
                      </Step>
                    </Block>
                  </Absolute>
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
