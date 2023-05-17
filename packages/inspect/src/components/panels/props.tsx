import type { LiveFiber } from '@use-gpu/live';
import type { Action } from '../types';

import { formatNode, formatNodeName, YEET } from '@use-gpu/live';
import { InspectObject } from '../inspect-object';
import { Spacer } from '../layout';

import React, { useState } from 'react';

type PropsProps = {
  fiber: LiveFiber<any>,
  fibers: Map<number, LiveFiber<any>>,
};

export const Props: React.FC<PropsProps> = ({fiber, fibers}) => {
  // @ts-ignore
  const {id, f, arg, args, yeeted} = fiber;
  const name = formatNodeName(fiber);
  let props = {} as Record<string, any>;

  const [state, setState] = useState<Record<string, boolean>>({});
  const toggleState = (id: string) => setState((state) => ({
    ...state,
    [id]: !state[id],
  }));

  if (arg !== undefined) {
    if (f.name === 'YEET') {
      props = {yeet: arg};
    }
    else {
      props = {props: arg};
    }
  }

  if (args !== undefined) {
    if (f.name === 'YEET') {
      props = {};
    }
    if (f.name === 'MAP_REDUCE') {
      const [children, map, reduce] = args;
      props = {map, reduce, children};
    }
    else if (f.name === 'CAPTURE') {
      const [context] = args;
      props = {context};
    }
    else if (f.name === 'PROVIDE') {
      const [context, value] = args;
      props = {context, value};
    }
    else if (f.name === 'GATHER') {
      const [children, then, fallback] = args;
      props = {children, then, fallback};
    }
    else if (f.name === 'SIGNAL') {
    }
    else {
      if (args.length === 1 && typeof args[0] === 'object') props = args[0];
      else for (let k in args) props[k] = args[k];
    }
  }

  let yt = yeeted?.value != null ? (<>
    <div><b>Yeeted</b></div>
    <div><InspectObject
      object={{value: yeeted?.value}}
      state={state}
      toggleState={toggleState}
      path={''}
    /></div>
  </>) : null;

  let showProps = f !== YEET;

  let history = null as React.ReactNode | null;
  let parent = fiber;
  if (parent.by) {
    const parents = [] as LiveFiber<any>[];
    while (parent) {
      const {by} = parent;
      const source = fibers.get(by);
      if (source) parents.push(source);
      parent = source as any;
    }
    history = parents.map((fiber) => <div key={fiber.id}>{formatNode(fiber)}</div>)  }
  else {
    history = '[Runtime]';
  }

  return (<>
    {showProps ? (
      <>
        <div><b>{name}</b></div>
        <div><InspectObject
          object={props}
          state={state}
          toggleState={toggleState}
          path={''}
        /></div>
      </>
    ) : null}
    {showProps && yt ? <Spacer /> : null}
    {yt}
    <Spacer />
    <div><b>Rendered By</b></div>
    <div>{history}</div>
  </>);
}

