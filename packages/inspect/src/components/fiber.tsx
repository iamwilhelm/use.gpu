import { LiveFiber } from '@use-gpu/live/types';
import { formatValue } from '@use-gpu/live';

import React, { useMemo } from 'react';

import { useRefineCursor, Cursor } from './cursor';
import { Node } from './node';
import { PingState, ExpandState, SelectState, HoverState, Action } from './types';

import { TreeRow, TreeIndent, TreeLine } from './layout';
import { Expandable } from './expandable';

const ICON = (s: string) => <span className="m-icon">{s}</span>
const ICONSMALL = (s: string) => <span className="m-icon m-icon-small">{s}</span>

type FiberTreeProps = {
  fiber: LiveFiber<any>,
  fibers: Map<number, LiveFiber<any>>,
  ping: PingState,
  expandCursor: Cursor<ExpandState>,
  selectedCursor: Cursor<SelectState>,
  hoveredCursor: Cursor<HoverState>,
}

type FiberNodeProps = {
  fiber: LiveFiber<any>,
  fibers: Map<number, LiveFiber<any>>,
  ping: PingState,
  expandCursor: Cursor<ExpandState>,
  selectedCursor: Cursor<SelectState>,
  hoveredCursor: Cursor<HoverState>,
  indent?: number,
  continuation?: boolean,
}

type TreeExpandProps = {
  expand: boolean,
  onToggle: (e: any) => void,
}

export const FiberTree: React.FC<FiberTreeProps> = ({
  fiber,
  fibers,
  ping,
  expandCursor,
  selectedCursor,
  hoveredCursor,
}) => {

  return (
    <FiberNode
      fiber={fiber}
      fibers={fibers}
      ping={ping}
      expandCursor={expandCursor}
      selectedCursor={selectedCursor}
      hoveredCursor={hoveredCursor}
    />
  );
}

export const FiberNode: React.FC<FiberNodeProps> = ({
  fiber,
  fibers,
  ping,
  expandCursor,
  selectedCursor,
  hoveredCursor,
  continuation,
  indent = 0,
}) => {
  const {id, mount, mounts, next, order, depth, host} = fiber;
  const [selectState, updateSelectState] = selectedCursor;
  const [hoverState, updateHoverState] = hoveredCursor;

  fibers.set(id, fiber);

  const pinged = ping[id] || 0;
  const selected = fiber === selectState;
  const hovered = hoverState.fiber?.id ?? -1;
  const depended = hoverState.deps.indexOf(fiber) >= 0;

  const [select, hover, unhover] = useMemo(() => {
    const select = () => updateSelectState({ $set: fiber });
    const hover = () => updateHoverState({ $set: { fiber, deps: host.invalidate(fiber) } });
    const unhover = () => updateHoverState({ $set: { fiber: null, deps: [] } });
    return [select, hover, unhover];
  }, [fiber, updateSelectState, updateHoverState]);

  const out = [] as React.ReactElement[];

  const nodeRender = (
    <Node
      key='node'
      fiber={fiber}
      pinged={pinged}
      selected={selected}
      hovered={hovered}
      depended={depended}
      onClick={select}
      onMouseEnter={hover}
      onMouseLeave={unhover}
    />
  );

  const continuationIcon = ICONSMALL('subdirectory_arrow_right');
     
  if (mount) {
    const hasNext = (mount.mount || mount.mounts || mount.next);
    out.push(
      <FiberNode
        key='mount'
        fiber={mount}
        fibers={fibers}
        ping={ping}
        expandCursor={expandCursor}
        selectedCursor={selectedCursor}
        hoveredCursor={hoveredCursor}
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
            fibers={fibers}
            ping={ping}
            expandCursor={expandCursor}
            selectedCursor={selectedCursor}
            hoveredCursor={hoveredCursor}
            indent={indent + 1}
          />
        );
      }
    }
  }

  let childRender = out as any;

  let nextRender = null as React.ReactElement | null;
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
        fibers={fibers}
        ping={ping}
        expandCursor={expandCursor}
        selectedCursor={selectedCursor}
        hoveredCursor={hoveredCursor}
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
            {continuation ? <div onClick={onToggle}>{continuationIcon}</div> : null}
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
