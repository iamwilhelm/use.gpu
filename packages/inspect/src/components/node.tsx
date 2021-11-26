import { LiveFiber } from '@use-gpu/live/types';
import { formatValue, formatNodeName } from '@use-gpu/live';
import styled, { keyframes } from "styled-components";

import React, { useRef, useEffect } from 'react';
import { Action } from './types';

const ICON = (s: string) => <span className="m-icon">{s}</span>
const ICONSMALL = (s: string) => <span className="m-icon m-icon-small">{s}</span>

const pingAnimation = keyframes`
 0% { background: rgba(255, 230, 0, 1); }
 100% { background: rgba(255, 230, 0, 0); }
`

const selectedAnimation = keyframes`
 0% { background: rgba(210, 190, 128, 1); }
 100% { background: rgba(210, 210, 255, 1); }
`

export const StyledNode = styled.div`
	white-space: nowrap;
	margin: -2px -5px;
	padding: 2px 5px;
	&.selected {
		background: rgba(210, 210, 255, 1);
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
		background: rgba(255, 230, 0, 1);
		
		&.selected {
			background: rgba(210, 190, 128, 1);
		}
	}
`;

type NodeProps = {
	fiber: LiveFiber<any>,
	pinged: number,
	selected: boolean,
	onClick?: Action,
};

export const Node: React.FC<NodeProps> = ({fiber, pinged, selected, onClick}) => {
	const {id, f, args, yeeted} = fiber;

  const yeet = yeeted?.value !== undefined;
  const suffix = yeet ? ICONSMALL("switch_left") : null;

	const classes = [] as string[];
	if (selected) classes.push('selected');
	if (pinged) classes.push('pinged');
	const className = classes.join(' ');

	const elRef = useRef<HTMLDivElement | null>(null);
	const {current: el} = elRef;
	const lastPinged = el && el.classList.contains('pinged');

	useEffect(() => {
		if (lastPinged && el) {
			el.classList.add('repinged');
			el.offsetHeight;
			el.classList.remove('repinged');
		}
	});

	const name = formatNodeName(fiber);

  return <StyledNode ref={elRef} className={className} onClick={onClick}>{name}{suffix}</StyledNode>;
}
