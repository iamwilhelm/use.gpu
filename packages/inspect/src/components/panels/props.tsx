import type { LiveFiber } from '@use-gpu/live';
import type { Action } from '../types';

import { formatNode, formatValue, formatNodeName, YEET } from '@use-gpu/live';
import { styled as _styled } from '@stitches/react';

import React, { useState } from 'react';
import { SplitRow, TreeRow, TreeIndent, Label, Spacer } from '../layout';
import { usePingContext } from '../ping';
import { IconItem, SVGChevronDown, SVGChevronRight } from '../svg';

const styled: any = _styled;

type PropsProps = {
  fiber: LiveFiber<any>,
  fibers: Map<number, LiveFiber<any>>,
};

const Prefix = styled('div', {
  width: '20px',
  display: 'inline-block',
  whiteSpace: 'nowrap',
  lineHeight: 1,
});

const Compact = styled('span', {
  whiteSpace: 'nowrap',
});

export const Props: React.FC<PropsProps> = ({fiber, fibers}) => {
  // @ts-ignore
  const {id, f, arg, args, yeeted} = fiber;
  const name = formatNodeName(fiber);
  let props = {} as Record<string, any>;

  usePingContext();

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
    <div>{inspectObject({value: yeeted?.value}, state, toggleState, '')}</div>
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
        <div>{inspectObject(props, state, toggleState, '')}</div>
      </>
    ) : null}
    {showProps && yt ? <Spacer /> : null}
    {yt}
    <Spacer />
    <div><b>Rendered By</b></div>
    <div>{history}</div>
  </>);
}

export const inspectObject = (
  object: any,
  state: Record<string, boolean>,
  toggleState: (id: string) => void,
  path: string,
  seen: Set<any> = new Set(),
  depth: number = 0,
) => {
  if (!object) return null;

  if (seen.has(object)) return '{Circular}';
  seen.add(object);

  if (Array.isArray(object)) {
    if (object.length > 100) object = object.slice(0, 100);
    if (object.reduce((b: boolean, o: any) => b && typeof o === 'number', true)) {
      return `[${object.join(', ')}]`;
    }
  }
  
  if (object instanceof Float32Array) {
    if (object.length > 100) object = object.slice(0, 100);
  }

  if (object instanceof Map) {
    const o = {} as Record<string, any>;
    let i = 0;
    for (let k of object.keys()) {
      const v = object.get(k);
      if (k instanceof Object) k = (i++).toString();
      o[k] = v;
    }
    object = o;
  }

  const signature = Object.keys(object).join('/');
  // @ts-ignore
  if ((signature === 'f/args/key') && object.f && object.args) {
    if (!object.f.isLiveBuiltin) {
      object = Object.assign(Object.create(object.f), {
        component: object.f,
        props: object.args[0],
        key: object.key,
      });
    }
    else {
      object = Object.assign(Object.create(object.f), {
        component: object.f,
        args: object.args,
        arg: object.arg,
        key: object.key,
      });
    }
  }

  const fields = Object.keys(object).map((k: string) => {
    const key = path +'/'+ k;
    const expandable = typeof object[k] === 'object' && object[k];
    const expanded = !!state[key];

    const icon = <IconItem height={16} top={2}>{expanded !== false ? <SVGChevronDown /> : <SVGChevronRight />}</IconItem>;
    const prefix = expandable ? icon : '';
    
    const onClick = expandable ? (e: any) => {
      toggleState(key);
      e.preventDefault();
      e.stopPropagation();
    } : undefined;

    const compact = <Compact>
      {expanded ? formatValue(object[k]) : truncate(formatValue(object[k]), 80)}
    </Compact>

    const full = expanded ? (
      <TreeIndent indent={1}>{inspectObject(object[k], state, toggleState, key, seen, depth + 1)}</TreeIndent>
    ) : null;

    const proto = object[k]?.__proto__ !== Object.prototype
      ? object[k]?.__proto__?.constructor?.name ??
        object[k]?.__proto__?.displayName
      : null;

    const showFull = typeof object[k] === 'object' && depth < 20;
    if (showFull && expanded) {
      return (
        <div key={k} onClick={onClick}>
          <TreeRow>
            <SplitRow>
              <Label><Prefix>{prefix}</Prefix><div>{k}</div></Label>
              <div>{proto}</div>
            </SplitRow>
          </TreeRow>
          <div>{full}</div>
        </div>
      );
    }

    return (
      <div key={k} onClick={onClick}>
        <TreeRow>
          <SplitRow>
            <Label><Prefix>{prefix}</Prefix><div>{k}</div></Label>
            <div>{compact}</div>
          </SplitRow>
        </TreeRow>
      </div>
    );
  });
  
  return fields;
}

const truncate = (s: string, n: number) => {
  s = s.replace(/\s+/g, ' ');
  if (s.length < n) return s;
  return s.slice(0, n) + '…';
}
