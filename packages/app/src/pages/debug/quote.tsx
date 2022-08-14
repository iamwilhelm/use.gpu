import type { LC, PropsWithChildren } from '@use-gpu/live';
import React, { Gather, Yeet, Reconcile, Quote, Unquote } from '@use-gpu/live';

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
  
  const Foo = ({children}: PropsWithChildren<object>) => <>{children}</>;
  
  return (
    <Reconcile>
      <Flat>
        <Draw>
          <Quote>
            <Foo>
              <Unquote>
                <Pass />
              </Unquote>
            </Foo>
          </Quote>
        </Draw>
      </Flat>
    </Reconcile>
  )
};
