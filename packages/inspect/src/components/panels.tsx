import type { LiveFiber } from '@use-gpu/live';
import type { InspectAddIns } from './types';
import React, { FC, useState } from 'react';
import { styled as _styled } from '@stitches/react';

import { Inset } from './layout';
import { useAddIns } from '../providers/add-in-provider';
import { usePingContext } from '../providers/ping-provider';

const styled: any = _styled;

export type PanelsProps = {
  fiber: LiveFiber<any>,
  fibers: Map<number, LiveFiber<any>>,
};

export const StyledTabList = styled('div', {
  height: '40px',
  borderBottom: '2px solid var(--LiveInspect-backgroundInactive)',
  marginBottom: '10px',
});

export const StyledTab = styled('button', {
  background: 'none',
  font: 'inherit',
  color: 'inherit',
  border: '0',
  padding: '0px 20px',
  lineHeight: '40px',
  height: '40px',
  marginBottom: '-2px',
  borderBottom: '2px solid transparent',
  '&:hover': {
    borderBottom: '3px solid var(--LiveInspect-backgroundHover)',
  },
  '&.active': {
    fontWeight: 'bold',
    color: 'var(--LiveInspect-colorTextActive)',
    borderBottom: '3px solid var(--LiveInspect-backgroundActive)',
  },
});

export const Panels: FC<PanelsProps> = (props: PanelsProps) => {
  const {fiber, fibers} = props;
  
  const addIns = useAddIns();
  
  const {props: panels} = addIns;
  const [first] = panels;
  if (!first) return null;

  usePingContext();

  const active = panels.filter((panel) => panel.enabled(fiber, fibers));
  let [tab, setTab] = useState<string>(first.id);

  if (!active.find((panel) => panel.id === tab)) tab = first.id;
  
  const currentTab = active.find((panel) => panel.id === tab);

  return (
    <Inset>
      <StyledTabList>
        {active.map((panel) => (
          <StyledTab key={panel.id} onClick={() => setTab(panel.id)} className={currentTab === panel ? 'active' : null}>
            {panel.label}
          </StyledTab>
        ))}
      </StyledTabList>
      {fiber ? currentTab!.render(fiber, fibers) : null}
    </Inset>
  );
};
