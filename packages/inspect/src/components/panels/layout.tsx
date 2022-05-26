import { LiveFiber, Hook } from '@use-gpu/live/types';
import { formatNode, formatValue, STATE_SLOTS } from '@use-gpu/live';

import React, { useState } from 'react';
import { Action } from '../types';
import { DOMMock, SplitRow, Label, Spacer } from '../layout';
import { usePingContext } from '../ping';

import { inspectObject } from './props';
import chunk from 'lodash/chunk';

type LayoutProps = {
  fiber: LiveFiber<any>,
};

export const Layout: React.FC<LayoutProps> = ({fiber}) => {

  const layout = fiber.__inspect?.layout;
  if (!layout) return null;

  usePingContext();

  const {into, size, sizes, offsets} = layout;
  let n = sizes.length;
  
  const SCALE = 1/2;

  const width  = Math.max(size[0], into[0] || 0);
  const height = Math.max(size[1], into[1] || 0);
  
  const [state, setState] = useState<Record<string, boolean>>({});
  const toggleState = (id: string) => setState((state) => ({
    ...state,
    [id]: !state[id],
  }));

  return (<>
    <div><b>Props</b></div>
    {inspectObject(layout, state, toggleState, 'u')}
    <Spacer />
    <div style={{position: 'relative', width: width * SCALE, height: height * SCALE}}>
      <DOMMock style={{width: size[0] * SCALE, height: size[1] * SCALE}} />
      <DOMMock style={{width: (into[0] || 0) * SCALE, height: (into[1] || 0) * SCALE, borderStyle: 'dashed'}} />
      {
        sizes.map((size, i) =>
          <DOMMock key={i.toString()} style={{
            position: 'absolute',
            left: offsets[i][0] * SCALE,
            top: offsets[i][1] * SCALE,
            width: size[0] * SCALE,
            height: size[1] * SCALE,
          }} />
        )
      }
    </div>
  </>);
}

const hookToObject = (
  state: any[],
) => {
  const [type, a, b] = state;
  if (type === Hook.STATE) {
    return {state: a, deps: b};
  }
  if (type === Hook.MEMO || type === Hook.ONE || type === Hook.CALLBACK) {
    return {memo: a, deps: b};
  }
  if (type === Hook.RESOURCE) {
    return {resource: a?.value, deps: b};
  }
  if (type === Hook.CONTEXT) {
    return {context: a?.displayName};
  }
  if (type === Hook.CONSUMER) {
    return {consumer: a?.displayName};
  }
  return null;
}
