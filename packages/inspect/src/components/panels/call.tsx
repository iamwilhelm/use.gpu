import type { LiveFiber } from '@use-gpu/live';
import type { Action } from '../types';
import { formatNode, formatValue } from '@use-gpu/live';

import { Hook } from '@use-gpu/live';
import React, { useState } from 'react';
import { SplitRow, Label, Spacer } from '../layout';
import { usePingContext } from '../ping';

import { inspectObject } from './props';
import chunk from 'lodash/chunk';

const STATE_SLOTS = 3;

type CallProps = {
  fiber: LiveFiber<any>,
  fibers: Map<number, LiveFiber<any>>,
};

export const Call: React.FC<CallProps> = ({fiber}) => {
  // @ts-ignore
  const {id, depth, path, keys, type, state, context, yeeted, quote, unquote, mount, mounts, next, ...rest} = fiber;

  let props = {id, depth, path, keys, '[internals]': rest} as any;
  let env = {context, yeeted, quote, unquote} as any;
  let rendered = {type, mount, mounts, next} as any;

  usePingContext();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpanded = (id: string) => setExpanded((state) => ({
    ...expanded,
    [id]: !expanded[id],
  }));

  const hooks = chunk(state, STATE_SLOTS);

  return (
    <div>
      <div><b>Fiber</b></div>
      <div>{inspectObject(props, expanded, toggleExpanded, '')}</div>
      <Spacer />
      <div><b>Environment</b></div>
      <div>{inspectObject(env, expanded, toggleExpanded, '')}</div>
      <Spacer />
      <div><b>Rendered</b></div>
      <div>{inspectObject(rendered, expanded, toggleExpanded, '')}</div>
      <Spacer />
      <div><b>Hooks</b></div>
      <div>
        {inspectObject(hooks.map(hookToObject), expanded, toggleExpanded, '')}
      </div>
    </div>
  );
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
    return {context: b?.displayName};
  }
  if (type === Hook.CAPTURE) {
    return {capture: b?.displayName};
  }
  if (type === Hook.VERSION) {
    return {version: b, value: a};
  }
  return null;
}
