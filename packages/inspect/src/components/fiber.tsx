import { LiveFiber } from '@use-gpu/live/types';
import { formatValue } from '@use-gpu/live';

import React from 'react';

import { useRefineCursor, Cursor } from './cursor';
import { Node } from './node';
import { PingState, ExpandState, SelectState, Action } from './types';

import { TreeRow, TreeIndent, TreeLine } from './layout';
import { Expandable } from './expandable';

const ICON = (s: string) => <span className="m-icon">{s}</span>
const ICONSMALL = (s: string) => <span className="m-icon m-icon-small">{s}</span>

type FiberTreeProps = {
  fiber: LiveFiber<any>,
  ping: PingState,
  expandCursor: Cursor<ExpandState>,
  selectedCursor: Cursor<SelectState>,
}

type FiberNodeProps = {
  fiber: LiveFiber<any>,
  ping: PingState,
  expandCursor: Cursor<ExpandState>,
  selectedCursor: Cursor<SelectState>,
	indent?: number,
	continuation?: boolean,
}

type TreeExpandProps = {
	expand: boolean,
  onToggle: Cursor<ExpandState>,
}

export const FiberTree: React.FC<FiberTreeProps> = ({fiber, ping, expandCursor, selectedCursor}) => {

	return (
		<FiberNode fiber={fiber} ping={ping} expandCursor={expandCursor} selectedCursor={selectedCursor} />
	);

}

export const FiberNode: React.FC<FiberNodeProps> = ({
	fiber,
	ping,
	expandCursor,
	selectedCursor,
	continuation,
	compact,
	indent = 0,
}) => {
  const {id, mount, mounts, next, order, depth} = fiber;
  const [selectState, updateSelectState] = selectedCursor;

  const pinged = ping[id] || 0;
  const selected = fiber === selectState;
  const select = () => {
    updateSelectState({ $set: fiber });
  }

  const out = [] as React.ReactElement[];

	const nodeRender = (
		<Node key='node' fiber={fiber} pinged={pinged} selected={selected} onClick={select} />
	);

  const continuationIcon = ICONSMALL('subdirectory_arrow_right');
		 
  if (mount) {
		const hasNext = (mount.mount || mount.mounts || mount.next);
    out.push(
      <FiberNode
        key='mount'
        fiber={mount}
        ping={ping}
        expandCursor={expandCursor}
        selectedCursor={selectedCursor}
				indent={indent + (next || !hasNext ? 1 : .1)}
      />
    );
  }

  if (mounts && order) {
    for (const key of order) {
      const sub = mounts.get(key);
      if (sub) {
				out.push(
	        <FiberNode
	          key={key}
	          fiber={sub}
	          ping={ping}
	          expandCursor={expandCursor}
	          selectedCursor={selectedCursor}
						indent={indent + 1}
	        />
				);
			}
    }
	}

	let childRender = out as any;

	let nextRender = null;
  if (next) {
		childRender = (
			<TreeIndent indent={indent + .5}>
				<TreeLine>
					<TreeIndent indent={-indent - .5}>
						{out}
					</TreeIndent>
				</TreeLine>
			</TreeIndent>
		);
    nextRender = (
      <FiberNode
        fiber={next}
        ping={ping}
        expandCursor={expandCursor}
        selectedCursor={selectedCursor}
				continuation
				indent={indent - +!!out.length}
      />
    );
  }

	if (out.length) {
		return (
			<Expandable id={id} expandCursor={expandCursor}>{
				(expand, onToggle) => (<>
					<TreeRow indent={indent}>
						{continuation ? <div>{continuationIcon}</div> : null}
						<TreeExpand expand={expand} onToggle={onToggle}>
							{nodeRender}
						</TreeExpand>
					</TreeRow>
					{expand !== false ? childRender : null}
					{nextRender}
				</>)
			}</Expandable>
		);
	}

	return (<>
		<TreeRow indent={indent + 1}>
			{continuation ? <div>{continuationIcon}</div> : null}
			{nodeRender}
		</TreeRow>
		{nextRender}
	</>);
}

export const TreeExpand: React.FC<TreeExpandProps> = ({expand, onToggle, children}) => {
  const icon = expand !== false ? ICON('expand_more') : ICON('chevron_right') ;

  return (<>
    <TreeRow>
      <div onClick={onToggle}>{icon}</div>
      {children}
    </TreeRow>
  </>);
}
