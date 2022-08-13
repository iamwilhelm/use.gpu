import type { LC } from '@use-gpu/live';
import React, { Gather, Yeet, Quote, Unquote } from '@use-gpu/live';

import {
  Draw, LinearRGB, Pass, PanControls, Flat,
  DebugAtlas, RawTexture, DebugProvider,
} from '@use-gpu/workbench';
import {
  UI, Layout, Absolute, Inline, Text,
} from '@use-gpu/layout';

export const DebugQuotePage: LC = () => {

  const view = (
  ''
  );
  
  const Foo = () => {};
  
  return (
    <Quote><Unquote>
      <Draw>
        <Quote>
          <Foo />
          <Unquote>
            <Pass />
          </Unquote>
        </Quote>
      </Draw>
    </Unquote></Quote>
  )
};
