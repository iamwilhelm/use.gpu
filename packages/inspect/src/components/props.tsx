import { LiveFiber } from '@use-gpu/live/types';
import { formatNode, formatValue, formatNodeName } from '@use-gpu/live';
import styled, { keyframes } from "styled-components";

import React, { useState } from 'react';
import { Action } from './types';
import { SplitRow, IndentTree, Label } from './layout';

type PropsProps = {
	fiber: LiveFiber<any>,
};

export const Props: React.FC<PropsProps> = ({fiber}) => {
  // @ts-ignore
	const {id, f, arg, args} = fiber;
  const name = formatNodeName(fiber);
	let props = {} as Record<string, any>;

	const [state, setState] = useState<Record<string, boolean>>({});
	const toggleState = (id: string) => setState((state) => ({
		...state,
		[id]: !state[id],
	}));

  if (arg !== undefined) {
    if (name === 'YEET') {
			props = {yeet: arg};
    }
		else {
			props = {props: arg};
		}
  }

  if (args !== undefined) {
    if (name === 'MAP_REDUCE') {
      const [, map, reduce] = args;
			props = {map, reduce};
    }
    else if (name === 'PROVIDE') {
      const [context, value] = args;
			props = {context, value};
    }
    else if (name === 'GATHER') {
    }
    else {
			if (args.length === 1) props = args[0];
			else for (let k in args) props[k] = args[k];
    }
  }

	return (<>
		<div><b>{name}</b></div>
		<div>{inspectObject(props, state, toggleState, '')}</div>
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

	if (Array.isArray(object)) if (object.reduce((b, o) => b && typeof o === 'number', true)) {
		return `[${object.join(', ')}]`;
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
	if (signature === 'f/args/key' || signature === 'f/arg/key') return formatNode(object);

	return Object.keys(object).map((k: string) => {
		const key = path +'/'+ k;
		const expanded = !!state[key];
		const prefix = expanded ? '– ' : '+ ';
		const onClick = (e: any) => {
			toggleState(key);
			e.preventDefault();
			e.stopPropagation();
		}
		return (
			<SplitRow key={k}>
				<Label onClick={onClick}>{prefix} {k}</Label>
				<div onClick={onClick}>{
					expanded
						? typeof object[k] === 'object' && depth < 3
							? <IndentTree>{inspectObject(object[k], state, toggleState, key, seen, depth + 1)}</IndentTree>
							: formatValue(object[k])
						: ('' + formatValue(object[k])).slice(0, 80)
				}</div>
			</SplitRow>
		);
	});
}
