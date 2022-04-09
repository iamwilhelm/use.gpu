import { LiveFiber } from '@use-gpu/live/types';
import { formatValue, formatNodeName } from '@use-gpu/live';
import { styled, keyframes } from "@stitches/react";

import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { Action } from './types';
import { usePingContext } from './ping';

const ICON = (s: string) => <span className="m-icon">{s}</span>
const ICONSMALL = (s: string) => <span className="m-icon m-icon-small">{s}</span>

const pingAnimation = keyframes({
  '0%': { background: 'rgba(10, 170, 85, 0.9)' },
  '100%': { background: 'rgba(10, 170, 85, 0.0)' },
});

const mountAnimation = keyframes({
  '0%': { background: 'rgba(120, 120, 120, 0.9)' },
  '100%': { background: 'rgba(120, 120, 120, 0.0)' },
});

const shadeAnimation = keyframes({
  '0%': { background: 'rgba(0, 0, 0, 1.0)' },
  '75%': { background: 'rgba(0, 0, 0, 1.0)' },
  '100%': { background: 'rgba(0, 0, 0, 0.0)' },
});

export const StyledLabel = styled('div', {
  position: 'relative',
  zIndex: 1,
});
  
export const StyledNode = styled('div', {
  whiteSpace: 'nowrap',
  margin: '-2px -5px',
  padding: '2px 5px',
  position: 'relative',
  
  '&.mounted, &.pinged': {
    background: 'rgba(0, 0, 0, 1.0)',

    '&.cold': {
      background: 'rgba(0, 0, 0, 0.0)',

      animationName: shadeAnimation,
      animationDuration: '1.0s',
      animationIterationCount: 1,
    }
  },
  
  '&.builtin': {
    color: 'var(--colorTextMuted)',
  },
});

export const StyledHighlight = styled('div', {
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,

  '&&.selected': {
    background: 'rgba(50, 130, 200, 1.0)',
  },

  '&&.hovered': {
    background: 'rgba(50, 180, 200, 1.0)',
  },

  '&&.by': {
    background: 'rgba(30, 140, 160, 1.0)',
  },

  '&&.parents': {
    background: 'rgba(30, 140, 160, 0.65)',
  },

  '&&.depends': {
    background: 'rgba(75, 70, 200, 1.0)',
  },

  '&&.precedes': {
    background: 'rgba(75, 70, 200, 0.65)',
  },

  '&&.staticMount': {
    background: 'rgba(120, 120, 120, 1.0)',
  },

  '&&.staticPing': {
    background: 'rgba(10, 170, 85, 1.0)',
  },
});
  
export const StyledPing = styled('div', {
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,

  '&.cold': {
    animationDuration: '1.0s',
    animationIterationCount: 1,
  },

  '&.mounted': {
    background: 'rgba(120, 120, 120, 0.9)',
    
    '&.cold': {
      background: 'rgba(120, 120, 120, 0.0)',
      animationName: mountAnimation,
    },
  },

  '&.pinged': {
    background: 'rgba(10, 170, 85, 0.9)',

    '&.cold': {
      background: 'rgba(10, 170, 85, 0.0)',
      animationName: pingAnimation,
    }
  },
});

type NodeProps = {
  fiber: LiveFiber<any>,
  pinged?: number,
  staticPing?: boolean,
  staticMount?: boolean,
  selected?: boolean,
  hovered?: number,
  depends?: boolean,
  precedes?: boolean,
  parents?: boolean,
  onClick?: Action,
  onMouseEnter?: Action,
  onMouseLeave?: Action,
};

export const Node: React.FC<NodeProps> = ({
  fiber,
  staticPing,
  staticMount,
  selected,
  hovered,
  depends,
  precedes,
  parents,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const {id, by, f, args, yeeted} = fiber;

  const yeet = yeeted?.value !== undefined;
  const suffix = yeet ? ICONSMALL("switch_left") : null;

  const [version, pinged] = usePingContext(fiber);

  const classes: string[] = version >= 0 ? [version ? 'pinged' : 'mounted'] : [];

  if (!pinged) classes.push('cold');
  if (selected) classes.push('selected');
  if (staticPing) classes.push('staticPing');
  if (staticMount) classes.push('staticMount');
  if (depends) classes.push('depends');
  if (precedes) classes.push('precedes');
  if (parents) classes.push('parents');
  if (hovered === id) classes.push('hovered');
  if (hovered === by) classes.push('by');
  if (f.isLiveBuiltin) classes.push('builtin');
  const className = classes.join(' ');

  const elRef = useRef<HTMLDivElement | null>(null);
  const {current: el} = elRef;

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    onClick && onClick();
  }, [onClick]);

  const name = formatNodeName(fiber);

  return (
    <StyledNode
      ref={elRef}
      className={className}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <StyledPing className={className} />
      <StyledHighlight className={className} />
      <StyledLabel>{name}{suffix}</StyledLabel>
    </StyledNode>
  );
}
