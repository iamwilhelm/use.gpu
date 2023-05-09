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
import { vec3 } from 'gl-matrix';

let t = 0;

export const PresentSlidesPage: LC = () => {
  
  return (
    <Loop>
      <LinearRGB>
        <View>
          <Present>
            <Slide>
              <Step />
              <Step />
              <Step />
            </Slide>
            <Slide>
              <Step />
              <Step />
              <Step />
            </Slide>
          </Present>
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
