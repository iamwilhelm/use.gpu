import { LiveFiber } from '@use-gpu/live/types';
import { formatValue, formatNodeName } from '@use-gpu/live';
import styled, { keyframes } from "styled-components";

import React, { useCallback, useRef, useEffect } from 'react';
import { Action } from './types';

const ICON = (s: string) => <span className="m-icon">{s}</span>
const ICONSMALL = (s: string) => <span className="m-icon m-icon-small">{s}</span>

const pingAnimation = keyframes`
 0% { background: rgba(10, 150, 75, 1.0); }
 100% { background: rgba(0, 0, 0, 1.0); }
`

const selectedAnimation = keyframes`
 0% { background: rgba(10, 100, 100, 0.5); }
 100% { background: rgba(50, 130, 200, 0.85); }
`

export const StyledNode = styled.div`
  white-space: nowrap;
  margin: -2px -5px;
  padding: 2px 5px;
  position: relative;

  &.selected {
    background: rgba(50, 130, 200, 0.85);
  }

  &.hovered {
    background: rgba(50, 180, 200, 1.0);
  }

  &.by {
    background: rgba(30, 140, 160, 1.0);
  }

  &.depended {
    background: rgba(80, 0, 220, 1.0);
  }

  &.builtin {
    color: var(--colorTextMuted);
  }

  &.pinged {
    animation-name: ${pingAnimation};
    animation-duration: 0.5s;
    animation-iteration-count: 1;

    &.selected {
      animation-name: ${selectedAnimation};
    }
  }

  &.repinged {
    animation-name: none;
    background: rgba(10, 150, 75, 1.0);

    &.selected {
      background: rgba(20, 100, 200, 0.75);
    }
  }
`;

type NodeProps = {
  fiber: LiveFiber<any>,
  pinged: number,
  selected: boolean,
  hovered: number,
  depended: boolean,
  onClick?: Action,
  onMouseEnter?: Action,
  onMouseLeave?: Action,
};

export const Node: React.FC<NodeProps> = ({
  fiber,
  pinged,
  selected,
  hovered,
  depended,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const {id, by, f, args, yeeted} = fiber;

  const yeet = yeeted?.value !== undefined;
  const suffix = yeet ? ICONSMALL("switch_left") : null;

  const classes = [] as string[];
  if (selected) classes.push('selected');
  if (pinged) classes.push('pinged');
  if (depended) classes.push('depended');
  if (hovered === id) classes.push('hovered');
  if (hovered === by) classes.push('by');
  if (f.isLiveBuiltin) classes.push('builtin');
  const className = classes.join(' ');

  const elRef = useRef<HTMLDivElement | null>(null);
  const {current: el} = elRef;
  const lastPinged = el && el.classList.contains('pinged');

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    onClick && onClick();
  }, [onClick]);

  useEffect(() => {
    if (lastPinged && el) {
      el.classList.add('repinged');
      el.offsetHeight;
      el.classList.remove('repinged');
    }
  });

  const name = formatNodeName(fiber);

  return (
    <StyledNode
      ref={elRef}
      className={className}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {name}{suffix}
    </StyledNode>
  );
}
